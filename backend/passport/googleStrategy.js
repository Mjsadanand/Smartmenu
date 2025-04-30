import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await User.findOne({ username });
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user with googleId already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Check if username already exists (e.g., someone registered manually with same displayName)
      const existingUsername = await User.findOne({ username: profile.displayName });

      // If yes, append random number to avoid duplicate
      let uniqueUsername = profile.displayName;
      if (existingUsername) {
        uniqueUsername = `${profile.displayName}_${Math.floor(Math.random() * 10000)}`;
      }

      // Now create user safely
      user = await new User({
        googleId: profile.id,
        username: uniqueUsername,
        email: profile.emails[0].value
      }).save();

      done(null, user);
    } catch (err) {
      console.error('Google Strategy Error:', err);
      done(err, null);
    }
  }
));

