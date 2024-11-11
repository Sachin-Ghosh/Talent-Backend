const Application = require('../models/applicationModel');
const Candidate = require('../models/candidateModel');
const Job = require('../models/jobModel');

// Apply for a job (Candidate)
exports.applyForJob = async (req, res) => {
    const { jobId,candidateId,expectedSalary } = req.body;
    // const candidateId = req.user.id; // Assuming the logged-in user is a candidate

    try {
        const application = new Application({ candidateId, jobId, expectedSalary });
        await application.save();

        // Update candidate's applied jobs
        await Candidate.findByIdAndUpdate(candidateId, { $push: { appliedJobs: jobId } });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all applications (Admin/Employer)
exports.getAllApplications = async (req, res) => {
    const { jobId, candidateId } = req.query; // Get jobId and candidateId from query parameters

    try {
        const query = {}; // Initialize an empty query object

        if (jobId) {
            query.jobId = jobId; // Add jobId filter if provided
        }
        if (candidateId) {
            query.candidateId = candidateId; // Add candidateId filter if provided
        }

        const applications = await Application.find(query)
            .populate('candidateId', 'name')
            .populate('jobId', 'title');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a specific application by ID
exports.getApplicationById = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await Application.findById(id).populate('candidateId', 'name').populate('jobId', 'title');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update application status (Admin/Employer)
exports.updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || application.status;
        await application.save();

        res.status(200).json({ message: 'Application status updated', application });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await application.remove();
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get applications by candidate ID
exports.getApplicationsByCandidateId = async (req, res) => {
    const { candidateId } = req.params;

    try {
        const applications = await Application.find({ candidateId })
            .populate('candidateId')
            .populate({
                path: 'jobId',
                populate: {
                    path: 'employerId',
                    select: 'companyName'
                }
            })
            .populate('screeningId');

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};