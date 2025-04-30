// import express from 'express';
// import multer from 'multer';
// import Restaurant from '../models/Restaurant.js';
// import User from '../models/User.js';
// import passport from 'passport';

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });
// const upload = multer({ storage });

// router.use(passport.authenticate('session'));

// router.use((req, res, next) => {
//   console.log('Session:', req.session); 
//   console.log('req.user:', req.user); 
//   if (!req.user?.username) {
//     return res.status(401).json({ msg: 'User not authenticated' });
//   }
//   next();
// });

// // Create restaurant
// router.post('/add', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.user?.username) {
//       return res.status(401).json({ msg: 'User not authenticated' });
//     }

//     const { name, location, contactNumber } = req.body;
//     const imageUrl = `/uploads/${req.file.filename}`;
//     const newRestaurant = new Restaurant({
//       username: req.user.username,
//       name,
//       location,
//       contactNumber,
//       imageUrl,
//     });
//     await newRestaurant.save();
//     res.status(201).json(newRestaurant);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });


// // Get user's restaurants
// router.get('/my', async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find({ username: req.user.username });
//     res.json(restaurants);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Update restaurant
// router.put('/update/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { name, location, contactNumber } = req.body;
//     const updateData = { name, location, contactNumber };

//     if (req.file) {
//       updateData.imageUrl = `/uploads/${req.file.filename}`;
//     }

//     const updatedRestaurant = await Restaurant.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true } // Return the updated document
//     );

//     if (!updatedRestaurant) {
//       return res.status(404).json({ msg: 'Restaurant not found' });
//     }

//     res.json(updatedRestaurant);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// // Delete restaurant
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     if (!req.user?.username) {
//       return res.status(401).json({ msg: 'User not authenticated' });
//     }

//     const restaurant = await Restaurant.findById(req.params.id);

//     if (!restaurant) {
//       return res.status(404).json({ msg: 'Restaurant not found' });
//     }

//     if (restaurant.username !== req.user.username) {
//       return res.status(403).json({ msg: 'User not authorized to delete this restaurant' });
//     }

//     await restaurant.deleteOne();
//     res.json({ msg: 'Restaurant deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// router.get('/:username', async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.params.username });
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const restaurants = await Restaurant.find({ username: user.username }); // Fetch all restaurants for the user
//     if (!restaurants.length) return res.status(404).json({ msg: 'No restaurants found for this user' });

//     res.json(restaurants);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import passport from 'passport';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});
const upload = multer({ storage });

router.use(passport.authenticate('session'));

router.use((req, res, next) => {
  if (!req.user?.username) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  next();
});


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, location, contactNumber } = req.body;
    const imageUrl = req.file.path; 

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

router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, location, contactNumber } = req.body;
    const updateData = { name, location, contactNumber };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
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


router.delete('/delete/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    if (restaurant.username !== req.user.username) {
      return res.status(403).json({ msg: 'User not authorized to delete this restaurant' });
    }

    await restaurant.deleteOne();
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

    const restaurants = await Restaurant.find({ username: user.username });
    if (!restaurants.length) return res.status(404).json({ msg: 'No restaurants found for this user' });

    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
