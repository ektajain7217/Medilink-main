const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');
const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authController.logout);


module.exports = router;
