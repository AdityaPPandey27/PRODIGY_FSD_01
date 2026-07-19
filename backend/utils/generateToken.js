const jwt = require('jsonwebtoken');

/**
 * Utility function to generate a JSON Web Token (JWT)
 * @param {string} id - The MongoDB user ID to embed inside the token
 * @returns {string} - The signed JWT string
 */
const generateToken = (id) => {
    // jwt.sign takes three main arguments:
    // 1. The payload (the data we want to securely encode into the token, in this case, the user's ID)
    // 2. The secret key (a highly secure string known only to our server, stored in .env)
    // 3. Options (like when the token should expire)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d', // Defaults to 30 days if not set in .env
    });
};

// Export the function so we can use it in our auth controllers
module.exports = generateToken;