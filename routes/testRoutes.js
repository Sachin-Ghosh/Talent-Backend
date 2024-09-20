const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/', testController.createTest);
router.get('/:jobId', testController.getTestByJobId);
router.get('/:candidateId/:jobId', testController.getTestByCandidateAndJob);
router.post('/submit', testController.submitTest);
router.post('/end-recruitment', testController.endJobRecruitment); // New route

module.exports = router;