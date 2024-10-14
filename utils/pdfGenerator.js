const PDFDocument = require('pdfkit');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage();
const bucket = storage.bucket('PDF_FILES');

const generatePDF = async (data) => {
    // Extract the document type and determine the filename
    const type = data.type;  // Assuming 'type' is part of the incoming data
    const date = '20241009'; // Use the appropriate date format
    const number = 'XX'; // Replace this with your logic to generate a unique number
    const fileName = `RK-${type}-${date}${number}.pdf`;
    
    // Correct the path to the uploads directory in the backend folder
    const filePath = path.resolve(__dirname, '../uploads', fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Generate content based on the document type
    if (type === 'QTN') {
        doc.fontSize(20).text('Quotation', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Customer Name: ${data.customerName}`);
        doc.text(`Address: ${data.customerAddress}`);
        doc.text(`Quotation Date: ${data.quotationDate}`);
        doc.moveDown();
        doc.text('Line Items:', { underline: true });
    
        data.lineItems.forEach(item => {
            doc.text(`${item.description} - ${item.quantity} x $${item.price}`);
        });
        doc.moveDown();
        doc.text(`Total Amount: $${data.totalAmount}`, { bold: true });
    } else if (type === 'INV') {
        doc.fontSize(20).text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Invoice To: ${data.customerName}`);
        doc.text(`Address: ${data.customerAddress}`);
        doc.text(`Invoice Date: ${data.invoiceDate}`);
        doc.text(`Due Date: ${data.dueDate}`);
        doc.moveDown();
        doc.text('Line Items:', { underline: true });
        data.lineItems.forEach(item => {
            doc.text(`${item.description} - ${item.quantity} x $${item.price}`);
        });
        doc.moveDown();
        doc.text(`Total Amount Due: $${data.totalAmount}`, { bold: true });
    } else if (type === 'INT') {
        doc.fontSize(20).text('Internship Certificate', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`This is to certify that ${data.internName}`);
        doc.text(`has successfully completed an internship at ${data.companyName}`);
        doc.text(`from ${data.startDate} to ${data.endDate}.`);
        doc.text(`We wish them all the best in their future endeavors.`);
        doc.moveDown();
        doc.text('________________________', { align: 'center' });
        doc.text('Authorized Signature', { align: 'center' });
    }

    doc.end();

    // Upload to Google Cloud Storage
    await bucket.upload(filePath, {
        destination: fileName,
    });

    return fileName;
};

module.exports = { generatePDF };
