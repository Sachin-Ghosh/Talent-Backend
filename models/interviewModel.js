// models/Interview.js
const mongoose = require('mongoose');

const Job = require("./jobModel"); 
const Candidate = require("./candidateModel"); 


const InterviewSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    interviewDate: {
        type: Date,
        required: true,
    },
    interviewStatus: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
    feedback: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    updatedAt: {
        type: Date,
        default: Date.now,
      }
}, { timestamps: true });

const Interview = mongoose.model('Interview', InterviewSchema);
module.exports = Interview;
