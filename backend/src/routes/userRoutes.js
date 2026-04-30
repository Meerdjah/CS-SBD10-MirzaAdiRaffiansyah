const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { userRegistrationValidation, userUpdateValidation, validate } = require('../utils/validators');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userRegistrationValidation, validate, UserController.register);
router.post('/login', UserController.login);

// Cache-aside: GET user by email (Task 2)
router.get('/:email', UserController.getUserByEmail);

// Protected routes - require authentication
router.put('/update', authenticateToken, userUpdateValidation, validate, UserController.updateProfile);
router.get('/history', authenticateToken, UserController.getTransactionHistory);
router.get('/total-spent', authenticateToken, UserController.getTotalSpent);

module.exports = router;