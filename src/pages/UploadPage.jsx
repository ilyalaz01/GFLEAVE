// src/pages/UploadPage.jsx
import React from 'react';
import PhotoUpload from '../components/Upload/PhotoUpload';

const UploadPage = () => {
  return (
    <div className="page-container upload-container">
      <h1 className="page-title">📤 Загрузить Фото</h1>
      <PhotoUpload />
    </div>
  );
};

export default UploadPage;