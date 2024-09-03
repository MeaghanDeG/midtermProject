const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController'); // Adjust based on your directory structure

const router = express.Router();
const User = require('../models/User');

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: false
}));
router.get('/reset-password/:token', authController.resetPassword);
router.post('/reset-password/:token', authController.resetPasswordPost);

// User Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;
