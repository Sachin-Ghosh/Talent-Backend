const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const Candidate = require('../models/candidateModel');
const Employer = require('../models/employerModel');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, description, imageLink, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profession;

        if (user.role === 'candidate') {
            const candidate = await Candidate.findOne({ userId: userId });
            if (!candidate) {
                return res.status(404).json({ message: 'Candidate profile not found' });
            }
            profession = candidate.experience.role || candidate.education.degree; // Use degree or default to 'Candidate'
        } else if (user.role === 'employer') {
            const employer = await Employer.findOne({ userId: userId });
            if (!employer) {
                return res.status(404).json({ message: 'Employer profile not found' });
            }
            profession = 'Recruiter'; // Set as 'Recruiter' for employers
        } else {
            profession = 'Other'; // Default case
        }

        const newBlog = new Blog({
            author: userId,
            profession,
            title,
            description,
            imageLink
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, description, imageLink } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, description, imageLink },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Like a blog
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.likes.includes(req.body.userId)) {
            return res.status(400).json({ message: 'Blog already liked' });
        }

        blog.likes.push(req.body.userId);
        await blog.save();

        res.status(200).json({ message: 'Blog liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Comment on a blog
exports.commentOnBlog = async (req, res) => {
    try {
        const { userId, text } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push({ user: userId, text });
        await blog.save();

        res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
