const express = require('express');
const documentUploadStatusController = require('../controllers/otDocUploadController');
const router = express.Router();

// Create or update document upload status
router.post('/', documentUploadStatusController.updateDocumentUploadStatus);

// Get document upload status for a specific candidate and onboarding task
router.get('/:candidateId/:onboardingTaskId', documentUploadStatusController.getDocumentUploadStatus);

// In your routes file for document upload status
router.delete('/:candidateId/:onboardingTaskId/:documentName', documentUploadStatusController.deleteDocumentUploadStatus);

module.exports = router;