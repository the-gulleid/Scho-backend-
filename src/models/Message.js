const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachment: { filename: String, url: String, mimetype: String },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    conversationId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
