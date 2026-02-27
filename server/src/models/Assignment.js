const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    tables: [
      {
        tableName: String,
        columns: [
          {
            name: { type: String },
            dataType: { type: String },
          },
        ],
      },
    ],
    sampleQuery: { type: String, default: '' },   // admin-only reference answer
    expectedOutput: { type: String, default: '' }, // optional expected result hint
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
