import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './menu.css';
import Modal from './Modal.jsx';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { BsGlobe, BsEye } from 'react-icons/bs'; // Add the eye icon from react-icons
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client

const MenuCreation = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  // States
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal visibility
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Menu form
  const [menuForm, setMenuForm] = useState({ name: '', availableTime: '' });
  const [isEditingMenu, setIsEditingMenu] = useState(false);

  // Category form
  const [categoryName, setCategoryName] = useState('');
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // Item form
  const [itemDetails, setItemDetails] = useState({ name: '', price: '', description: '', image: null });
  const [currentItemId, setCurrentItemId] = useState(null);
  const [isEditingItem, setIsEditingItem] = useState(false);

  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [menuUrl, setMenuUrl] = useState('');

  const handleShowUrlPopup = (menuId) => {
    const url = `${window.location.origin}/menu/${menuId}`;
    setMenuUrl(url);
    setShowUrlPopup(true);
  };

  const closeUrlPopup = () => {
    setShowUrlPopup(false);
  };

  // Fetch Menus
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/menu/${restaurantId}`)
      .then((res) => {
        setMenus(res.data);
        if (!selectedMenu && res.data.length > 0) {
          setSelectedMenu(res.data[0]); // Automatically select the first menu
        }
      })
      .catch((err) => console.error('Error fetching menus:', err));
  }, [restaurantId, selectedMenu]);

  // Menu CRUD
  const handleAddOrEditMenu = async () => {
    setLoading(true); // Start loading
    try {
      if (isEditingMenu) {
        await axios.put(`http://localhost:5000/api/menu/${selectedMenu._id}`, menuForm);
      } else {
        await axios.post(`http://localhost:5000/api/menu`, {
          ...menuForm,
          restaurantId,
          categories: [],
        });
      }
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error saving menu:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteMenu = async (menuId) => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`http://localhost:5000/api/menu/${menuId}`);
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error deleting menu:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleTogglePublish = async (menuId, isPublished) => {
    setLoading(true); // Start loading
    try {
      const res = await axios.put(`http://localhost:5000/api/menu/${menuId}/publish`);
      const updatedMenu = res.data.menu;
      setMenus(menus.map((menu) => (menu._id === menuId ? updatedMenu : menu)));

      // Show the popup only when transitioning from Unpublish to Publish
      if (!isPublished && updatedMenu.published) {
        handleShowUrlPopup(menuId); // Show URL popup if published
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Category CRUD
  const handleAddOrEditCategory = async () => {
    setLoading(true); // Start loading
    try {
      const url = isEditingCategory
        ? `http://localhost:5000/api/menu/${selectedMenu._id}/category/${currentCategoryId}`
        : `http://localhost:5000/api/menu/${selectedMenu._id}/category`;
      const method = isEditingCategory ? axios.put : axios.post;
      await method(url, { name: categoryName });
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteCategory = async (menuId, categoryId) => {
    setLoading(true); // Start loading
    try {
      await axios.delete(`http://localhost:5000/api/menu/${menuId}/category/${categoryId}`);
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Item CRUD
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const handleAddOrEditItem = async () => {
    setLoading(true); // Start loading
    setIsSubmitting(true); // Start submission
    const formData = new FormData();
    Object.entries(itemDetails).forEach(([key, value]) => formData.append(key, value));

    try {
      const url = isEditingItem
        ? `http://localhost:5000/api/menu/${selectedMenu._id}/category/${currentCategoryId}/item/${currentItemId}`
        : `http://localhost:5000/api/menu/${selectedMenu._id}/category/${currentCategoryId}/item`;

      const method = isEditingItem ? axios.put : axios.post;

      await method(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error saving item:', err);
    } finally {
      setLoading(false); // Stop loading
      setIsSubmitting(false); // Stop submission
    }
  };

  const handleDeleteItem = async (menuId, categoryId, itemId) => {
    setLoading(true); // Start loading
    try {
      await axios.delete(
        `http://localhost:5000/api/menu/${menuId}/category/${categoryId}/item/${itemId}`
      );
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDownloadQRImage = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'menu-qr-code.png';
    link.click();
  };

  const handleDownloadQRPDF = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(pngUrl, 'PNG', 10, 10, 180, 180); // Adjust size and position
    pdf.save('menu-qr-code.pdf');
  };

  const handleUploadQRToCloudinary = async () => {
    const menuUrl = `${window.location.origin}/menu/${selectedMenu._id}`; // Correct menu URL

    // Create a temporary container to render the QR code
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);

    // Render the QR code temporarily in the DOM using createRoot
    const root = createRoot(tempDiv);
    root.render(<QRCodeCanvas value={menuUrl} size={300} />);

    // Wait for the QR code to render and extract its data URL
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for the QR code to render
    const canvas = tempDiv.querySelector('canvas');

    if (!canvas) {
      console.error('QR code canvas not found');
      document.body.removeChild(tempDiv); // Clean up the temporary container
      return;
    }

    const qrImage = canvas.toDataURL('image/png'); // Convert the QR code to a data URL

    // Clean up the temporary container
    root.unmount(); // Unmount the React component
    document.body.removeChild(tempDiv);

    try {
      const response = await axios.post('http://localhost:5000/api/menu/upload-qr', {
        restaurantId: selectedMenu.restaurantId,
        menuId: selectedMenu._id,
        qrImage,
        redirectUrl: menuUrl, // Pass the correct redirect URL to the backend
      });

      console.log('QR code uploaded successfully:', response.data);
      alert('QR code uploaded to Cloudinary!');
    } catch (error) {
      console.error('Error uploading QR code:', error);
      alert('Failed to upload QR code.');
    }
  };

  return (
    <div>
    <div>
      <div className="top-bar">
        <a onClick={() => navigate(-1)} className="back-button">
          <span>&lt;</span> Back to Restaurants
        </a>
        <div className="icon-group">
          <FaBell className="icon" title="Notifications" />
          <FaUserCircle className="icon" title="Profile" />
        </div>
      </div>
      <hr className="divider" />
    </div>
      <div className="menu-container">
        {loading && <Loader />}
        {/* Menu List */}
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
                <div className="publish-icon">
                  <button
                    className={`btn small ${menu.published ? 'published' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePublish(menu._id, menu.published);
                    }}
                  >
                    <BsGlobe /> {menu.published ? 'Unpublish' : 'Publish'}
                  </button>
                  {/* Eye Icon (Visible only when published) */}
                  {menu.published && (
                    <button
                      className="btn small eye-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowUrlPopup(menu._id);
                      }}
                    >
                      <BsEye /> View
                    </button>
                  )}
                </div>
              </div>
              <div className="dots">
                <FiMoreVertical
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpenId(dropdownOpenId === menu._id ? null : menu._id);
                  }}
                />
                {dropdownOpenId === menu._id && (
                  <div className="dropdown">
                    <FiEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuForm({ name: menu.name, availableTime: menu.availableTime });
                        setIsEditingMenu(true);
                        setShowMenuModal(true);
                      }}
                    />
                    <br />
                    <FiTrash2 onClick={() => handleDeleteMenu(menu._id)} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button className="btn full" onClick={() => setShowMenuModal(true)}>
            + Add Menu
          </button>
        </div>

        {/* Category & Item Section */}
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
                  <h3>{category.name}</h3>
                  <div className="dots">
                    <FiMoreVertical
                      onClick={() => setDropdownOpenId(dropdownOpenId === category._id ? null : category._id)}
                    />
                    {dropdownOpenId === category._id && (
                      <div className="dropdown">
                        <FiEdit
                          onClick={() => {
                            setCategoryName(category.name);
                            setCurrentCategoryId(category._id);
                            setIsEditingCategory(true);
                            setShowCategoryModal(true);
                          }}
                        />
                        <br />
                        <FiTrash2 onClick={() => handleDeleteCategory(selectedMenu._id, category._id)} />
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
                  {category.items?.map((item) => (
                    <div className="item-card" key={item._id}>
                      <img src={item.imageUrl} alt={item.name} />
                      <div className="item-content">
                        <h4>{item.name}</h4>
                        <p className="price">{item.price} Rs</p>
                        <p>{item.description}</p>
                      </div>
                      <div className="dots">
                        <FiMoreVertical
                          onClick={() => setDropdownOpenId(dropdownOpenId === item._id ? null : item._id)}
                        />
                        {dropdownOpenId === item._id && (
                          <div className="dropdown">
                            <FiEdit
                              onClick={() => {
                                setItemDetails({
                                  name: item.name,
                                  price: item.price,
                                  description: item.description,
                                  image: null,
                                });
                                setCurrentCategoryId(category._id);
                                setCurrentItemId(item._id);
                                setIsEditingItem(true);
                                setShowItemModal(true);
                              }}
                            />
                            <br />
                            <FiTrash2 onClick={() => handleDeleteItem(selectedMenu._id, category._id, item._id)} />
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

        {/* Modals */}
        <Modal show={showMenuModal} onClose={() => setShowMenuModal(false)} title="Menu">
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
          <button className="btn full" onClick={handleAddOrEditMenu}>
            {isEditingMenu ? 'Update' : 'Save'}
          </button>
        </Modal>

        <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} title="Category">
          <input
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button className="btn full" onClick={handleAddOrEditCategory}>
            {isEditingCategory ? 'Update' : 'Save'}
          </button>
        </Modal>

        <Modal show={showItemModal} onClose={() => setShowItemModal(false)} title="Item">
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
          <button className="btn full" onClick={handleAddOrEditItem} disabled={isSubmitting}>
            {isSubmitting ? (isEditingItem ? 'Updating...' : 'Saving...') : isEditingItem ? 'Update' : 'Save'}
          </button>
        </Modal>


        {showUrlPopup && (
          <div className="modal-overlay" onClick={closeUrlPopup}>
            <div className="modal-content" style={{ width: "500px" }} onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeUrlPopup}>×</button>
              <h3 style={{ color: "black" }}>Menu URL</h3>
              {/* Display the link */}
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn small"
                style={{ display: 'block', marginBottom: '1rem' }}
              >
                {menuUrl}
              </a>
              {/* Display the QR code */}
              <QRCodeCanvas
                id="qr-code"
                value={menuUrl}
                size={400}
                style={{ marginBottom: '1rem' }}
              />
              {/* Download buttons */}
              <button className="btn small" onClick={handleDownloadQRImage}>
                Download QR as Image
              </button>
              <button className="btn small" onClick={handleDownloadQRPDF}>
                Download QR as PDF
              </button>
              <button className="btn small" onClick={handleUploadQRToCloudinary}>
                Make Public
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader = () => (
  <div className="loader">
    <div className="spinner"></div>
  </div>
);

export default MenuCreation;
