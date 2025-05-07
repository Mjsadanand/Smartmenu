import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To extract the username and navigate
import axios from 'axios';
import RestaurantCard from './RestaurantCard';
import RestaurantPopup from './RestaurantPopup';
import './restaurant.css';
import { FaBell, FaUserCircle, FaPlus } from 'react-icons/fa';

const MyRestaurants = () => {
  const { username } = useParams(); // Extract username from the URL
  const navigate = useNavigate(); // For navigation
  const [restaurants, setRestaurants] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // For restaurant popup
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // For profile dropdown
  const [editRestaurant, setEditRestaurant] = useState(null);

  // Determine the greeting based on the time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const greeting = getGreeting();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurant/${username}`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setRestaurants(res.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [username]);

  const handleAddRestaurant = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
  };

  const handleUpdateRestaurant = (updatedRestaurant) => {
    setRestaurants(
      restaurants.map((r) => (r._id === updatedRestaurant._id ? updatedRestaurant : r))
    );
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurant/delete/${restaurantId}`, {
        withCredentials: true,
      });
      setRestaurants(restaurants.filter((r) => r._id !== restaurantId));
      alert('Restaurant deleted successfully!');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Failed to delete restaurant');
    }
  };

  const handleEditClick = (restaurant) => {
    setEditRestaurant(restaurant);
    setShowPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCardClick = (restaurantId) => {
    // Navigate to the menu creation page for the selected restaurant
    navigate(`/restaurant/${username}/menu/${restaurantId}`);
  };

  return (
    <div className="restaurant-container" >
      {/* Updated Header */}
      <div className="top-bar">
        <span className="greeting">
          {greeting}, {username.replace(/[0-9_]/g, '')}
        </span>
        <div className="icon-group">
          <FaBell className="icon" title="Notifications" />
          <div className="profile-dropdown">
            <FaUserCircle
              className="icon"
              title="Profile"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            />
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <span className="dropdown-item">Profile</span>
                <span className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="divider" />

      {/* Restaurant Grid */}
      <div className="restaurant-grid">
        {Array.isArray(restaurants) &&
          restaurants.map((r) => (
            <RestaurantCard
              key={r._id}
              restaurant={r}
              onClick={() => handleCardClick(r._id)}
              onEdit={() => handleEditClick(r)}
              onDelete={() => handleDeleteRestaurant(r._id)}
            />
          ))}
        <div className="add-restaurant-card" onClick={() => setShowPopup(true)}>
          <FaPlus />
          <span>Add new restaurant</span>
        </div>
      </div>
      {showPopup && (
        <RestaurantPopup
          onClose={() => {
            setShowPopup(false);
            setEditRestaurant(null);
          }}
          onAdd={handleAddRestaurant}
          onUpdate={handleUpdateRestaurant}
          editRestaurant={editRestaurant}
        />
      )}
    </div>
  );
};

export default MyRestaurants;
