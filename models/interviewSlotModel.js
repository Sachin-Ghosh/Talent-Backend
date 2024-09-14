const mongoose = require('mongoose');
const Job = require("./jobModel"); 
const Application = require("./applicationModel"); 

const InterviewSlotSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  meetingLink: {
    type: String,
    required: true,
  },
  availableSlots: [{
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

const InterviewSlot = mongoose.model('InterviewSlot', InterviewSlotSchema);
module.exports = InterviewSlot;
