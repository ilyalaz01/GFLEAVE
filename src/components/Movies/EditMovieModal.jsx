// src/components/Movies/EditMovieModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Common/Modal';
import { Star } from 'lucide-react';

const EditMovieModal = ({ movie, onClose, onMovieUpdated }) => {
  const [formData, setFormData] = useState({
    title: movie.title || '',
    status: movie.status || 'planned',
    genre: movie.genre || '',
    rating: movie.rating || null,
    review: movie.review || '',
    watchedDate: movie.watchedDate ? new Date(movie.watchedDate).toISOString().split('T')[0] : ''
  });
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: prev.rating === rating ? null : rating
    }));
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      // Если меняем на "запланирован", очищаем данные о просмотре
      rating: newStatus === 'planned' ? null : prev.rating,
      review: newStatus === 'planned' ? '' : prev.review,
      watchedDate: newStatus === 'planned' ? '' : prev.watchedDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const movieId = movie.id || movie.firestoreId;
      
      if (!movieId) {
        throw new Error('ID фильма не найден');
      }
      
      const { collection, doc, getDoc, updateDoc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      const movieRef = doc(db, 'movies', movieId);
      
      const updateData = {
        title: formData.title,
        status: formData.status,
        genre: formData.genre,
        updatedBy: currentUser,
        updatedAt: new Date().toISOString()
      };

      // Добавляем данные о просмотре только если статус "просмотрен"
      if (formData.status === 'watched') {
        updateData.rating = formData.rating;
        updateData.review = formData.review;
        updateData.watchedDate = formData.watchedDate || new Date().toISOString();
      } else {
        // Очищаем данные о просмотре если статус "запланирован"
        updateData.rating = null;
        updateData.review = '';
        updateData.watchedDate = null;
      }

      // Проверяем, существует ли документ
      const movieSnap = await getDoc(movieRef);
      
      if (movieSnap.exists()) {
        await updateDoc(movieRef, updateData);
      } else {
        // Если документ не существует, создаем новый
        await setDoc(movieRef, {
          ...movie,
          ...updateData,
          addedBy: movie.addedBy || currentUser,
          createdAt: movie.createdAt || new Date().toISOString()
        });
      }
      
      onMovieUpdated();
    } catch (error) {
      console.error('Ошибка обновления фильма:', error);
      alert('❌ Ошибка обновления фильма: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        <label className="form-label">Ваша оценка (1-10)</label>
        <div className="stars-container">
          {[...Array(10)].map((_, i) => {
            const rating = i + 1;
            return (
              <button
                key={rating}
                type="button"
                className={`star-button ${formData.rating && rating <= formData.rating ? 'active' : ''}`}
                onClick={() => handleRatingClick(rating)}
              >
                <Star size={24} />
                <span className="star-number">{rating}</span>
              </button>
            );
          })}
        </div>
        {formData.rating && (
          <p className="rating-display">Ваша оценка: {formData.rating}/10</p>
        )}
      </div>
    );
  };

  return (
    <Modal onClose={onClose} title="🎬 Редактировать фильм">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название фильма</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Жанр (необязательно)</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Например: Комедия, Драма, Боевик"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Статус</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleStatusChange}
            className="form-input"
          >
            <option value="planned">Запланирован</option>
            <option value="watched">Просмотрен</option>
          </select>
        </div>

        {formData.status === 'watched' && (
          <>
            <div className="form-group">
              <label className="form-label">Дата просмотра</label>
              <input
                type="date"
                name="watchedDate"
                value={formData.watchedDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            {renderStarRating()}

            <div className="form-group">
              <label className="form-label">Ваш отзыв (необязательно)</label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Что вы думаете об этом фильме?"
                rows="3"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="upload-button"
          disabled={saving}
        >
          {saving ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>
      </form>
    </Modal>
  );
};

export default EditMovieModal;