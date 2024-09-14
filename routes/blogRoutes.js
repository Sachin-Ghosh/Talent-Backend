const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Create a new blog
router.post('/', blogController.createBlog);

// Get all blogs
router.get('/all', blogController.getAllBlogs);

// Get a single blog by ID
router.get('/:id', blogController.getBlogById);

// Update a blog
router.put('/:id', blogController.updateBlog);

// Delete a blog
router.delete('/:id', blogController.deleteBlog);

// Like a blog
router.post('/:id/like', blogController.likeBlog);

// Comment on a blog
router.post('/:id/comment', blogController.commentOnBlog);

module.exports = router;
