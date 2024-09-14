const express = require('express');
const router = express.Router();
const interviewSlotController = require('../controllers/interviewSlotController');

router.post('/', interviewSlotController.createInterviewSlot);
router.get('/:jobId', interviewSlotController.getAvailableSlots);
router.post('/book', interviewSlotController.bookInterviewSlot);
router.post('/calendly-webhook', interviewSlotController.handleCalendlyWebhook);


module.exports = router;