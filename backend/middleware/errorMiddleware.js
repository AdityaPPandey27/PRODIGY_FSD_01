/**
 * Middleware to catch requests for routes that don't exist (404 Not Found)
 */
const notFound = (req, res, next) => {
    // Create a new Error object with a helpful message detailing the requested URL
    const error = new Error(`Not Found - ${req.originalUrl}`);
    
    // Set the HTTP response status to 404 (Not Found)
    res.status(404);
    
    // Pass the error to the next middleware (which will be the errorHandler below)
    next(error);
};

/**
 * Global Error Handler Middleware
 * Catches all errors thrown anywhere in the application
 */
const errorHandler = (err, req, res, next) => {
    // Sometimes an error occurs but the status code is still 200 (OK).
    // If it's 200, we change it to 500 (Internal Server Error). Otherwise, keep the existing error status.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set the response status code
    res.status(statusCode);

    // Send a JSON response with the error details
    res.json({
        message: err.message,
        // The stack trace tells us exactly which file and line number caused the error.
        // For security, we ONLY show the stack trace in 'development' mode, never in 'production'.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Export the middleware functions to be used in server.js
module.exports = {
    notFound,
    errorHandler,
};