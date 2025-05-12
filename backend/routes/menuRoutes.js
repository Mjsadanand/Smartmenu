import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Menu from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import { Types } from 'mongoose';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'menu_items', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
  },
});

const upload = multer({ storage });

// Create a new menu
router.post('/', async (req, res) => {
  try {
    const { restaurantId, name, availableTime, categories } = req.body;

    const newMenu = new Menu({
      restaurantId,
      name,
      availableTime,
      categories, // Array of categories
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to create menu' });
  }
});

// Get all menus for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const menus = await Menu.find({ restaurantId: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch menus' });
  }
});

// Update a menu
router.put('/:menuId', async (req, res) => {
  const { menuId } = req.params;
  const { name, availableTime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(menuId)) {
    return res.status(400).json({ message: 'Invalid menu ID' });
  }

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      { name, availableTime },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(updatedMenu);
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a category to a menu
router.post('/:menuId/category', async (req, res) => {
  try {
    const { name } = req.body;

    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    menu.categories.push({ name, items: [] }); // Add a new category with an empty items array
    await menu.save();

    res.status(201).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add category' });
  }
});

// Update a category in a menu
router.put('/:menuId/category/:categoryId', async (req, res) => {
  try {
    const { name } = req.body;

    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    const category = menu.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    category.name = name || category.name; // Update category name
    await menu.save();

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update category' });
  }
});

// Delete a category from a menu
router.delete('/:menuId/category/:categoryId', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    // Find the index of the category to delete
    const categoryIndex = menu.categories.findIndex(
      (category) => category._id.toString() === req.params.categoryId
    );
    if (categoryIndex === -1) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Remove the category from the array
    menu.categories.splice(categoryIndex, 1);

    await menu.save();

    res.json({ msg: 'Category deleted successfully', menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete category' });
  }
});

// Add an item to a category with image upload
router.post('/:menuId/category/:categoryId/item', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ msg: 'Item name and price are required' });
    }

    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    const category = menu.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Get the image URL from Cloudinary
    const imageUrl = req.file?.path || '';

    // Add the new item to the category
    category.items.push({ name, price, description, imageUrl });
    await menu.save();

    res.status(201).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add item' });
  }
});

// Update an item in a category with image upload
router.put('/:menuId/category/:categoryId/item/:itemId', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    const category = menu.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    const item = category.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Update item fields
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;

    // Update the image URL if a new image is uploaded
    if (req.file) {
      item.imageUrl = req.file.path;
    }

    await menu.save();

    res.json({ msg: 'Item updated successfully', menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update item' });
  }
});

// Delete an item from a category
router.delete('/:menuId/category/:categoryId/item/:itemId', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    const category = menu.categories.id(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Find the index of the item to delete
    const itemIndex = category.items.findIndex((item) => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Remove the item from the array
    category.items.splice(itemIndex, 1);

    await menu.save();

    res.json({ msg: 'Item deleted successfully', menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete item' });
  }
});

// Delete a menu
router.delete('/:menuId', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    await Menu.deleteOne({ _id: req.params.menuId }); // Use deleteOne instead of remove

    res.json({ msg: 'Menu deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete menu' });
  }
});

// Toggle publish status of a menu
router.put('/:menuId/publish', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    menu.published = !menu.published; // Toggle the published status
    await menu.save();

    res.json({ msg: `Menu ${menu.published ? 'published' : 'unpublished'} successfully`, menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update publish status' });
  }
});

router.get('/:menuId/view', async (req, res) => {
  try {
    console.log('Fetching menu with ID:', req.params.menuId); // Debug log

    // Check if the menuId is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.menuId)) {
      console.log('Invalid menu ID');
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    const menu = await Menu.findOne({ _id: new mongoose.Types.ObjectId(req.params.menuId) });

    if (!menu) {
      console.log('Menu not found');
      return res.status(404).json({ message: 'Menu not found' });
    }

    console.log('Fetched menu:', JSON.stringify(menu, null, 2)); // Debug log
    res.json(menu); // Return the menu object
  } catch (err) {
    console.error('Error fetching menu:', err); // Debug log
    res.status(500).json({ message: err.message });
  }
});

// Get restaurant details by menuId
router.get('/:menuId/restaurant', async (req, res) => {
  try {
    // Step 1: Fetch the menu by menuId
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ msg: 'Menu not found' });
    }

    // Step 2: Use the restaurantId from the menu to fetch the restaurant
    const restaurant = await Restaurant.findById(menu.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch restaurant details' });
  }
});

// Upload QR code to Cloudinary and store metadata
router.post('/upload-qr', async (req, res) => {
  const { restaurantId, menuId, qrImage, redirectUrl } = req.body;

  try {
    // Upload QR code image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(qrImage, {
      folder: 'qr_codes',
    });

    // Store the QR code URL and redirect URL in the menu document
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.qrCode = {
      imageUrl: uploadResponse.secure_url, // Cloudinary URL of the QR code image
      redirectUrl, // Store the redirect URL
      restaurantId,
    };

    await menu.save();

    res.status(200).json({ message: 'QR code uploaded successfully', qrCode: menu.qrCode });
  } catch (error) {
    console.error('Error uploading QR code:', error);
    res.status(500).json({ message: 'Failed to upload QR code' });
  }
});

// Get QR code for a specific restaurant
router.get('/restaurant/:restaurantId/qr', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find the first menu for the restaurant
    const menu = await Menu.findOne({ restaurantId, qrCode: { $exists: true } });

    if (!menu || !menu.qrCode || !menu.qrCode.redirectUrl) {
      return res.status(404).json({ msg: 'QR code not found for this restaurant' });
    }

    // Return the QR code URL and restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    res.json({
      qrCode: menu.qrCode, // Include the redirect URL
      restaurant,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ msg: 'Failed to fetch QR code' });
  }
});

export default router;