const OnboardingTask = require('../models/onboardingTaskModel');

// Create an onboarding task
exports.createOnboardingTask = async (req, res) => {
    const { candidateId, taskDescription } = req.body;

    try {
        const task = new OnboardingTask({ candidateId, taskDescription });
        await task.save();
        res.status(201).json({ message: 'Onboarding task created', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all onboarding tasks
exports.getAllOnboardingTasks = async (req, res) => {
    try {
        const tasks = await OnboardingTask.find().populate('candidateId', 'name email');
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
