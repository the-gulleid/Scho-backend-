const { Exam } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getExams = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.classId) filter.class = req.query.classId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;

    const exams = await Exam.find(filter)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .sort({ date: -1 });

    res.json({ success: true, data: exams });
  } catch (error) {
    next(error);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) throw new ApiError(404, 'Exam not found');
    res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    next(error);
  }
};
