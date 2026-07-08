const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['announcement', 'attendance', 'result', 'assignment', 'general'],
      default: 'general',
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    targetRoles: [{ type: String, enum: ['admin', 'teacher', 'student', 'parent'] }],
    targetClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    isRead: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: Date }],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    attachment: { filename: String, url: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
