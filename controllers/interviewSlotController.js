const InterviewSlot = require('../models/interviewSlotModel');
const Application = require('../models/applicationModel');
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
    const interviewSlots = await InterviewSlot.find({ jobId }); // Changed from findOne to find
    if (interviewSlots.length === 0) {
      return res.status(404).json({ message: 'No interview slots found for this job' });
    }

    // Flatten the available slots from all interview slots
    const availableSlots = interviewSlots.flatMap(slot => slot.availableSlots);

    res.status(200).json({ 
      meetingLink: interviewSlots[0].meetingLink, // Assuming all have the same meeting link
      availableSlots: availableSlots 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bookInterviewSlot = async (req, res) => {
  const { jobId, slotId, applicationId } = req.body;

  try {
    const interviewSlot = await InterviewSlot.findOne({ jobId });
    if (!interviewSlot) {
      return res.status(404).json({ message: 'Interview slot not found' });
    }

    const slot = interviewSlot.availableSlots.id(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const application = await Application.findById(applicationId).populate('candidateId jobId');
    
    slot.isBooked = true;
    interviewSlot.applicationId = applicationId;
    await interviewSlot.save();

    // Send email to candidate and recruiter
    sendEmail(application.candidateId.email, 'Interview Scheduled', `Your interview is scheduled for ${slot.start}. Meeting link: ${interviewSlot.meetingLink}`);
    sendEmail(application.jobId.recruiterEmail, 'Interview Scheduled', `Interview scheduled with ${application.candidateId.name} for ${slot.start}. Meeting link: ${interviewSlot.meetingLink}`);

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