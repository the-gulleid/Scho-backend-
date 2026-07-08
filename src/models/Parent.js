const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    occupation: { type: String },
    address: { type: String },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    relationship: { type: String, enum: ['father', 'mother', 'guardian'], default: 'guardian' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parent', parentSchema);
