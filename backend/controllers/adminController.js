const User = require('../models/User');

/**
 * Get all users (with optional search)
 * Route: GET /api/admin/users?search=keyword
 * Access: Private/Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        // Implement search functionality
        // If the frontend sends a query like ?search=john, we look for matches in name OR email
        const keyword = req.query.search
            ? {
                  $or: [
                      { name: { $regex: req.query.search, $options: 'i' } }, // 'i' makes it case-insensitive
                      { email: { $regex: req.query.search, $options: 'i' } }
                  ]
              }
            : {}; // If no search term is provided, return an empty filter (which matches everyone)

        // Find users based on the keyword filter and ensure we DO NOT send passwords back
        const users = await User.find({ ...keyword }).select('-password');
        
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a user
 * Route: DELETE /api/admin/users/:id
 * Access: Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        // Extract the user ID from the URL parameters (e.g., /api/admin/users/12345)
        const user = await User.findById(req.params.id);

        if (user) {
            // Safety Check: Prevent an admin from accidentally deleting their own account
            if (user._id.toString() === req.user._id.toString()) {
                res.status(400);
                throw new Error('You cannot delete your own admin account');
            }

            // Remove the user from the database
            await user.deleteOne();
            res.status(200).json({ message: 'User removed successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Update user role (Promote to Admin or demote to User)
 * Route: PUT /api/admin/users/:id/role
 * Access: Private/Admin
 */
const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            const { role } = req.body;

            // Validate that the requested role is actually valid
            if (role !== 'User' && role !== 'Admin') {
                res.status(400);
                throw new Error('Invalid role specified. Must be User or Admin.');
            }

            // Safety Check: Prevent an admin from stripping their own admin privileges
            if (user._id.toString() === req.user._id.toString() && role === 'User') {
                res.status(400);
                throw new Error('You cannot downgrade your own admin account');
            }

            // Update the user's role and save
            user.role = role;
            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUserRole
};