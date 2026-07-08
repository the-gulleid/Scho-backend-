const { Attendance, Student, Teacher } = require('../models');
const ApiError = require('../utils/ApiError');

exports.markAttendance = async (req, res, next) => {
  try {
    const { classId, date, records } = req.body;
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) throw new ApiError(404, 'Teacher profile not found');

    const results = [];
    for (const record of records) {
      const attendance = await Attendance.findOneAndUpdate(
        { student: record.studentId, date: new Date(date) },
        {
          student: record.studentId,
          class: classId,
          date: new Date(date),
          status: record.status,
          markedBy: teacher._id,
          remarks: record.remarks,
        },
        { upsert: true, new: true }
      );
      results.push(attendance);
    }

    res.json({ success: true, message: 'Attendance marked', data: results });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceByClass = async (req, res, next) => {
  try {
    const { classId, date } = req.query;
    const query = { class: classId };
    if (date) query.date = new Date(date);

    const attendance = await Attendance.find(query)
      .populate({ path: 'student', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ date: -1 });

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    let studentId = req.params.studentId;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) throw new ApiError(404, 'Student profile not found');
      studentId = student._id;
    }

    const { startDate, endDate } = req.query;
    const query = { student: studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    const total = records.length;
    const present = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: { records, summary: { total, present, absent: total - present, percentage } },
    });
  } catch (error) {
    next(error);
  }
};
