// models/candidateModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Email validation
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    skills: {
        type: [String],
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    resume: {
        type: String, // URL to resume PDF
        required: true,
    },
    appliedJobs: {
        type: [String], // List of job IDs
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

// Hash password before saving candidate
candidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
