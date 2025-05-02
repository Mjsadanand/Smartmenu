import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>{title}</h2>
        {children}
        <button className="btn close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
