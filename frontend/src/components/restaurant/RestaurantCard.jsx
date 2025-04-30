import React from 'react';
import './restaurant.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const placeholderImage = 'https://images.pexels.com/photos/2530386/pexels-photo-2530386.jpeg?auto=compress&cs=tinysrgb&w=600';

const RestaurantCard = ({ restaurant, onClick, onEdit, onDelete }) => (
  <div className="restaurant-card">
    <img
      src={restaurant.imageUrl || placeholderImage}
      alt={restaurant.name}
      onClick={onClick}
      onError={(e) => {
        e.target.onerror = null; // Prevents looping
        e.target.src = placeholderImage;
      }}
    />
    <h3>{restaurant.name}</h3>
    <p>{restaurant.location}</p>
    <p>{restaurant.contactNumber}</p>
    <div className="card-actions">
      <FaEdit className="edit-icon" onClick={onEdit} />
      <FaTrash className="delete-icon" onClick={onDelete} />
    </div>
  </div>
);

export default RestaurantCard;
