import React from 'react';
import './restaurant.css';

const RestaurantCard = ({ restaurant }) => (
  <div className="restaurant-card">
    <img src={`http://localhost:5000${restaurant.imageUrl}`} alt={restaurant.name} />
    <h3>{restaurant.name}</h3>
    <p>{restaurant.location}</p>
    <p>{restaurant.contactNumber}</p>
  </div>
);

export default RestaurantCard;
