const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

// Create an employer profile
router.post('/', employerController.createEmployer);

// Get all employers
router.get('/',  employerController.getAllEmployers);

// Get a single employer by ID
router.get('/:id',  employerController.getEmployerById);

// Update an employer profile
router.put('/:id', employerController.updateEmployer);

// Delete an employer
router.delete('/:id', employerController.deleteEmployer);

module.exports = router;
