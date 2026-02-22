const sdk = require('node-appwrite');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const client = new sdk.Client();

// Appwrite Configuration
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

async function generatePDF() {
    try {
        console.log("Fetching data...");
        let allDocuments = [];
        let limit = 100;
        let offset = 0;
        let total = 0;

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
        } while (offset < total);

        console.log(`Fetched ${allDocuments.length} records. Generating PDF...`);

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream('student_list.pdf');
        doc.pipe(writeStream);

        // Header
        doc.fontSize(20).text('IHWC Student List', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown();

        // Table Configuration
        const tableTop = 150;
        const col1Left = 50;
        const col2Left = 200;
        const rowHeight = 25;

        // Table Header
        doc.font('Helvetica-Bold');
        doc.text('Certificate No', col1Left, tableTop);
        doc.text('Student Name', col2Left, tableTop);

        // Draw Header Line
        doc.moveTo(50, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        let y = tableTop + 25;
        doc.font('Helvetica');

        allDocuments.forEach((student, i) => {
            // Check for new page
            if (y > 700) {
                doc.addPage();
                y = 50; // Reset y

                // Redraw header on new page (optional, but good for tables)
                doc.font('Helvetica-Bold');
                doc.text('Certificate No', col1Left, y);
                doc.text('Student Name', col2Left, y);
                doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
                doc.font('Helvetica');
                y += 25;
            }

            doc.text(student.cert_number, col1Left, y);
            doc.text(student.student_name, col2Left, y);

            // Draw row line (optional, maybe just light gray?)
            doc.strokeColor('#aaaaaa')
                .lineWidth(0.5)
                .moveTo(50, y + 15)
                .lineTo(550, y + 15)
                .stroke();

            // Reset stroke color
            doc.strokeColor('black').lineWidth(1);

            y += rowHeight;
        });

        doc.end();

        writeStream.on('finish', () => {
            console.log('PDF generated successfully: student_list.pdf');
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

generatePDF();
