import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './restaurant/Modal.jsx'; // Reuse the Modal component for the popup
import { QRCodeCanvas } from 'qrcode.react';
import './hotel.css'

function Hotel() {
  const [restaurants, setRestaurants] = useState([]); // Store all restaurants
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Store the selected restaurant
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // Store the QR code URL
  const [showQrPopup, setShowQrPopup] = useState(false); // Control the QR popup visibility

  // Fetch all restaurants
  useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant'); // Correct API endpoint
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  fetchRestaurants();
}, []);

  // Fetch QR code for a specific restaurant
  const handleRestaurantClick = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/restaurant/${restaurantId}/qr`);
      setQrCodeUrl(response.data.qrCode.redirectUrl); // Use the redirect URL from the backend
      setSelectedRestaurant(response.data.restaurant); // Set the selected restaurant
      setShowQrPopup(true); // Show the QR popup
    } catch (error) {
      console.error('Error fetching QR code:', error);
      alert('Failed to fetch QR code for this restaurant.');
    }
  };

  return (
    <div className="hotel-container">
      <h1>Restaurants</h1>
      <div className="restaurant-cards">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="restaurant-card"
            onClick={() => handleRestaurantClick(restaurant._id)}
          >
            <img src={restaurant.imageUrl} alt={restaurant.name} />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location}</p>
          </div>
        ))}
      </div>

      {/* QR Code Popup */}
      {showQrPopup && (
        <Modal
          className="qr-popup" // Apply a custom class for the QR popup
          show={showQrPopup}
          onClose={() => setShowQrPopup(false)}
          title="Restaurant QR Code"
        >
          <div className="qr-popup-content">
            <h2>{selectedRestaurant?.name}</h2>
            <p>{selectedRestaurant?.location}</p>
            {qrCodeUrl ? (
              <QRCodeCanvas value={qrCodeUrl} size={300} />
            ) : (
              <p>Loading QR Code...</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Hotel;