const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['midterm', 'final', 'quiz', 'assignment'], default: 'midterm' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, default: 40 },
    duration: { type: Number }, // minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
