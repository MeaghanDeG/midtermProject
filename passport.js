const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function(passport) {
  // Local Strategy for Email/Password
  passport.use(new LocalStrategy({
    usernameField: 'emailOrUsername',
    passwordField: 'password'
  }, async (emailOrUsername, password, done) => {
    try {
      const user = await User.findOne({ 
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
      });
      if (!user) {
        return done(null, false, { message: 'Invalid email or username' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
