const express = require('express');
const onboardingController = require('../controllers/onboardingController');
const multer = require('multer');
const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the file name
  }
});

const upload = multer({ storage: storage });

// Create an onboarding task (Admin/Employer Access)
router.post('/', onboardingController.createOnboardingTask);

// Get onboarding tasks by jobId
router.get('/job/:jobId', onboardingController.getOnboardingTasksByJobId); // New route

// Upload files for a specific onboarding task
router.post('/:id/upload', upload.array('files'), onboardingController.uploadFiles);

// Get all onboarding tasks (Admin Access)
router.get('/', onboardingController.getAllOnboardingTasks);

// Get onboarding tasks for a specific candidate
router.get('/candidate/:candidateId', onboardingController.getOnboardingTasksForCandidate);

// Get a single onboarding task by ID
router.get('/:id', onboardingController.getOnboardingTaskById);

// Update an onboarding task (Admin/Employer Access)
router.put('/:id', onboardingController.updateOnboardingTask);

// Delete an onboarding task (Admin/Employer Access)
router.delete('/:id', onboardingController.deleteOnboardingTask);

// Mark a task as completed (Candidate Access)
router.put('/:id/complete', onboardingController.markTaskCompleted);

module.exports = router;