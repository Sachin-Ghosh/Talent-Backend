// routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middlewares/authMiddleware');

// Candidate registration and login routes
router.post('/register', candidateController.registerCandidate);
router.post('/login', candidateController.loginCandidate);

// Get a single candidate by ID (protected)
router.get('/:id', candidateController.getCandidateById);

// Get all candidates (protected)
router.get('/', candidateController.getAllCandidates);

// Update a candidate profile (protected)
router.put('/:id', candidateController.updateCandidate);

// Delete a candidate (protected)
router.delete('/:id',  candidateController.deleteCandidate);

// Protected route for getting candidate profile
router.get('/profile', candidateController.getProfile);

module.exports = router;
