const mongoose = require('mongoose');

const Employer = require("./employerModel"); 
const Job = require("./jobModel"); 

const OnboardingTaskSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer', // Assuming you have an Employer model
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Assuming you have a Job model
    required: true
  },
  taskDescription: {
    type: String,
    required: true,
  },
  requestedDocuments: [{
    documentName: String,
    required: Boolean
  }],
  uploadedFiles: [{
    fileName: String,
    filePath: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  }
}, { timestamps: true });

const OnboardingTask = mongoose.model('OnboardingTask', OnboardingTaskSchema);
module.exports = OnboardingTask;