const mongoose = require('mongoose');
const Candidate = require("./candidateModel"); 
const Job = require("./jobModel"); 

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
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;
