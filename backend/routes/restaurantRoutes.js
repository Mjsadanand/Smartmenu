import express from 'express';
import multer from 'multer';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Middleware to populate req.user
router.use(async (req, res, next) => {
  const username = req.user?.username;
  if (username) {
    const user = await User.findOne({ username });
    if (user) {
      req.user._id = user._id;
    }
  }
  next();
});

// Create restaurant
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, location, contactNumber } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const newRestaurant = new Restaurant({
      userId: req.user._id,
      name,
      location,
      contactNumber,
      imageUrl
    });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's restaurant
router.get('/my', async (req, res) => {
  const restaurant = await Restaurant.findOne({ userId: req.user._id });
  if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
  res.json(restaurant);
});

// Public menu access
router.get('/:username', async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.params.username });
  if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
  res.json(restaurant);
});

export default router;