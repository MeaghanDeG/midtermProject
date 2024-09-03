const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../db'); // Assuming you export the client from your db.js file

// Helper function to get the users collection
function getUsersCollection() {
    return client.db('myapp').collection('users');
}

// User Signup
exports.signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const users = getUsersCollection();

        // Check if the user already exists by email or username
        const existingUser = await users.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            username,
            password: hashedPassword,
            createdAt: new Date(),
        };
        
        await users.insertOne(newUser);

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        const users = getUsersCollection();

        // Find the user by either email or username
        const user = await users.findOne({ 
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or username' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message and token
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        // Render a reset password form here, or send a response indicating the token is valid
        res.render('reset-password', { token: req.params.token }); // Assuming you have a view engine set up
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.resetPasswordPost = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        // Validate password and confirm password match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Update the user's password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined; // Clear reset token
        user.resetPasswordExpires = undefined; // Clear expiration time
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error in resetPasswordPost:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
