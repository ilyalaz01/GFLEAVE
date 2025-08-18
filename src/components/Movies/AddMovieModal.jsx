// src/components/Movies/AddMovieModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Common/Modal';

const AddMovieModal = ({ onClose, onMovieAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'planned',
    genre: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Импортируем Firebase функции
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      // Добавляем фильм в Firebase
      await addDoc(collection(db, 'movies'), {
        title: formData.title,
        status: formData.status,
        genre: formData.genre,
        addedBy: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Закрываем модалку и обновляем список
      onMovieAdded();
    } catch (error) {
      console.error('Ошибка добавления фильма:', error);
      alert('❌ Ошибка добавления фильма: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="🎬 Добавить фильм">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название фильма</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Например: Титаник"
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
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="planned">Запланирован</option>
            <option value="watched">Посмотрели</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="upload-button"
          disabled={saving}
        >
          {saving ? 'Добавляем...' : 'Добавить фильм'}
        </button>
      </form>
    </Modal>
  );
};

export default AddMovieModal;