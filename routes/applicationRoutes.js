const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
// const { authenticateCandidate, authenticateEmployer } = require('../middleware/auth');

// Application routes

// Apply for a job (Candidate only)
router.post('/applications', applicationController.applyForJob);

// Get all applications (Employer/Admin only)
router.get('/applications', applicationController.getAllApplications);

// Get a specific application by ID (Employer/Admin only)
router.get('/applications/:id', applicationController.getApplicationById);

// Update application status (Employer/Admin only)
router.put('/applications/:id/status', applicationController.updateApplicationStatus);

// Delete an application (Employer/Admin only)
router.delete('/applications/:id', applicationController.deleteApplication);

module.exports = router;
