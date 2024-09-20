const mongoose = require('mongoose');
const Job = require("./jobModel"); 
const Candidate = require("./candidateModel"); 
const Test = require("./testModel"); 

const TestResultSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  responses: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: Number
  }],
  score: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const TestResult = mongoose.model('TestResult', TestResultSchema);
module.exports = TestResult;