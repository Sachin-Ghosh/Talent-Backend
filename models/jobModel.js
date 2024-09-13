// models/Job.js
const mongoose = require('mongoose');
const Employer = require("./employerModel"); 
const Candidate = require("./candidateModel"); 

const JobSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        required: true,
    },
    experienceRequired: {
        type: Number,
        required: true,
    },
    salaryRange: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    // applicants: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Candidate',
    // }],
    // status: {
    //     type: String,
    //     enum: ['Open', 'Closed'],
    //     default: 'Open',
    // },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;
