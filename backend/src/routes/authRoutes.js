const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const { body } = require('express-validator');
const { validate } = require('../utils/validators');

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

router.post('/login', loginValidation, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    
    const token = jwt.sign(
      { 
        userId: result.user.id, 
        email: result.user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      payload: {
        token,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
