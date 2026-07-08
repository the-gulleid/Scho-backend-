const { Class, Teacher, Subject } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate('classTeacher', 'employeeId')
      .populate({ path: 'classTeacher', populate: { path: 'user', select: 'firstName lastName' } })
      .populate('subjects', 'name code')
      .sort({ name: 1, section: 1 });

    res.json({ success: true, data: classes });
  } catch (error) {
    next(error);
  }
};

exports.getClass = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate({ path: 'classTeacher', populate: { path: 'user' } })
      .populate('students')
      .populate('subjects')
      .populate({ path: 'students', populate: { path: 'user', select: 'firstName lastName' } });

    if (!classData) throw new ApiError(404, 'Class not found');
    res.json({ success: true, data: classData });
  } catch (error) {
    next(error);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const classData = await Class.create(req.body);
    res.status(201).json({ success: true, data: classData });
  } catch (error) {
    next(error);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!classData) throw new ApiError(404, 'Class not found');
    res.json({ success: true, data: classData });
  } catch (error) {
    next(error);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    await Class.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Class deactivated' });
  } catch (error) {
    next(error);
  }
};

exports.updateTimetable = async (req, res, next) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      { timetable: req.body.timetable },
      { new: true }
    ).populate('timetable.periods.subject timetable.periods.teacher');

    if (!classData) throw new ApiError(404, 'Class not found');
    res.json({ success: true, data: classData });
  } catch (error) {
    next(error);
  }
};
