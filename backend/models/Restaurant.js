import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  username: { type: String, ref: 'User', required: true }, 
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Restaurant', RestaurantSchema);
