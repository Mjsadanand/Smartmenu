import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import Menu from '../models/MenuItem.js';

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

    menu.categories.id(req.params.categoryId).remove(); // Remove the category
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

export default router;