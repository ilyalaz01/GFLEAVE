// src/components/AboutUs/AddFeedbackModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveFeedback } from '../../firebase/firebaseUtils';
import Modal from '../Common/Modal';

const AddFeedbackModal = ({ onClose, onFeedbackAdded, type }) => {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await saveFeedback({ text, type }, currentUser);
      onFeedbackAdded();
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      alert('❌ Ошибка добавления отзыва');
    } finally {
      setSaving(false);
    }
  };

  const title = type === 'positive' ? '💖 Добавить плюс' : '😢 Добавить минус';
  const placeholder = type === 'positive' 
    ? 'Что вам понравилось?' 
    : 'Что вам не понравилось?';

  return (
    <Modal onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Ваш отзыв</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-input form-textarea"
            placeholder={placeholder}
            required
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          className="upload-button"
          disabled={saving}
        >
          {saving ? 'Добавляем...' : 'Добавить отзыв'}
        </button>
      </form>
    </Modal>
  );
};

export default AddFeedbackModal;