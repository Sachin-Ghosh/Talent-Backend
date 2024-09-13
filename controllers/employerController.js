const Employer = require('../models/employerModel');
const User = require('../models/userModel');

// Create Employer
exports.createEmployer = async (req, res) => {
    const { userId, companyName, contactNumber } = req.body;

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const employerExists = await Employer.findOne({ userId });
        if (employerExists) {
            return res.status(400).json({ message: 'Employer profile already exists for this user' });
        }

        const employer = new Employer({ 
            userId, 
            companyName, 
            contactNumber 
        });
        const savedEmployer = await employer.save();

        res.status(201).json(savedEmployer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all Employers
exports.getAllEmployers = async (req, res) => {
    try {
        const employers = await Employer.find().populate('userId', 'name email');
        res.json(employers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Employer by ID
exports.getEmployerById = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id).populate('userId', 'name email');
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.json(employer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Employer
exports.updateEmployer = async (req, res) => {
    const { companyName, contactNumber } = req.body;

    try {
        const employer = await Employer.findById(req.params.id);
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        employer.companyName = companyName || employer.companyName;
        employer.contactNumber = contactNumber || employer.contactNumber;

        const updatedEmployer = await employer.save();
        res.json(updatedEmployer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Employer
exports.deleteEmployer = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        await employer.remove();
        res.json({ message: 'Employer removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
