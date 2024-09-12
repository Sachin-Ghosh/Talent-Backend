// routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middlewares/authMiddleware');

// Candidate registration and login routes
router.post('/register', candidateController.registerCandidate);
router.post('/login', candidateController.loginCandidate);

// Get a single candidate by ID (protected)
router.get('/:id', protect, candidateController.getCandidateById);

// Get all candidates (protected)
router.get('/', protect, candidateController.getAllCandidates);

// Update a candidate profile (protected)
router.put('/:id', protect, candidateController.updateCandidate);

// Delete a candidate (protected)
router.delete('/:id', protect, candidateController.deleteCandidate);

// Protected route for getting candidate profile
router.get('/profile', protect, candidateController.getProfile);

module.exports = router;
