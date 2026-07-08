const { School, Student, Teacher, Parent, Class, Subject, Attendance, Assignment } = require('../models');

exports.getSchool = async (req, res, next) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = await School.create({ name: 'School Management System' });
    }
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

exports.updateSchool = async (req, res, next) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = await School.create(req.body);
    } else {
      school = await School.findByIdAndUpdate(school._id, req.body, { new: true });
    }
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [students, teachers, parents, classes, subjects, assignments] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Teacher.countDocuments({ isActive: true }),
      Parent.countDocuments({ isActive: true }),
      Class.countDocuments({ isActive: true }),
      Subject.countDocuments({ isActive: true }),
      Assignment.countDocuments({ isActive: true }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({ date: today, status: 'present' });

    res.json({
      success: true,
      data: {
        students,
        teachers,
        parents,
        classes,
        subjects,
        assignments,
        todayAttendance,
      },
    });
  } catch (error) {
    next(error);
  }
};
