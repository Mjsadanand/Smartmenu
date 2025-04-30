import express from 'express';
import multer from 'multer';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import passport from 'passport';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.use(passport.authenticate('session'));

router.use((req, res, next) => {
  console.log('Session:', req.session); 
  console.log('req.user:', req.user); 
  if (!req.user?.username) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  next();
});

// Create restaurant
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    if (!req.user?.username) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const { name, location, contactNumber } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const newRestaurant = new Restaurant({
      username: req.user.username,
      name,
      location,
      contactNumber,
      imageUrl,
    });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get user's restaurants
router.get('/my', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ username: req.user.username });
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update restaurant
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, location, contactNumber } = req.body;
    const updateData = { name, location, contactNumber };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(updatedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete restaurant
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json({ msg: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const restaurants = await Restaurant.find({ username: user.username }); // Fetch all restaurants for the user
    if (!restaurants.length) return res.status(404).json({ msg: 'No restaurants found for this user' });

    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
