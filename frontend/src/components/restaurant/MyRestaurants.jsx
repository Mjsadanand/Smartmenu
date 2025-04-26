import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import RestaurantPopup from './RestaurantPopup';
import './restaurant.css';

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get('/api/restaurant/my-restaurants').then(res => {
      setRestaurants(res.data);
    });
  }, []);

  const handleAddRestaurant = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
  };

  return (
    <div className="restaurant-container">
      <h1>My Restaurants</h1>
      <div className="restaurant-grid">
        {Array.isArray(restaurants) && restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
        <div className="add-restaurant-card" onClick={() => setShowPopup(true)}>
          <p>+</p>
          <span>Add new restaurant</span>
        </div>
      </div>
      {showPopup && (
        <RestaurantPopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAddRestaurant}
        />
      )}
    </div>
  );
};

export default MyRestaurants;
