const { Subject } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getSubjects = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.classId) filter.class = req.query.classId;

    const subjects = await Subject.find(filter)
      .populate('teacher', 'employeeId')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'firstName lastName' } })
      .populate('class', 'name section')
      .sort({ name: 1 });

    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate({ path: 'teacher', populate: { path: 'user' } })
      .populate('class');

    if (!subject) throw new ApiError(404, 'Subject not found');
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) throw new ApiError(404, 'Subject not found');
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    await Subject.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Subject deactivated' });
  } catch (error) {
    next(error);
  }
};
