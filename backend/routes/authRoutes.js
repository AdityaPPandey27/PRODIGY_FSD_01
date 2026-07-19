const express = require('express');
const router = express.Router();

// Import the controller functions we just created
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

// ==========================================
// Authentication Routes
// Base URL: /api/auth (Defined in server.js)
// ==========================================

// Route to register a new user
// When a POST request hits /api/auth/register, it triggers the registerUser function
router.post('/register', registerUser);

// Route to login an existing user
// When a POST request hits /api/auth/login, it triggers the loginUser function
router.post('/login', loginUser);

// Route to logout a user
// When a POST request hits /api/auth/logout, it triggers the logoutUser function
router.post('/logout', logoutUser);

// Route to request a password reset token
// When a POST request hits /api/auth/forgot-password, it triggers forgotPassword
router.post('/forgot-password', forgotPassword);

// Route to actually reset the password using the token
// When a POST request hits /api/auth/reset-password, it triggers resetPassword
router.post('/reset-password', resetPassword);

// Export the router so it can be mounted in server.js
module.exports = router;