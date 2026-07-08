const { Teacher, User, Class } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateEmployeeId } = require('../utils/helpers');

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isActive: true })
      .populate('user', 'firstName lastName email phone avatar')
      .populate('subjects', 'name code')
      .populate('classes', 'name section')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', '-password')
      .populate('subjects')
      .populate('classes');

    if (!teacher) throw new ApiError(404, 'Teacher not found');
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherByUser = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id })
      .populate('user', '-password')
      .populate('subjects')
      .populate('classes');

    if (!teacher) throw new ApiError(404, 'Teacher profile not found');
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, ...teacherData } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password || 'Teacher@123',
      phone,
      role: 'teacher',
    });

    const employeeId = await generateEmployeeId(Teacher);
    const teacher = await Teacher.create({
      user: user._id,
      employeeId,
      ...teacherData,
    });

    const populated = await Teacher.findById(teacher._id)
      .populate('user', 'firstName lastName email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) throw new ApiError(404, 'Teacher not found');

    const { firstName, lastName, phone, ...teacherData } = req.body;
    if (firstName || lastName || phone) {
      await User.findByIdAndUpdate(teacher.user, { firstName, lastName, phone });
    }

    const updated = await Teacher.findByIdAndUpdate(req.params.id, teacherData, { new: true })
      .populate('user', 'firstName lastName email phone')
      .populate('subjects classes');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) throw new ApiError(404, 'Teacher not found');

    await Teacher.findByIdAndUpdate(req.params.id, { isActive: false });
    await User.findByIdAndUpdate(teacher.user, { isActive: false });

    res.json({ success: true, message: 'Teacher deactivated' });
  } catch (error) {
    next(error);
  }
};
