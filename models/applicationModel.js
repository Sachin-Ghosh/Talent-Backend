const mongoose = require('mongoose');
const Candidate = require("./candidateModel"); 
const Job = require("./jobModel"); 
const Screening = require("./screeningModel"); 

const ApplicationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'In Review', 'Interviewed', 'Offered', 'Rejected'],
        default: 'Applied',
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
    screeningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screening'
    },
    expectedSalary: Number
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;
