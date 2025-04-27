import React from 'react';
import './restaurant.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RestaurantCard = ({ restaurant, onClick, onEdit, onDelete }) => (
  <div className="restaurant-card">
    <img
      src={`http://localhost:5000${restaurant.imageUrl}`}
      alt={restaurant.name}
      onClick={onClick}
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
