const sdk = require('node-appwrite');
const fs = require('fs');

const client = new sdk.Client();

const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = '6964de76000ced6216b4';
const API_KEY = 'standard_eac4661a4583e9910db9ff6d4d155eeb64815286cc5c0330654f049eef65f0fc8cb5a03017bca47093e99d15a8903f3a8fd798d111046b19daac336792da373382810d2f8fd9f3e9e066cb6a33ecb870517c76cdfb52c9375584c912f270a2abd0e6479bdaf0e3686951cb94ec63ae580a510fd4125256ac0742f7be932d5334';
const DB_ID = 'ihwc_db';
const COLLECTION_ID = 'certificates';

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);

async function listAllStudents() {
    try {
        let allDocuments = [];
        let limit = 100;
        let offset = 0;
        let total = 0;

        process.stdout.write("Fetching documents...");

        do {
            const response = await databases.listDocuments(
                DB_ID,
                COLLECTION_ID,
                [
                    sdk.Query.limit(limit),
                    sdk.Query.offset(offset),
                    sdk.Query.orderDesc('$createdAt')
                ]
            );

            if (response.documents.length > 0) {
                allDocuments.push(...response.documents);
            }
            total = response.total;
            offset += limit;
            process.stdout.write(".");
        } while (offset < total);

        console.log(`\nFetch complete. Total students: ${allDocuments.length}\n`);

        // Create formatted text content
        const header = "Certificate No | Student Name\n" + "=".repeat(50) + "\n";
        const content = allDocuments.map(doc => {
            return `${doc.cert_number.padEnd(15)} | ${doc.student_name}`;
        }).join('\n');

        const fullText = header + content;

        fs.writeFileSync('student_list.txt', fullText);
        console.log('List saved to student_list.txt');
        console.log('\n--- DATA PREVIEW ---\n');
        console.log(fullText);

    } catch (error) {
        console.error('\nError fetching documents:', error);
    }
}

listAllStudents();
