const InterviewSlot = require('../models/interviewSlotModel');
const Application = require('../models/applicationModel');
const { sendEmail } = require('../utils/emailService');
const { createEventType, getEventTypeLink, scheduleEvent } = require('../utils/calendlyService');

exports.createInterviewSlot = async (req, res) => {
  const { jobId, name, duration } = req.body;

  try {
    const eventType = await createEventType(name, duration);
    const meetingLink = await getEventTypeLink(eventType.uri);

    const interviewSlot = new InterviewSlot({ 
      jobId, 
      calendlyEventTypeId: eventType.uri,
      meetingLink 
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
    const interviewSlot = await InterviewSlot.findOne({ jobId });
    if (!interviewSlot) {
      return res.status(404).json({ message: 'No interview slot found for this job' });
    }

    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const scheduledEvents = await getScheduledEvents(
      interviewSlot.calendlyEventTypeId, 
      now.toISOString(), 
      twoWeeksFromNow.toISOString()
    );

    res.status(200).json({ 
      meetingLink: interviewSlot.meetingLink,
      scheduledEvents: scheduledEvents 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bookInterviewSlot = async (req, res) => {
  const { slotId, applicationId } = req.body;

  try {
    const slot = await InterviewSlot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const application = await Application.findById(applicationId).populate('candidateId jobId');
    
    // Schedule the event with Calendly
    const scheduledEvent = await scheduleEvent(
      slot.calendlyEventTypeId,
      application.candidateId.email,
      application.candidateId.name,
      applicationId
    );

    slot.isBooked = true;
    slot.applicationId = applicationId;
    slot.meetingLink = scheduledEvent.uri;
    await slot.save();

    // Send email to candidate and recruiter
    sendEmail(application.candidateId.email, 'Interview Scheduled', `Your interview is scheduled for ${scheduledEvent.start_time}. Meeting link: ${scheduledEvent.location}`);
    sendEmail(application.jobId.recruiterEmail, 'Interview Scheduled', `Interview scheduled with ${application.candidateId.name} for ${scheduledEvent.start_time}. Meeting link: ${scheduledEvent.location}`);

    res.status(200).json({ message: 'Interview slot booked successfully', slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.handleCalendlyWebhook = async (req, res) => {
  const { event } = req.body;

  if (event === 'invitee.created') {
    const { event_type, invitee } = req.body.payload;
    
    try {
      const interviewSlot = await InterviewSlot.findOne({ calendlyEventTypeId: event_type.uri });
      if (!interviewSlot) {
        return res.status(404).json({ message: 'Interview slot not found' });
      }

      const applicationId = invitee.questions_and_answers.find(
        qa => qa.question === 'Job Application ID'
      ).answer;

      const application = await Application.findById(applicationId).populate('candidateId jobId');
      
      sendEmail(
        application.candidateId.email, 
        'Interview Scheduled', 
        `Your interview is scheduled for ${invitee.scheduled_event.start_time}. Meeting link: ${invitee.scheduled_event.location}`
      );
      sendEmail(
        application.jobId.recruiterEmail, 
        'Interview Scheduled', 
        `Interview scheduled with ${application.candidateId.name} for ${invitee.scheduled_event.start_time}. Meeting link: ${invitee.scheduled_event.location}`
      );

      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.status(200).json({ message: 'Unhandled event type' });
  }
};