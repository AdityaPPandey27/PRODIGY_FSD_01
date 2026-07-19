const express = require('express');
const router = express.Router();

// Import the user controller functions
const {
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/userController');

// Import the authentication middleware
const { protect } = require('../middleware/authMiddleware');

// ==========================================
// User Routes
// Base URL: /api/user (Defined in server.js)
// ==========================================

// Route to manage the user's profile
// Using router.route() allows us to chain different HTTP methods to the same URL.
// Both GET and PUT requests to /api/user/profile require the user to be logged in (protect).
router.route('/profile')
    .get(protect, getUserProfile)       // GET request fetches the profile
    .put(protect, updateUserProfile);   // PUT request updates the profile

// Route to change the user's password
// When a PUT request hits /api/user/change-password, it first runs 'protect', then 'changePassword'
router.put('/change-password', protect, changePassword);

// Export the router so it can be mounted in server.js
module.exports = router;