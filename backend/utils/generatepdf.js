import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoicePDF = (invoice, path) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path));
    doc.fontSize(18).text(`Invoice: ${invoice.invoiceNumber}`);
    doc.moveDown();
    invoice.items.forEach(item => {
      doc.text(`${item.description} - ${item.amount}`);
    });
    doc.end();
    resolve(path);
  });
};
