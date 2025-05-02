/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './menu.css';
import Modal from './Modal.jsx';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';

const MenuCreation = () => {
  const { username, restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [itemDetails, setItemDetails] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  const [menuForm, setMenuForm] = useState({ name: '', availableTime: '' });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const [menuOptions, setMenuOptions] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [itemOptions, setItemOptions] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/menu/${restaurantId}`)
      .then((res) => setMenus(res.data))
      .catch((err) => console.error('Error fetching menus:', err));
  }, [restaurantId]);

  const handleAddMenu = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/menu/', {
        restaurantId,
        name: menuForm.name,
        availableTime: menuForm.availableTime,
        categories: [],
      });
      setMenus([...menus, res.data]);
      setMenuForm({ name: '', availableTime: '' });
      setShowMenuModal(false);
    } catch (err) {
      console.error('Error adding menu:', err);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${menuId}`);
      setMenus(menus.filter((m) => m._id !== menuId));
      if (selectedMenu?._id === menuId) setSelectedMenu(null);
    } catch (err) {
      console.error('Error deleting menu:', err);
    }
  };

  const handleDeleteCategory = async (menuId, categoryId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/menu/${menuId}/category/${categoryId}`
      );
      setMenus(menus.map((m) => (m._id === menuId ? res.data : m)));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleDeleteItem = async (menuId, categoryId, itemId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/menu/${menuId}/category/${categoryId}/item/${itemId}`
      );
      setMenus(menus.map((m) => (m._id === menuId ? res.data : m)));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleAddCategory = async () => {
    if (!selectedMenu) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/menu/${selectedMenu._id}/category`,
        { name: categoryName }
      );
      setMenus(menus.map((m) => (m._id === selectedMenu._id ? res.data : m)));
      setCategoryName('');
      setShowCategoryModal(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddItem = async () => {
    if (!selectedMenu || !currentCategoryId) return;

    const formData = new FormData();
    formData.append('name', itemDetails.name);
    formData.append('price', itemDetails.price);
    formData.append('description', itemDetails.description);
    formData.append('image', itemDetails.image);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/menu/${selectedMenu._id}/category/${currentCategoryId}/item`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMenus(menus.map((m) => (m._id === selectedMenu._id ? res.data : m)));
      setItemDetails({ name: '', price: '', description: '', image: null });
      setShowItemModal(false);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  return (
    <div className="menu-container">
      {/* Menu Section */}
      <div className="menu-list">
        <h2>Menus</h2>
        {menus.map((menu) => (
          <div
            key={menu._id}
            className={`menu-card ${selectedMenu?._id === menu._id ? 'active' : ''}`}
            onClick={() => setSelectedMenu(menu)}
          >
            <div className="menu-header">
              <div>
                <h3>{menu.name}</h3>
                <p>{menu.availableTime}</p>
              </div>
              <div
                className="dots"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOptions(menuOptions === menu._id ? null : menu._id);
                }}
              >
                <FiMoreVertical />
                {menuOptions === menu._id && (
                  <div className="dropdown">
                    <FiEdit /> 
                    <br />
                    <FiTrash2 onClick={() => handleDeleteMenu(menu._id)} /> 
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <button className="btn full" onClick={() => setShowMenuModal(true)}>
          + Add Menu
        </button>
      </div>

      {/* Category and Items Section */}
      {selectedMenu && (
        <div className="category-section">
          <div className="section-header">
            <h2>{selectedMenu.name}</h2>
            <button className="btn" onClick={() => setShowCategoryModal(true)}>
              + Add Category
            </button>
          </div>

          {selectedMenu.categories?.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-title">
                <div>
                  <h3>{category.name}</h3>
                </div>
                <div className="dots">
                  <FiMoreVertical
                    onClick={() =>
                      setCategoryOptions(categoryOptions === category._id ? null : category._id)
                    }
                  />
                  {categoryOptions === category._id && (
                    <div className="dropdown">
                      <FiEdit /> 
                      <br />
                      <FiTrash2
                        onClick={() => handleDeleteCategory(selectedMenu._id, category._id)}
                      /> 
                    </div>
                  )}
                </div>
                <button
                  className="btn small"
                  onClick={() => {
                    setCurrentCategoryId(category._id);
                    setShowItemModal(true);
                  }}
                >
                  + Add Item
                </button>
              </div>

              <div className="items-grid">
                {category.items?.map((item, index) => (
                  <div className="item-card" key={item._id}> 
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-content">
                      <h4>{item.name}</h4>
                      <p className="price">{item.price}Rs</p>
                      <p>{item.description}</p>
                    </div>
                    <div className="dots">
                      <FiMoreVertical
                        onClick={() =>
                          setItemOptions(itemOptions === item._id ? null : item._id)
                        }
                      />
                      {itemOptions === item._id && (
                        <div className="dropdown">
                          <FiEdit /> 
                          <br />
                          <FiTrash2
                            onClick={() =>
                              handleDeleteItem(selectedMenu._id, category._id, item._id)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popups */}
      <Modal show={showMenuModal} onClose={() => setShowMenuModal(false)} title="Add Menu">
        <input
          placeholder="Menu Name"
          value={menuForm.name}
          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
        />
        <input
          placeholder="Available Time"
          value={menuForm.availableTime}
          onChange={(e) => setMenuForm({ ...menuForm, availableTime: e.target.value })}
        />
        <button className="btn full" onClick={handleAddMenu}>
          Save
        </button>
      </Modal>

      <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Add Category">
        <input
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button className="btn full" onClick={handleAddCategory}>
          Save
        </button>
      </Modal>

      <Modal show={showItemModal} onClose={() => setShowItemModal(false)} title="Add Item">
        <input
          placeholder="Name"
          value={itemDetails.name}
          onChange={(e) => setItemDetails({ ...itemDetails, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          value={itemDetails.price}
          onChange={(e) => setItemDetails({ ...itemDetails, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={itemDetails.description}
          onChange={(e) => setItemDetails({ ...itemDetails, description: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setItemDetails({ ...itemDetails, image: e.target.files[0] })}
        />
        <button className="btn full" onClick={handleAddItem}>
          Save
        </button>
      </Modal>
    </div>
  );
};

export default MenuCreation;
