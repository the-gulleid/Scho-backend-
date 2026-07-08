const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'School Management System' },
    motto: String,
    address: String,
    phone: String,
    email: String,
    website: String,
    logo: String,
    principalName: String,
    establishedYear: Number,
    academicYear: { type: String, default: '2025-2026' },
    settings: {
      attendanceThreshold: { type: Number, default: 75 },
      gradingSystem: { type: String, default: 'percentage' },
      enableNotifications: { type: Boolean, default: true },
      enableChat: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);
