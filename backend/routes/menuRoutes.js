import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// Add menu item
router.post('/',  async (req, res) => {
  const { restaurantId, name, price, description, category, imageUrl } = req.body;
  const menuItem = new MenuItem({ restaurantId, name, price, description, category, imageUrl });
  await menuItem.save();
  res.status(201).json(menuItem);
});

// Get all menu items for a restaurant
router.get('/:restaurantId', async (req, res) => {
  const items = await MenuItem.find({ restaurantId: req.params.restaurantId });
  res.json(items);
});

// Delete menu item
router.delete('/:id',  async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Menu item deleted' });
});

// Update menu item
router.put('/:id',  async (req, res) => {
  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

export default router;