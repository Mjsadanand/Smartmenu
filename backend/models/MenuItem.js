import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  items: [ItemSchema],
});

const MenuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  availableTime: { type: String, required: true },
  categories: [CategorySchema],
  published: { type: Boolean, default: false }, // Add published field
});

const Menu = mongoose.model('Menu', MenuSchema); 
export default Menu;