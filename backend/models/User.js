const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email format'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false // Crucial: prevents returning the password in queries by default
        },
        role: {
            type: String,
            enum: ['User', 'Admin'],
            default: 'User'
        }
    },
    {
        // Automatically creates 'createdAt' and 'updatedAt' fields
        timestamps: true 
    }
);

// ==========================================
// Mongoose Middleware (Hooks)
// ==========================================

// Pre-save hook to hash the password before saving a new or updated user to the database
userSchema.pre('save', async function () {
    // If the password field hasn't been modified (e.g., updating just the name), skip hashing
    if (!this.isModified('password')) {
        return; // Modern Mongoose just needs a standard return
    }

    // Generate a "salt" (random string) with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    
    // Hash the actual password mixed with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// Custom Instance Methods
// ==========================================

// Method to compare plain text password entered by user during login with the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);