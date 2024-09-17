// models/candidateModel.js
const mongoose = require('mongoose');
const User = require("./userModel"); 

const CandidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    education: {
        degree: String,
        institution: String,
        course: String,
        yearOfCompletion: Number,
        graduationDate: Date,
    },
    experience: [{
        companyName: String,
        role: String,
        yearsWorked: Number,
        startDate: Date,
        endDate: Date,

    }],
    resumeLink: {
        type: String,
    },//FILE UPLOAD
    bio: {
        type: String,
    },
    resume: {
        type: String, // This will store the file path
      },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    skills: {
        type: [String],
        required: true,
        default: []
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

const Candidate = mongoose.model('Candidate', CandidateSchema);
module.exports = Candidate;
