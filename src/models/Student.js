const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, unique: true, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
    admissionDate: { type: Date, default: Date.now },
    bloodGroup: String,
    emergencyContact: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
