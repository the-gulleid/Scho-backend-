const { Assignment, Student, Teacher } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getAssignments = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.classId) filter.class = req.query.classId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;

    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ dueDate: -1 });

    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject class')
      .populate({ path: 'teacher', populate: { path: 'user' } })
      .populate({ path: 'submissions.student', populate: { path: 'user', select: 'firstName lastName' } });

    if (!assignment) throw new ApiError(404, 'Assignment not found');
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) throw new ApiError(404, 'Teacher profile not found');

    const attachments = req.files?.map((f) => ({
      filename: f.filename,
      url: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
    }));

    const assignment = await Assignment.create({
      ...req.body,
      teacher: teacher._id,
      attachments: attachments || [],
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) throw new ApiError(404, 'Student profile not found');

    const file = req.file
      ? { filename: req.file.filename, url: `/uploads/${req.file.filename}` }
      : null;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { submissions: { student: student._id } },
      },
      { new: true }
    );

    assignment.submissions.push({
      student: student._id,
      submittedAt: new Date(),
      file,
      status: 'submitted',
    });
    await assignment.save();

    res.json({ success: true, message: 'Assignment submitted', data: assignment });
  } catch (error) {
    next(error);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { studentId, marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) throw new ApiError(404, 'Assignment not found');

    const submission = assignment.submissions.find((s) => s.student.toString() === studentId);
    if (!submission) throw new ApiError(404, 'Submission not found');

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'graded';
    await assignment.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
};
