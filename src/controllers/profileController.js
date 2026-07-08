const { Student } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', '-password')
      .populate('class')
      .populate({ path: 'parent', populate: { path: 'user', select: 'firstName lastName phone email' } });

    if (!student) throw new ApiError(404, 'Student profile not found');
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};
