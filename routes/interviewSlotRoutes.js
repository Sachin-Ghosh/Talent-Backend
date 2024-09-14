const express = require('express');
const router = express.Router();
const interviewSlotController = require('../controllers/interviewSlotController');

router.post('/', interviewSlotController.createInterviewSlot);
router.get('/:jobId', interviewSlotController.getAvailableSlots);
router.post('/book', interviewSlotController.bookInterviewSlot);
router.put('/:jobId', interviewSlotController.updateInterviewSlot);
router.delete('/:jobId', interviewSlotController.deleteInterviewSlot);

module.exports = router;