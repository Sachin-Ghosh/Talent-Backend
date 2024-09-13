// models/OnboardingTask.js
const mongoose = require('mongoose');

const Candidate = require("./candidateModel"); 

const OnboardingTaskSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    taskDescription: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
}, { timestamps: true });

const OnboardingTask = mongoose.model('OnboardingTask', OnboardingTaskSchema);
module.exports = OnboardingTask;
