const mongoose = require('mongoose');
const User = require("./userModel"); 

const EmployerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    jobPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
}, { timestamps: true });

const Employer = mongoose.model('Employer', EmployerSchema);
module.exports = Employer;
