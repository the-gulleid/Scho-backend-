const PDFDocument = require('pdfkit');

/**
 * Generate student report card PDF buffer
 */
const generateReportCardPDF = (student, results, school) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text(school?.name || 'School Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Student Report Card', { align: 'center' });
    doc.moveDown();

    const user = student.user;
    doc.fontSize(12);
    doc.text(`Name: ${user?.firstName || ''} ${user?.lastName || ''}`);
    doc.text(`Student ID: ${student.studentId}`);
    doc.text(`Class: ${student.class?.name || 'N/A'} - ${student.class?.section || ''}`);
    doc.text(`Academic Year: ${school?.academicYear || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(14).text('Exam Results');
    doc.moveDown(0.5);

    let totalObtained = 0;
    let totalMarks = 0;

    results.forEach((result) => {
      doc.fontSize(11).text(
        `${result.subject?.name || 'Subject'}: ${result.marksObtained}/${result.totalMarks} (${result.grade})`
      );
      totalObtained += result.marksObtained;
      totalMarks += result.totalMarks;
    });

    doc.moveDown();
    if (totalMarks > 0) {
      const percentage = ((totalObtained / totalMarks) * 100).toFixed(2);
      doc.fontSize(12).text(`Overall: ${totalObtained}/${totalMarks} (${percentage}%)`);
    }

    doc.end();
  });
};

module.exports = { generateReportCardPDF };
