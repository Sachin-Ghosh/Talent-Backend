const express = require('express');
const router = express.Router();
const screeningController = require('../controllers/screeningController');

router.post('/start', screeningController.startScreening);
router.post('/stage2',  screeningController.processStage2);
router.post('/stage3', screeningController.processStage3);

module.exports = router;