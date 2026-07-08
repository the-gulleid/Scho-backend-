const { Student, User, Class, Parent } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateStudentId } = require('../utils/helpers');

exports.getStudents = async (req, res, next) => {
  try {
    const { search, classId, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (classId) query.class = classId;

    let students = await Student.find(query)
      .populate('user', 'firstName lastName email phone avatar')
      .populate('class', 'name section academicYear')
      .populate('parent')
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.studentId.toLowerCase().includes(searchLower) ||
          s.user?.firstName?.toLowerCase().includes(searchLower) ||
          s.user?.lastName?.toLowerCase().includes(searchLower)
      );
    }

    const start = (page - 1) * limit;
    const paginated = students.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: paginated,
      pagination: { total: students.length, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', '-password')
      .populate('class')
      .populate({ path: 'parent', populate: { path: 'user', select: 'firstName lastName email phone' } });

    if (!student) throw new ApiError(404, 'Student not found');
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, classId, parentId, ...studentData } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password || 'Student@123',
      phone,
      role: 'student',
    });

    const studentId = await generateStudentId(Student);
    const student = await Student.create({
      user: user._id,
      studentId,
      class: classId,
      parent: parentId,
      ...studentData,
    });

    if (classId) {
      await Class.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
    }
    if (parentId) {
      await Parent.findByIdAndUpdate(parentId, { $addToSet: { children: student._id } });
    }

    const populated = await Student.findById(student._id)
      .populate('user', 'firstName lastName email')
      .populate('class', 'name section');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) throw new ApiError(404, 'Student not found');

    const { firstName, lastName, phone, classId, ...studentData } = req.body;

    if (firstName || lastName || phone) {
      await User.findByIdAndUpdate(student.user, { firstName, lastName, phone });
    }

    if (classId && classId !== student.class?.toString()) {
      if (student.class) {
        await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
      }
      await Class.findByIdAndUpdate(classId, { $addToSet: { students: student._id } });
      studentData.class = classId;
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, studentData, { new: true })
      .populate('user', 'firstName lastName email phone')
      .populate('class', 'name section');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) throw new ApiError(404, 'Student not found');

    await Student.findByIdAndUpdate(req.params.id, { isActive: false });
    await User.findByIdAndUpdate(student.user, { isActive: false });

    res.json({ success: true, message: 'Student deactivated' });
  } catch (error) {
    next(error);
  }
};
