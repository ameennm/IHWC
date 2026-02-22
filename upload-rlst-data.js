const sdk = require('node-appwrite');

// ===================================
// CONFIGURATION
// ===================================
const PRIVATE_API_KEY = 'standard_eac4661a4583e9910db9ff6d4d155eeb64815286cc5c0330654f049eef65f0fc8cb5a03017bca47093e99d15a8903f3a8fd798d111046b19daac336792da373382810d2f8fd9f3e9e066cb6a33ecb870517c76cdfb52c9375584c912f270a2abd0e6479bdaf0e3686951cb94ec63ae580a510fd4125256ac0742f7be932d5334';
const CLIENT_PROJECT_ID = '6964de76000ced6216b4';
const CLIENT_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DB_NAME = 'ihwc_db';
const COLLECTION_NAME = 'certificates';

// RLST Course Data
const COMMON_DATA = {
    course: "RELATIONSHIP, LOVE AND SEX THERAPY",
    duration: "3 Months",
    institution: "Canwin International",
    issue_date: "2025-01-17"
};

// The 51 students for RLST course
const students = [
    { student_name: "RAVINA PC", cert_number: "IHWC/CWNRLST/0101/25" },
    { student_name: "SAIFUNNISA K", cert_number: "IHWC/CWNRLST/0102/25" },
    { student_name: "SUMAYA PV", cert_number: "IHWC/CWNRLST/0103/25" },
    { student_name: "RASHEEKA TP", cert_number: "IHWC/CWNRLST/0104/25" },
    { student_name: "SAFNA PV", cert_number: "IHWC/CWNRLST/0105/25" },
    { student_name: "ANILA SURESH P", cert_number: "IHWC/CWNRLST/0106/25" },
    { student_name: "SUMAYYA KK", cert_number: "IHWC/CWNRLST/0107/25" },
    { student_name: "NOUSHEENA TA", cert_number: "IHWC/CWNRLST/0108/25" },
    { student_name: "FATHIMA SAFVANA V", cert_number: "IHWC/CWNRLST/0109/25" },
    { student_name: "SABANA RAHMAN TT", cert_number: "IHWC/CWNRLST/0110/25" },
    { student_name: "MINI PS", cert_number: "IHWC/CWNRLST/0111/25" },
    { student_name: "SEENATH PM", cert_number: "IHWC/CWNRLST/0112/25" },
    { student_name: "FATHIMA SHEZA KP", cert_number: "IHWC/CWNRLST/0113/25" },
    { student_name: "FARSANA JAMSHEER", cert_number: "IHWC/CWNRLST/0114/25" },
    { student_name: "MUMTHAS OTHIYOTH", cert_number: "IHWC/CWNRLST/0115/25" },
    { student_name: "DEEPA RAMAKRISHNAN", cert_number: "IHWC/CWNRLST/0116/25" },
    { student_name: "RAZEENA BEEGAM VF", cert_number: "IHWC/CWNRLST/0117/25" },
    { student_name: "RESHMA R", cert_number: "IHWC/CWNRLST/0118/25" },
    { student_name: "SAJINA P", cert_number: "IHWC/CWNRLST/0119/25" },
    { student_name: "SABEENA KC", cert_number: "IHWC/CWNRLST/0120/25" },
    { student_name: "VEDHA ANILAN", cert_number: "IHWC/CWNRLST/0121/25" },
    { student_name: "SAHEEKA", cert_number: "IHWC/CWNRLST/0122/25" },
    { student_name: "AMANI ABBAS", cert_number: "IHWC/CWNRLST/0123/25" },
    { student_name: "NUSRATH KOLAKKATTIL", cert_number: "IHWC/CWNRLST/0124/25" },
    { student_name: "FATHIMA RISHANA CP", cert_number: "IHWC/CWNRLST/0125/25" },
    { student_name: "THAFSEELA KT", cert_number: "IHWC/CWNRLST/0126/25" },
    { student_name: "ZAINABI", cert_number: "IHWC/CWNRLST/0127/25" },
    { student_name: "NAJMUNNEESA PULLUTHODIYIL", cert_number: "IHWC/CWNRLST/0128/25" },
    { student_name: "MAIMOONATH BEEBI CA", cert_number: "IHWC/CWNRLST/0129/25" },
    { student_name: "SAJNA VALLIKKADAN", cert_number: "IHWC/CWNRLST/0130/25" },
    { student_name: "SABNA JASMINE KP", cert_number: "IHWC/CWNRLST/0131/25" },
    { student_name: "AYISA SABNA KT", cert_number: "IHWC/CWNRLST/0132/25" },
    { student_name: "RADHAMANI. C", cert_number: "IHWC/CWNRLST/0133/25" },
    { student_name: "AMBILY GS", cert_number: "IHWC/CWNRLST/0134/25" },
    { student_name: "SHEHARSAD EK", cert_number: "IHWC/CWNRLST/0135/25" },
    { student_name: "MUBEENA P", cert_number: "IHWC/CWNRLST/0136/25" },
    { student_name: "HANA. L", cert_number: "IHWC/CWNRLST/0137/25" },
    { student_name: "JUSAILA CA", cert_number: "IHWC/CWNRLST/0138/25" },
    { student_name: "NAHIDHA MANAF PA", cert_number: "IHWC/CWNRLST/0139/25" },
    { student_name: "SAHITHA H", cert_number: "IHWC/CWNRLST/0140/25" },
    { student_name: "MUHAMMED ASLAM. C", cert_number: "IHWC/CWNRLST/0141/25" },
    { student_name: "JABIR KOVIL THARAMAL", cert_number: "IHWC/CWNRLST/0142/25" },
    { student_name: "MAHESH T", cert_number: "IHWC/CWNRLST/0143/25" },
    { student_name: "NASEER M", cert_number: "IHWC/CWNRLST/0144/25" },
    { student_name: "MUHAMMAD NOORSHA N", cert_number: "IHWC/CWNRLST/0145/25" },
    { student_name: "MUHAMMED AMEEN", cert_number: "IHWC/CWNRLST/0146/25" },
    { student_name: "JAYAFER VK", cert_number: "IHWC/CWNRLST/0147/25" },
    { student_name: "AMEER MEMANA", cert_number: "IHWC/CWNRLST/0148/25" },
    { student_name: "SUNIL KUMAR KK", cert_number: "IHWC/CWNRLST/0149/25" },
    { student_name: "JOJI PARAKKAL JOSEPH", cert_number: "IHWC/CWNRLST/0150/25" },
    { student_name: "EBIN JOLLY", cert_number: "IHWC/CWNRLST/0151/25" }
];

async function uploadData() {
    console.log('🚀 Starting RLST Course Data Upload...');
    console.log(`📚 Course: ${COMMON_DATA.course}`);
    console.log(`⏱️  Duration: ${COMMON_DATA.duration}`);
    console.log(`🏛️  Institute: ${COMMON_DATA.institution}`);
    console.log(`📋 Total Students: ${students.length}\n`);

    const client = new sdk.Client();
    client
        .setEndpoint(CLIENT_ENDPOINT)
        .setProject(CLIENT_PROJECT_ID)
        .setKey(PRIVATE_API_KEY);

    const databases = new sdk.Databases(client);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const student of students) {
        try {
            // Check if already exists
            const existing = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
                sdk.Query.equal('cert_number', [student.cert_number])
            ]);

            if (existing.total > 0) {
                console.log(`⚠️  Skipping ${student.cert_number} - ${student.student_name} (Already exists)`);
                skipCount++;
                continue;
            }

            const payload = {
                ...COMMON_DATA,
                cert_number: student.cert_number,
                student_name: student.student_name
            };

            await databases.createDocument(
                DB_NAME,
                COLLECTION_NAME,
                sdk.ID.unique(),
                payload
            );

            console.log(`✅ Uploaded: ${student.student_name} (${student.cert_number})`);
            successCount++;

            // Rate limit protection
            await new Promise(r => setTimeout(r, 200));

        } catch (error) {
            console.error(`❌ Failed: ${student.student_name} - ${error.message}`);
            failCount++;
        }
    }

    console.log('\n===================================');
    console.log('🎉 UPLOAD SUMMARY - RLST COURSE');
    console.log('===================================');
    console.log(`✅ Successfully Uploaded: ${successCount}`);
    console.log(`⚠️  Skipped (Duplicates): ${skipCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total Processed: ${students.length}`);
    console.log('===================================');
}

uploadData();
