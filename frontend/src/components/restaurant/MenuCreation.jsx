import React from 'react';
import { useParams } from 'react-router-dom';

const MenuCreation = () => {
  const { username, restaurantId } = useParams();

  return (
    <div>
      <h1>Create Menu for {username}'s Restaurant</h1>
      <p>Restaurant ID: {restaurantId}</p>
      {/* Add menu creation form here */}
    </div>
  );
};

export default MenuCreation;