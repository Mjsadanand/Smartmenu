import express from 'express';
import passport from 'passport';
import { register, login } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }), async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    if (user) {
      const id = user.username; 
      res.redirect(`http://localhost:5173/restaurant/${id}`);
    } else {
      res.redirect('/login/failed');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login/failed');
  }
});

export default router;
