const express = require('express');
const { register, login, refreshToken, logout, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

// POST /register
router.post('/register', register);

// POST /login
router.post('/login', login);

// POST /refresh
router.post('/refresh', refreshToken);

// POST /logout
router.post('/logout', logout);

// GET /me - Get current user
router.get('/me', getCurrentUser);

module.exports = router;