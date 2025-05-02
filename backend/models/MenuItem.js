import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [itemSchema], 
});

const menuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true }, 
  availableTime: { type: String, required: true }, 
  categories: [categorySchema], 
});

export default mongoose.model('Menu', menuSchema);