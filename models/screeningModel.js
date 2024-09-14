const mongoose = require('mongoose');
const Application = require("./applicationModel"); 


const ScreeningSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  stage1: {
    passed: Boolean,
    skillsMatched: [String],
    skillsMissing: [String]
  },
  stage2: {
    passed: Boolean,
    atsScore: Number,
    expectedSalary: Number
  },
  stage3: {
    passed: Boolean,
    testScore: Number
  },
  currentStage: {
    type: Number,
    default: 1
  },
  finalStatus: {
    type: String,
    enum: ['Pending', 'Selected', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

const Screening = mongoose.model('Screening', ScreeningSchema);
module.exports = Screening;
