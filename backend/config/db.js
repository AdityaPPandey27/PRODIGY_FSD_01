const mongoose = require('mongoose');

/**
 * Asynchronous function to connect to the MongoDB database.
 * We use async/await because database connections take time over the network.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        // If the connection fails, log the error message
        console.error(`Error connecting to MongoDB: ${error.message}`);
        
        // Exit the Node.js process with a "failure" code (1)
        // If the database doesn't connect, our backend can't function anyway!
        process.exit(1);
    }
};

// Export the function so it can be used in server.js
module.exports = connectDB;