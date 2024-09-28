const mongoose = require('mongoose');

const Candidate = require("./candidateModel"); 
const OnboardingTask = require("./onboardingTaskModel"); 

const DocumentUploadStatusSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  onboardingTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnboardingTask',
    required: true
  },
  documentName: {
    type: String,
    required: true
  },
  isUploaded: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const DocumentUploadStatus = mongoose.model('DocumentUploadStatus', DocumentUploadStatusSchema);
module.exports = DocumentUploadStatus;