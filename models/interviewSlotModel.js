const mongoose = require('mongoose');
const Job = require("./jobModel"); 
const Application = require("./applicationModel"); 

const InterviewSlotSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  calendlyEventTypeId: {
    type: String,
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  meetingLink: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const InterviewSlot = mongoose.model('InterviewSlot', InterviewSlotSchema);
module.exports = InterviewSlot;
