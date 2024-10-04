const InterviewSlot = require('../models/interviewSlotModel');
const Application = require('../models/applicationModel');
const Interview = require('../models/interviewModel'); // Import the Interview model
const { sendEmail } = require('../utils/emailService');

exports.createInterviewSlot = async (req, res) => {
  const { jobId, meetingLink, availableSlots } = req.body;

  try {
    const interviewSlot = new InterviewSlot({ 
      jobId, 
      meetingLink,
      availableSlots
    });
    await interviewSlot.save();

    res.status(201).json({ message: 'Interview slot created successfully', interviewSlot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  const { jobId } = req.params;

  try {
    const interviewSlots = await InterviewSlot.find({ jobId });
    if (interviewSlots.length === 0) {
      return res.status(404).json({ message: 'No interview slots found for this job' });
    }

    const availableSlots = interviewSlots.flatMap(slot => slot.availableSlots);

    // Log the raw data before sending the response
    // console.log('Interview Slots:', JSON.stringify(interviewSlots, null, 2));
    // console.log('Available Slots:', JSON.stringify(availableSlots, null, 2)); // Log available slots

    res.status(200).json({ 
      meetingLink: interviewSlots[0].meetingLink,
      availableSlots: availableSlots 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bookInterviewSlot = async (req, res) => {
  const { jobId, slotId, applicationId } = req.body;

  try {
    const interviewSlot = await InterviewSlot.findOne({
      jobId,
      'availableSlots._id': slotId
    });

    if (!interviewSlot) {
      return res.status(404).json({ message: 'Interview slot not found' });
    }

    const slot = interviewSlot.availableSlots.id(slotId);
    
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const application = await Application.findById(applicationId).populate('candidateId jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Mark the slot as booked
    slot.isBooked = true;
    slot.applicationId = applicationId;

    // Save the updated interviewSlot document
    await interviewSlot.save();

    // Create a new Interview document
    const interview = new Interview({
      jobId,
      candidateId: application.candidateId._id,
      interviewDate: slot.start, // Assuming the start time of the slot is the interview date
      meetingLink: interviewSlot.meetingLink, // Save the meeting link
      bookedSlot: slotId // Save the booked slot ID
    });

    await interview.save(); // Save the interview

    res.status(200).json({ message: 'Interview slot booked successfully', slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateInterviewSlot = async (req, res) => {
  const { jobId } = req.params;
  const { meetingLink, availableSlots } = req.body;

  try {
    const interviewSlot = await InterviewSlot.findOne({ jobId });
    if (!interviewSlot) {
      return res.status(404).json({ message: 'Interview slot not found' });
    }

    if (meetingLink) interviewSlot.meetingLink = meetingLink;
    if (availableSlots) interviewSlot.availableSlots = availableSlots;

    await interviewSlot.save();

    res.status(200).json({ message: 'Interview slot updated successfully', interviewSlot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteInterviewSlot = async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await InterviewSlot.findOneAndDelete({ jobId });
    if (!result) {
      return res.status(404).json({ message: 'Interview slot not found' });
    }

    res.status(200).json({ message: 'Interview slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};