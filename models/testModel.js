const mongoose = require('mongoose');
const Job = require("./jobModel");

const TestSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    score: Number // Add score field
  }],
  img: {
    type: String,
  },
  duration: Number // in minutes
}, { timestamps: true });

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;