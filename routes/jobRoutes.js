// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
// const { authenticateEmployer, authenticateCandidate } = require('../middleware/auth');

// Job routes

// Create a new job (Employer/Admin only)
router.post('/', jobController.createJob);

// Get all jobs (Public)
router.get('/', jobController.getAllJobs);

// Get a specific job by ID (Public)
router.get('/:id', jobController.getJobById);

// Update a job post (Employer/Admin only)
router.put('/:id', jobController.updateJob);

// Delete a job post (Employer/Admin only)
router.delete('/:id', jobController.deleteJob);

// Get all candidates who applied for a specific job (Employer/Admin only)
router.get('/:id/candidates',jobController.getCandidatesByJobId);

module.exports = router;
