// routes/onboardingRoutes.js
const express = require('express');
const onboardingController = require('../controllers/onboardingController');
const router = express.Router();

// Create an onboarding task (Admin/Employer Access)
router.post('/', onboardingController.createOnboardingTask);

// Get all onboarding tasks (Admin Access)
router.get('/',  onboardingController.getAllOnboardingTasks);

// Get onboarding tasks for a specific candidate
router.get('/candidate/:candidateId',  onboardingController.getOnboardingTasksForCandidate);

// Get a single onboarding task by ID
router.get('/:id', onboardingController.getOnboardingTaskById);

// Update an onboarding task (Admin/Employer Access)
router.put('/:id', onboardingController.updateOnboardingTask);

// Delete an onboarding task (Admin/Employer Access)
router.delete('/:id',  onboardingController.deleteOnboardingTask);

// Mark a task as completed (Candidate Access)
router.put('/:id/complete',  onboardingController.markTaskCompleted);

module.exports = router;
