const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/', interviewController.createInterview);
router.get('/', interviewController.getAllInterviews);
router.get('/:id', interviewController.getInterviewById);
router.get('/search', interviewController.getInterviewsByCandidateOrJob); // New route for searching
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);
router.put('/status/:id', interviewController.updateInterviewStatus); // New route for updating status

module.exports = router;
