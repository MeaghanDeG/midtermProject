

const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController'); // Adjust the path as necessary
const router = express.Router();

// Local Signup and Login
router.post('/signup', authController.signup);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true // Ensure you have a flash message middleware set up
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
