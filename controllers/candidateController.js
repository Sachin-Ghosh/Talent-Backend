const Candidate = require('../models/candidateModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create Candidate
exports.createCandidate = async (req, res) => {
    const { userId, education, experience, resumeLink, skills } = req.body;

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const candidateExists = await Candidate.findOne({ userId });
        if (candidateExists) {
            return res.status(400).json({ message: 'Candidate profile already exists for this user' });
        }

        const candidate = new Candidate({ 
            userId, 
            education, 
            experience, 
            resumeLink, 
            skills 
        });
        const savedCandidate = await candidate.save();

        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Candidates
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('userId', 'name email');
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Candidate by ID
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('userId', 'name email');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Candidate
exports.updateCandidate = async (req, res) => {
    const { education, experience, resumeLink, skills } = req.body;

    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.education = education || candidate.education;
        candidate.experience = experience || candidate.experience;
        candidate.resumeLink = resumeLink || candidate.resumeLink;
        candidate.skills = skills || candidate.skills;

        const updatedCandidate = await candidate.save();
        res.json(updatedCandidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        await candidate.remove();
        res.json({ message: 'Candidate removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get candidate profile
exports.getProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.user.id }).populate('userId', '-password');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Note: Login functionality should be handled in userController, not here