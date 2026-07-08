const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, default: 100 },
    attachments: [{ filename: String, url: String, mimetype: String }],
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        submittedAt: Date,
        file: { filename: String, url: String },
        marks: Number,
        feedback: String,
        status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
