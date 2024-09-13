const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', userController.getUserProfile);
router.put('/profile',  userController.updateUserProfile);
router.delete('/:id',userController.deleteUser);

module.exports = router;
