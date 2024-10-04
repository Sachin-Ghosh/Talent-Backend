const Interview = require('../models/interviewModel');
const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');

// Create Interview
exports.createInterview = async (req, res) => {
    const { jobId, candidateId, interviewDate } = req.body;

    try {
        const job = await Job.findById(jobId);
        const candidate = await Candidate.findById(candidateId);

        if (!job || !candidate) {
            return res.status(404).json({ message: 'Job or Candidate not found' });
        }

        const interview = new Interview({
            jobId,
            candidateId,
            interviewDate
        });

        const savedInterview = await interview.save();
        res.status(201).json(savedInterview);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Interviews
exports.getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate('jobId', 'title company')
            .populate('candidateId', 'name email');
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Interview by ID
exports.getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate('jobId', 'title company')
            .populate('candidateId', 'name email');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.json(interview);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Interview
exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const { interviewDate, interviewStatus, feedback } = req.body;
        interview.interviewDate = interviewDate || interview.interviewDate;
        interview.interviewStatus = interviewStatus || interview.interviewStatus;
        interview.feedback = feedback || interview.feedback;

        const updatedInterview = await interview.save();
        res.json(updatedInterview);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Interview
exports.deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        await interview.remove();
        res.json({ message: 'Interview removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get Interviews by Candidate or Job ID
exports.getInterviewsByCandidateOrJob = async (req, res) => {
    const { candidateId, jobId } = req.query; // Expecting candidateId or jobId as query parameters
  
    try {
      const query = {};
      if (candidateId) {
        query.candidateId = candidateId;
      }
      if (jobId) {
        query.jobId = jobId;
      }
  
      const interviews = await Interview.find(query)
        .populate('jobId', 'title company')
        .populate('candidateId', 'name email');
  
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Update Interview Status
exports.updateInterviewStatus = async (req, res) => {
    const { id } = req.params; // Interview ID
    const { interviewStatus } = req.body; // Expecting the new status in the request body
  
    try {
      const interview = await Interview.findById(id);
      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }
  
      interview.interviewStatus = interviewStatus; // Update the status
      const updatedInterview = await interview.save();
  
      res.json(updatedInterview);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};