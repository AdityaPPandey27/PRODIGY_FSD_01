const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * Route: POST /api/auth/register
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1. Basic validation
        if (!name || !email || !password || !confirmPassword) {
            res.status(400);
            throw new Error('Please fill in all fields');
        }

        if (password !== confirmPassword) {
            res.status(400);
            throw new Error('Passwords do not match');
        }

        // 2. Check if user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists with this email');
        }

        // 3. Create the user
        // Note: The password will automatically be hashed by the pre-save hook in User.js
        const user = await User.create({
            name,
            email,
            password
        });

        // 4. Send successful response with JWT
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data received');
        }
    } catch (error) {
        next(error); // Pass the error to our custom error handler
    }
};

/**
 * Authenticate a user and get token (Login)
 * Route: POST /api/auth/login
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate inputs
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide both email and password');
        }

        // 2. Find user by email
        // We must use .select('+password') because we hid the password in the User model by default!
        const user = await User.findOne({ email }).select('+password');

        // 3. Check if user exists AND password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 * Route: POST /api/auth/logout
 */
const logoutUser = async (req, res, next) => {
    try {
        // Because we are using Bearer tokens (JWTs) stored in frontend state/localStorage,
        // the actual "logout" happens on the frontend by deleting the token.
        // We provide this endpoint to acknowledge the logout and (in the future) 
        // it could be used to blacklist tokens or clear HTTP-only cookies if implemented.
        res.status(200).json({ message: 'User successfully logged out' });
    } catch (error) {
        next(error);
    }
};

/**
 * Generate a forgot password token
 * Route: POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('No user found with that email');
        }

        // Create a temporary, short-lived JWT (valid for 15 minutes) for resetting the password
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        // In a production app, you would send this token via Email using a service like Nodemailer or SendGrid.
        // For our API, we will return it in the response so you can test it directly in Postman.
        res.status(200).json({
            message: 'Password reset token generated (In production, this would be emailed)',
            resetToken: resetToken
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Password using the token
 * Route: POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            res.status(400);
            throw new Error('Please provide the reset token and new password');
        }

        if (newPassword.length < 8) {
            res.status(400);
            throw new Error('Password must be at least 8 characters');
        }

        // Verify the token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        
        // Find the user
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update the password. 
        // Our pre-save hook in User.js will automatically hash this new password!
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (error) {
        // If jwt.verify fails, it throws an error (e.g., TokenExpiredError)
        res.status(400);
        next(new Error('Invalid or expired reset token'));
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
};