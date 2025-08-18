// src/pages/GalleryPage.jsx
import React from 'react';
import GalleryView from '../components/Gallery/GalleryView';

const GalleryPage = () => {
  return (
    <div className="page-container gallery-container">
      <h1 className="page-title">🖼️ Наша Галерея</h1>
      <GalleryView />
    </div>
  );
};

export default GalleryPage;