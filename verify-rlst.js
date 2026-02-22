const sdk = require('node-appwrite');

const PRIVATE_API_KEY = 'standard_eac4661a4583e9910db9ff6d4d155eeb64815286cc5c0330654f049eef65f0fc8cb5a03017bca47093e99d15a8903f3a8fd798d111046b19daac336792da373382810d2f8fd9f3e9e066cb6a33ecb870517c76cdfb52c9375584c912f270a2abd0e6479bdaf0e3686951cb94ec63ae580a510fd4125256ac0742f7be932d5334';
const CLIENT_PROJECT_ID = '6964de76000ced6216b4';
const CLIENT_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const DB_NAME = 'ihwc_db';
const COLLECTION_NAME = 'certificates';

async function verify() {
    const client = new sdk.Client();
    client.setEndpoint(CLIENT_ENDPOINT).setProject(CLIENT_PROJECT_ID).setKey(PRIVATE_API_KEY);
    const databases = new sdk.Databases(client);

    const response = await databases.listDocuments(DB_NAME, COLLECTION_NAME, [
        sdk.Query.contains('cert_number', ['CWNRLST']),
        sdk.Query.limit(100)
    ]);

    console.log("TOTAL RLST RECORDS:", response.total);
    console.log("COURSE NAME:", response.documents[0]?.course);
    console.log("\n--- RECORDS 0141-0152 ---");

    for (let i = 141; i <= 152; i++) {
        const cert = `IHWC/CWNRLST/0${i}/25`;
        const doc = response.documents.find(d => d.cert_number === cert);
        console.log(`${i}: ${doc ? doc.student_name : "NOT FOUND"}`);
    }
}

verify();
