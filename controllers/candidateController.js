const Candidate = require('../models/candidateModel');
const User = require('../models/userModel');
const upload = require('../utils/fileUpload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create or Update Candidate
exports.createCandidate = async (req, res) => {
    const { userId, education, experience, resumeLink,bio, skills } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        let candidate = await Candidate.findOne({ userId });
        if (candidate) {
            // If candidate exists, update the profile
            candidate.education = education || candidate.education;
            candidate.experience = experience || candidate.experience;
            candidate.resumeLink = resumeLink || candidate.resumeLink;
            candidate.skills = skills || candidate.skills;

            const updatedCandidate = await candidate.save();
            return res.status(200).json({ message: 'Candidate profile updated', candidate: updatedCandidate });
        } else {
            // If candidate doesn't exist, create a new one
            candidate = new Candidate({ 
                userId, 
                education, 
                bio,
                experience, 
                resumeLink, 
                skills 
            });

            const savedCandidate = await candidate.save();
            return res.status(201).json({ message: 'Candidate profile created', candidate: savedCandidate });
        }
    } catch (error) {
        console.error('Error in createCandidate:', error);
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
    const { education, experience, resumeLink, skills,bio } = req.body;

    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.education = education || candidate.education;
        candidate.experience = experience || candidate.experience;
        candidate.resumeLink = resumeLink || candidate.resumeLink;
        candidate.skills = skills || candidate.skills;
        candidate.bio = bio || candidate.bio;

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

// Upload Resume
exports.uploadResume = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const candidate = await Candidate.findById(req.params.id);
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            candidate.resume = req.file.path;
            await candidate.save();

            res.status(200).json({ message: 'Resume uploaded successfully', filePath: req.file.path });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

// Get Resume
exports.getResume = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate || !candidate.resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.download(candidate.resume);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Candidate by User ID
exports.getCandidateByUserId = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.params.userId });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json({ candidateId: candidate._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};