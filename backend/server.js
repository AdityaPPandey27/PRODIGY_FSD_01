const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// ==========================================
// Global Middleware
// ==========================================

// Parse incoming JSON requests (replaces body-parser)
app.use(express.json());

// Set security-related HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS) for frontend communication
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// ==========================================
// Route Imports & Mounting
// ==========================================

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routers to specific base URL paths
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// Error Handling
// ==========================================

// Import and use custom global error handling middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Handle 404 (Not Found) routes
app.use(notFound);

// Handle all other application errors
app.use(errorHandler);

// ==========================================
// Server Initialization
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is securely running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});