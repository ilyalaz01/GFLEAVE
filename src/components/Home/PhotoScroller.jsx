// src/components/Home/PhotoScroller.jsx
import React, { useState, useEffect } from 'react';
import { loadPhotos } from '../../firebase/firebaseUtils';
import LoadingSpinner from '../Common/LoadingSpinner';

const PhotoScroller = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotosData();
  }, []);

  const loadPhotosData = async () => {
    try {
      const photoData = await loadPhotos();
      setPhotos(photoData);
    } catch (error) {
      console.error('Ошибка загрузки фотографий:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="📸 Загружаем воспоминания..." />;
  }

  if (photos.length === 0) {
    return (
      <div className="photo-scroller">
        <div className="empty-state">
          <div className="photo-card">
            <div className="tape tape-top"></div>
            <div className="empty-content">
              <h3>📸 Пока нет фотографий</h3>
              <p>Загрузите первую фотографию во вкладке "Загрузить фото"</p>
            </div>
            <div className="tape tape-bottom"></div>
          </div>
        </div>
      </div>
    );
  }

  // Перемешиваем фото для рандомного порядка
  const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
  
  // Создаем бесконечный цикл (дублируем фото)
  const infinitePhotos = [...shuffledPhotos, ...shuffledPhotos, ...shuffledPhotos];

  return (
    <div className="photo-scroller">
      <div className="scroller-track">
        {infinitePhotos.map((photo, index) => (
          <div key={`${photo.firestoreId}-${index}`} className="photo-card">
            <div className="tape tape-top"></div>
            <img src={photo.imageData} alt={photo.title} />
            <div className="photo-info">
              <h3>{photo.title}</h3>
              <p>{photo.year} • {photo.location}</p>
              {photo.description && (
                <p className="photo-description">{photo.description}</p>
              )}
            </div>
            <div className="tape tape-bottom"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoScroller;