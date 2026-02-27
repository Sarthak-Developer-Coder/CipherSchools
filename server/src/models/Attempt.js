const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    query: { type: String, required: true },
    success: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
