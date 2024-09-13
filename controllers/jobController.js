// controllers/jobController.js
const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');
const Employer = require('../models/employerModel');

// Create a new job (Admin/Employer)
exports.createJob = async (req, res) => {
    const {employerId, title, description, skillsRequired, experienceRequired, salaryRange, location } = req.body;
    // const employerId = req.user.id;

    try {
        const job = new Job({ employerId, title, description, skillsRequired, experienceRequired, salaryRange, location });
        await job.save();

        // Update employer's job list
        await Employer.findByIdAndUpdate(employerId, { $push: { jobPosts: job._id } });

        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employerId', 'companyName');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get a specific job by ID
exports.getJobById = async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id).populate('employerId', 'companyName');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Update a job post
exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description, skillsRequired, experienceRequired, salaryRange, location } = req.body;
    const employerId = req.user.id;

    try {
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ensure that only the employer who created the job can update it
        if (job.employerId.toString() !== employerId) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        // Update job fields
        job.title = title || job.title;
        job.description = description || job.description;
        job.skillsRequired = skillsRequired || job.skillsRequired;
        job.experienceRequired = experienceRequired || job.experienceRequired;
        job.salaryRange = salaryRange || job.salaryRange;
        job.location = location || job.location;

        const updatedJob = await job.save();

        res.status(200).json({ message: 'Job updated successfully', updatedJob });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a job post
exports.deleteJob = async (req, res) => {
    const { id } = req.params;
    const employerId = req.user.id;

    try {
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ensure that only the employer who created the job can delete it
        if (job.employerId.toString() !== employerId) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.remove();
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get candidates who have applied for the job
exports.getCandidatesByJobId = async (req, res) => {
    const { id } = req.params;

    try {
        const applications = await Application.find({ jobId: id }).populate('candidateId', 'name education experience');
        
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};