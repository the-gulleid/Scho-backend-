const { Result, Exam, Student, Teacher, School } = require('../models');
const ApiError = require('../utils/ApiError');
const { calculateGrade } = require('../utils/helpers');
const { generateReportCardPDF } = require('../services/pdfService');

exports.uploadResults = async (req, res, next) => {
  try {
    const { examId, results } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) throw new ApiError(404, 'Exam not found');

    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) throw new ApiError(404, 'Teacher profile not found');

    const saved = [];
    for (const item of results) {
      const grade = calculateGrade(item.marksObtained, exam.totalMarks);
      const result = await Result.findOneAndUpdate(
        { student: item.studentId, exam: examId },
        {
          student: item.studentId,
          exam: examId,
          subject: exam.subject,
          class: exam.class,
          marksObtained: item.marksObtained,
          totalMarks: exam.totalMarks,
          grade,
          remarks: item.remarks,
          uploadedBy: teacher._id,
        },
        { upsert: true, new: true }
      );
      saved.push(result);
    }

    res.json({ success: true, message: 'Results uploaded', data: saved });
  } catch (error) {
    next(error);
  }
};

exports.getResultsByStudent = async (req, res, next) => {
  try {
    let studentId = req.params.studentId;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) throw new ApiError(404, 'Student profile not found');
      studentId = student._id;
    }

    const results = await Result.find({ student: studentId })
      .populate('exam', 'name type date')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getResultsByExam = async (req, res, next) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate({ path: 'student', populate: { path: 'user', select: 'firstName lastName' } })
      .populate('subject', 'name');

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.generateReportPDF = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('user', 'firstName lastName')
      .populate('class', 'name section');

    if (!student) throw new ApiError(404, 'Student not found');

    const results = await Result.find({ student: req.params.studentId })
      .populate('subject', 'name')
      .populate('exam', 'name');

    const school = await School.findOne();
    const pdfBuffer = await generateReportCardPDF(student, results, school);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${student.studentId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
