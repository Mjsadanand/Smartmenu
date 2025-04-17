import express from 'express';
import passport from 'passport';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Register / Login
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: 'http://localhost:5173',
  failureRedirect: '/login/failed',
}));

export default router;
