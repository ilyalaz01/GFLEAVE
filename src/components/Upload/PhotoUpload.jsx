// src/components/Upload/PhotoUpload.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savePhoto } from '../../firebase/firebaseUtils';

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    location: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Пожалуйста, выберите фото');
      return;
    }

    setUploading(true);
    
    try {
      await savePhoto(formData, selectedFile, currentUser);
      
      // Очищаем форму
      setFormData({
        title: '',
        year: new Date().getFullYear(),
        location: '',
        description: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
      
      alert('✅ Фотография успешно загружена!');
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('❌ Ошибка загрузки фотографии');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">📸 Выберите фото</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input"
            accept="image/*"
            required
          />
          {previewUrl && (
            <div className="file-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">📝 Название</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Например: Наш первый поцелуй"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">📅 Год</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="form-input"
            min="2000"
            max="2030"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">📍 Место</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Например: Парк Горького"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">💭 Описание (необязательно)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="Расскажите об этом моменте..."
          />
        </div>

        <button 
          type="submit" 
          className="upload-button"
          disabled={uploading}
        >
          {uploading ? '📸 Загружаем...' : '💕 Сохранить воспоминание'}
        </button>
      </form>
    </div>
  );
};

export default PhotoUpload;