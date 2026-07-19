const User = require('../models/User');

/**
 * Get user profile
 * Route: GET /api/user/profile
 * Access: Private (Requires token)
 */
const getUserProfile = async (req, res, next) => {
    try {
        // req.user is populated by our 'protect' middleware before this controller runs
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * Route: PUT /api/user/profile
 * Access: Private (Requires token)
 */
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Check if the user is trying to update their email to one that already exists
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    res.status(400);
                    throw new Error('Email is already in use by another account');
                }
            }

            // Update fields if they are provided in the request, otherwise keep existing values
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Save the updated user to the database
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

/**
 * Change user password
 * Route: PUT /api/user/change-password
 * Access: Private (Requires token)
 */
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(400);
            throw new Error('Please provide both old and new passwords');
        }

        if (newPassword.length < 8) {
            res.status(400);
            throw new Error('New password must be at least 8 characters long');
        }

        // Fetch user and explicitly select the password for comparison
        const user = await User.findById(req.user._id).select('+password');

        if (user) {
            // Check if the old password provided matches the one in the database
            const isMatch = await user.matchPassword(oldPassword);
            
            if (!isMatch) {
                res.status(401);
                throw new Error('Incorrect old password');
            }

            // Set the new password. The pre-save hook in User.js will hash it automatically!
            user.password = newPassword;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword
};