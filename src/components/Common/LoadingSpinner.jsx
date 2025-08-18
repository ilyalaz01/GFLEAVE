// src/components/Common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = "Загрузка..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-heart">❤️</div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;