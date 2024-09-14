const axios = require('axios');

const CALENDLY_API_URL = 'https://api.calendly.com';
const CALENDLY_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

const calendlyApi = axios.create({
  baseURL: CALENDLY_API_URL,
  headers: {
    'Authorization': `Bearer ${CALENDLY_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

exports.createEventType = async (name, duration) => {
  try {
    const response = await calendlyApi.post('/event_types', {
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      duration: duration,
      kind: 'solo',
      color: '#0000FF',
      custom_questions: [
        {
          name: 'Job Application ID',
          type: 'text',
          position: 0,
          required: true
        }
      ]
    });
    return response.data.resource;
  } catch (error) {
    console.error('Error creating Calendly event type:', error.response?.data || error.message);
    throw error;
  }
};

exports.getEventTypeLink = async (eventTypeId) => {
  try {
    const response = await calendlyApi.get(`/event_types/${eventTypeId}`);
    return response.data.resource.scheduling_url;
  } catch (error) {
    console.error('Error getting Calendly event type link:', error.response?.data || error.message);
    throw error;
  }
};

exports.getScheduledEvents = async (eventTypeId, startTime, endTime) => {
  try {
    const response = await calendlyApi.get('/scheduled_events', {
      params: {
        event_type: eventTypeId,
        min_start_time: startTime,
        max_start_time: endTime
      }
    });
    return response.data.collection;
  } catch (error) {
    console.error('Error getting Calendly scheduled events:', error.response?.data || error.message);
    throw error;
  }
};

exports.scheduleEvent = async (eventTypeId, email, name, applicationId) => {
  try {
    const response = await calendlyApi.post('/scheduled_events', {
      event_type_uuid: eventTypeId,
      invitee: {
        email: email,
        name: name
      },
      questions_and_answers: [
        {
          question: "Job Application ID",
          answer: applicationId
        }
      ]
    });
    return response.data.resource;
  } catch (error) {
    console.error('Error scheduling Calendly event:', error.response?.data || error.message);
    throw error;
  }
};