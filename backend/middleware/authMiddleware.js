const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes from unauthenticated users.
 * It verifies the JWT token sent in the Authorization header.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    // Standard format is: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database using the ID encoded in the token
            // We use .select('-password') to ensure the password hash is NOT attached to req.user
            req.user = await User.findById(decoded.id).select('-password');

            // Move on to the next middleware or route controller
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401);
            next(new Error('Not authorized, token failed or expired'));
        }
    }

    // If no token was found in the headers at all
    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token provided'));
    }
};

/**
 * Middleware to restrict route access strictly to Admin users.
 * IMPORTANT: This MUST be placed AFTER the `protect` middleware in your routes.
 */
const admin = (req, res, next) => {
    // Check if req.user exists (set by the protect middleware) AND the role is 'Admin'
    if (req.user && req.user.role === 'Admin') {
        next(); // User is admin, allow them to proceed
    } else {
        // 403 Forbidden means the server understands the request but refuses to authorize it
        res.status(403);
        next(new Error('Access denied, you are not authorized as an admin'));
    }
};

// Export the middleware functions
module.exports = { protect, admin };