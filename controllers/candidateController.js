// controllers/candidateController.js
const Candidate = require('../models/candidateModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new candidate (Create)
exports.registerCandidate = async (req, res) => {
    const { name, email, password, skills, experience, resume } = req.body;

    try {
        const candidateExists = await Candidate.findOne({ email });
        if (candidateExists) {
            return res.status(400).json({ message: 'Candidate already exists' });
        }

        const candidate = new Candidate({ name, email, password, skills, experience, resume });
        await candidate.save();

        res.status(201).json({ message: 'Candidate registered successfully', candidate });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single candidate by ID (Read)
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all candidates (Read All)
exports.getAllCandidates = async (req, res) => {
    try {
        // Define userQuery for filtering and searching users
        const candidateQuery = {}; // Default query, you can add filters here
        if (req.query.candidateId) {
          query.candidateId = req.query.candidateId;
        }
        const candidates = await Candidate.find().select('-password');
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update candidate profile (Update)
exports.updateCandidate = async (req, res) => {
    const { name, email, skills, experience, resume } = req.body;

    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Only update if fields are provided
        candidate.name = name || candidate.name;
        candidate.email = email || candidate.email;
        candidate.skills = skills || candidate.skills;
        candidate.experience = experience || candidate.experience;
        candidate.resume = resume || candidate.resume;

        const updatedCandidate = await candidate.save();
        res.json({ message: 'Candidate updated successfully', updatedCandidate });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a candidate (Delete)
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        await candidate.remove();
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCandidateByEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const candidate = await Candidate.findOne({ email });
      candidate.id = Candidate._id.toString();
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      res.json(candidate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

// Get candidate profile
exports.getProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login candidate
exports.loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: candidate._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, candidate: { id: candidate._id, name: candidate.name, email: candidate.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};