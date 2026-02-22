const sdk = require('node-appwrite');

// ===================================
// CONFIGURATION
// ===================================
const PRIVATE_API_KEY = 'standard_eac4661a4583e9910db9ff6d4d155eeb64815286cc5c0330654f049eef65f0fc8cb5a03017bca47093e99d15a8903f3a8fd798d111046b19daac336792da373382810d2f8fd9f3e9e066cb6a33ecb870517c76cdfb52c9375584c912f270a2abd0e6479bdaf0e3686951cb94ec63ae580a510fd4125256ac0742f7be932d5334';
const CLIENT_PROJECT_ID = '6964de76000ced6216b4';
const CLIENT_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DB_NAME = 'ihwc_db';
const COLLECTION_NAME = 'certificates';

// The CORRECT course name format
const CORRECT_COURSE_NAME = "RLST(RELATIONSHIP, LOVE AND SEX THERAPY)";

// The updated student mappings for positions 41-52
// Key: Certificate number, Value: Correct student name
const UPDATED_STUDENTS = {
    "IHWC/CWNRLST/0141/25": "NUSRATH. K",
    "IHWC/CWNRLST/0142/25": "MUHAMMED ASLAM. C",
    "IHWC/CWNRLST/0143/25": "JABIR KOVIL THARAMAL",
    "IHWC/CWNRLST/0144/25": "MAHESH T",
    "IHWC/CWNRLST/0145/25": "NASEER M",
    "IHWC/CWNRLST/0146/25": "MUHAMMAD NOORSHA N",
    "IHWC/CWNRLST/0147/25": "MUHAMMED AMEEN",
    "IHWC/CWNRLST/0148/25": "JAYAFER VK",
    "IHWC/CWNRLST/0149/25": "AMEER MEMANA",
    "IHWC/CWNRLST/0150/25": "SUNIL KUMAR KK",
    "IHWC/CWNRLST/0151/25": "JOJI PARAKKAL JOSEPH",
    "IHWC/CWNRLST/0152/25": "EBIN JOLLY"  // New record
};

async function fixRLSTData() {
    console.log('🚀 Starting RLST Data Fix...\n');

    const client = new sdk.Client();
    client
        .setEndpoint(CLIENT_ENDPOINT)
        .setProject(CLIENT_PROJECT_ID)
        .setKey(PRIVATE_API_KEY);

    const databases = new sdk.Databases(client);

    // ===================================
    // STEP 1: Update course name for ALL existing RLST records
    // ===================================
    console.log('📝 STEP 1: Updating course name for all RLST records...\n');

    try {
        // Get all documents with CWNRLST in cert_number (RLST course)
        const allRLST = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
            sdk.Query.contains('cert_number', ['CWNRLST']),
            sdk.Query.limit(100)
        ]);

        console.log(`   Found ${allRLST.total} RLST records to update.\n`);

        let courseUpdateCount = 0;
        for (const doc of allRLST.documents) {
            if (doc.course !== CORRECT_COURSE_NAME) {
                await databases.updateDocument(DB_NAME, COLLECTION_NAME, doc.$id, {
                    course: CORRECT_COURSE_NAME
                });
                console.log(`   ✅ Updated course name for: ${doc.student_name}`);
                courseUpdateCount++;
                await new Promise(r => setTimeout(r, 150));
            }
        }
        console.log(`\n   📊 Updated ${courseUpdateCount} records with correct course name.\n`);
    } catch (error) {
        console.error(`   ❌ Error updating course names: ${error.message}\n`);
    }

    // ===================================
    // STEP 2: Shift existing records (0141-0151) to make room
    // ===================================
    console.log('🔄 STEP 2: Shifting records 0141-0151 to 0142-0152...\n');

    // We need to shift backwards to avoid collisions
    for (let i = 151; i >= 141; i--) {
        const oldCert = `IHWC/CWNRLST/0${i}/25`;
        const newCert = `IHWC/CWNRLST/0${i + 1}/25`;

        try {
            const response = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
                sdk.Query.equal('cert_number', [oldCert])
            ]);

            if (response.total === 0) {
                console.log(`   ⚠️ ${oldCert} not found, skipping.`);
                continue;
            }

            const doc = response.documents[0];
            await databases.updateDocument(DB_NAME, COLLECTION_NAME, doc.$id, {
                cert_number: newCert
            });
            console.log(`   ✅ Shifted: ${doc.student_name} (${oldCert} → ${newCert})`);
            await new Promise(r => setTimeout(r, 150));

        } catch (error) {
            console.error(`   ❌ Error shifting ${oldCert}: ${error.message}`);
        }
    }

    // ===================================
    // STEP 3: Insert new student at 0141
    // ===================================
    console.log('\n➕ STEP 3: Adding new student NUSRATH. K at 0141...\n');

    try {
        const newCert = "IHWC/CWNRLST/0141/25";

        // Check if slot is free
        const check = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
            sdk.Query.equal('cert_number', [newCert])
        ]);

        if (check.total === 0) {
            await databases.createDocument(DB_NAME, COLLECTION_NAME, sdk.ID.unique(), {
                cert_number: newCert,
                student_name: "NUSRATH. K",
                course: CORRECT_COURSE_NAME,
                duration: "3 Months",
                institution: "Canwin International",
                issue_date: "2025-01-17"
            });
            console.log(`   ✅ Created: NUSRATH. K (${newCert})`);
        } else {
            console.log(`   ⚠️ Slot ${newCert} already occupied, updating name...`);
            await databases.updateDocument(DB_NAME, COLLECTION_NAME, check.documents[0].$id, {
                student_name: "NUSRATH. K",
                course: CORRECT_COURSE_NAME
            });
            console.log(`   ✅ Updated existing record at ${newCert}`);
        }
    } catch (error) {
        console.error(`   ❌ Error adding NUSRATH. K: ${error.message}`);
    }

    // ===================================
    // STEP 4: Verify final state
    // ===================================
    console.log('\n🔍 STEP 4: Verifying final records 0141-0152...\n');

    for (let i = 141; i <= 152; i++) {
        const cert = `IHWC/CWNRLST/0${i}/25`;
        const expectedName = UPDATED_STUDENTS[cert];

        try {
            const response = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
                sdk.Query.equal('cert_number', [cert])
            ]);

            if (response.total > 0) {
                const doc = response.documents[0];
                const match = doc.student_name === expectedName ? "✅" : "⚠️";
                console.log(`   ${match} ${cert}: ${doc.student_name} (Expected: ${expectedName})`);
            } else {
                console.log(`   ❌ ${cert}: NOT FOUND (Expected: ${expectedName})`);
            }
        } catch (error) {
            console.error(`   ❌ Error checking ${cert}: ${error.message}`);
        }
    }

    console.log('\n===================================');
    console.log('🎉 RLST DATA FIX COMPLETE!');
    console.log('===================================');
    console.log(`Course Name: ${CORRECT_COURSE_NAME}`);
    console.log('Total Students: 52 (0101-0152)');
    console.log('===================================');
}

fixRLSTData();
