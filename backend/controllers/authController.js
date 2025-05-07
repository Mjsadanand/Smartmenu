import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ msg: 'Passwords do not match' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hash });
  await newUser.save();

  res.status(201).json({ msg: 'User registered successfully' });
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user) return res.status(400).json({ msg: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: 'Invalid credentials' });

  // Generate JWT token with username
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email }
  });
};
