import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './restaurant.css';

const RestaurantPopup = ({ onClose, onAdd, onUpdate, editRestaurant }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    image: null,
  });

  useEffect(() => {
    if (editRestaurant) {
      setFormData({
        name: editRestaurant.name,
        location: editRestaurant.location,
        contactNumber: editRestaurant.contactNumber,
        image: null, // Image will be updated only if a new one is uploaded
      });
    }
  }, [editRestaurant]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editRestaurant) {
        const res = await axios.put(
          `http://localhost:5000/api/restaurant/update/${editRestaurant._id}`,
          data,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        onUpdate(res.data);
        alert('Restaurant updated successfully!');
      } else {
        const res = await axios.post('http://localhost:5000/api/restaurant/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onAdd(res.data);
        alert('Restaurant added successfully!');
      }
      onClose();
    } catch (err) {
      console.error('Error saving restaurant:', err);
      alert('Failed to save restaurant');
    }
  };

  return (
    <div className="popup">
      <form className="popup-form" onSubmit={handleSubmit}>
        <h2>{editRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
        <input
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">{editRestaurant ? 'Update' : 'Save'}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RestaurantPopup;
