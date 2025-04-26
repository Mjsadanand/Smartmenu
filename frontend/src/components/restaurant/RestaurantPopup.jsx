import React, { useState } from 'react';
import API from '../../api.js'; // Import the same API instance used in Register.jsx
import './restaurant.css';

const RestaurantPopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await API.post('/restaurant/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Restaurant added successfully!');
      onAdd(res.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add restaurant');
      console.error('Error adding restaurant:', err);
    }
  };

  return (
    <div className="popup">
      <form className="popup-form" onSubmit={handleSubmit}>
        <h2>Add Restaurant</h2>
        <input name="name" placeholder="Restaurant Name" required onChange={handleChange} />
        <input name="location" placeholder="Location" required onChange={handleChange} />
        <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
        <input type="file" name="image" accept="image/*" required onChange={handleChange} />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default RestaurantPopup;
