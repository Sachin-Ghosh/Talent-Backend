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
    meetingLink: { // New field for meeting link
        type: String,
        required: true,
    },
    bookedSlot: { // New field for booked slot details
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSlot', // Reference to the InterviewSlot model
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