const OnboardingTask = require('../models/onboardingTaskModel');

// Create an onboarding task
exports.createOnboardingTask = async (req, res) => {
    const { employerId, jobId, taskDescription, requestedDocuments } = req.body;

    try {
        const task = new OnboardingTask({ employerId, jobId, taskDescription, requestedDocuments });
        await task.save();
        res.status(201).json({ message: 'Onboarding task created', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get onboarding tasks by jobId
exports.getOnboardingTasksByJobId = async (req, res) => {
    const { jobId } = req.params;

    try {
        const tasks = await OnboardingTask.find({ jobId });
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No onboarding tasks found for this job ID' });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Upload files for a specific onboarding task
exports.uploadFiles = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await OnboardingTask.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const uploadedFiles = req.files.map(file => ({
            fileName: file.originalname,
            filePath: file.path
        }));

        task.uploadedFiles.push(...uploadedFiles);
        await task.save();

        res.json({ message: 'Files uploaded successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all onboarding tasks
exports.getAllOnboardingTasks = async (req, res) => {
    try {
        const tasks = await OnboardingTask.find()
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get onboarding tasks for a specific candidate
exports.getOnboardingTasksForCandidate = async (req, res) => {
    try {
        const tasks = await OnboardingTask.find({ candidateId: req.params.candidateId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single onboarding task by ID
exports.getOnboardingTaskById = async (req, res) => {
    try {
        const task = await OnboardingTask.findById(req.params.id).populate('candidateId', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an onboarding task
exports.updateOnboardingTask = async (req, res) => {
    const { taskDescription, status } = req.body;

    try {
        const task = await OnboardingTask.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.taskDescription = taskDescription || task.taskDescription;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.json({ message: 'Task updated', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an onboarding task
exports.deleteOnboardingTask = async (req, res) => {
    try {
        const task = await OnboardingTask.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark a task as completed
exports.markTaskCompleted = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await OnboardingTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = 'Completed';
        await task.save();

        res.json({ message: 'Task marked as completed', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
