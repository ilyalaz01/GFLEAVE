// src/components/Gallery/GalleryView.jsx
import React, { useState, useEffect } from 'react';
import { loadPhotos } from '../../firebase/firebaseUtils';
import LoadingSpinner from '../Common/LoadingSpinner';

const GalleryView = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return <LoadingSpinner message="📸 Загружаем галерею..." />;
  }

  if (photos.length === 0) {
    return (
      <div className="empty-state">
        <h3>📸 Пока нет фотографий в галерее</h3>
        <p>Загрузите фотографии во вкладке "Загрузить фото"</p>
      </div>
    );
  }

  // Группируем фото по годам
  const photosByYear = {};
  photos.forEach(photo => {
    if (!photosByYear[photo.year]) {
      photosByYear[photo.year] = [];
    }
    photosByYear[photo.year].push(photo);
  });

  // Сортируем года по убыванию (новые сверху)
  const years = Object.keys(photosByYear).sort((a, b) => b - a);

  return (
    <>
      <div className="gallery-content">
        {years.map(year => (
          <div key={year} className="year-section">
            <h2 className="year-title">{year} год</h2>
            <div className="photos-grid">
              {photosByYear[year].map(photo => (
                <div 
                  key={photo.firestoreId} 
                  className="gallery-photo"
                  onClick={() => openPhotoModal(photo)}
                >
                  <img src={photo.imageData} alt={photo.title} />
                  <div className="gallery-photo-info">
                    <h3>{photo.title}</h3>
                    <p>{photo.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра фото */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <span className="photo-modal-close" onClick={closePhotoModal}>
              &times;
            </span>
            <img src={selectedPhoto.imageData} alt={selectedPhoto.title} />
            <div className="photo-modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.year} • {selectedPhoto.location}</p>
              {selectedPhoto.description && (
                <p className="photo-description">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryView;