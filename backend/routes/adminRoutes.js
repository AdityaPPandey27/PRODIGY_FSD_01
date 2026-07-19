const express = require('express');
const router = express.Router();

// Import the admin controller functions we just created
const {
    getAllUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/adminController');

// Import BOTH the authentication and authorization middlewares
const { protect, admin } = require('../middleware/authMiddleware');

// ==========================================
// Admin Routes
// Base URL: /api/admin (Defined in server.js)
// ==========================================

// Route to get all users
// HTTP Method: GET
// Endpoint: /api/admin/users
router.get('/users', protect, admin, getAllUsers);

// Route to delete a specific user by ID
// HTTP Method: DELETE
// Endpoint: /api/admin/users/:id
router.delete('/users/:id', protect, admin, deleteUser);

// Route to update a specific user's role by ID
// HTTP Method: PUT
// Endpoint: /api/admin/users/:id/role
router.put('/users/:id/role', protect, admin, updateUserRole);

// Export the router so it can be mounted in server.js
module.exports = router;