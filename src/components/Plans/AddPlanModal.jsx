// src/components/Plans/AddPlanModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savePlan } from '../../firebase/firebaseUtils';
import Modal from '../Common/Modal';

const AddPlanModal = ({ onClose, onPlanAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    emoji: '✨',
    description: ''
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
      await savePlan(formData, currentUser);
      onPlanAdded();
    } catch (error) {
      console.error('Ошибка добавления плана:', error);
      alert('❌ Ошибка добавления плана');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="✈️ Добавить план">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название плана</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Например: Полететь в Париж"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Эмодзи</label>
          <input
            type="text"
            name="emoji"
            value={formData.emoji}
            onChange={handleInputChange}
            className="form-input"
            placeholder="🏖️"
            maxLength="2"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="Расскажите подробнее о вашей мечте..."
          />
        </div>

        <button 
          type="submit" 
          className="upload-button"
          disabled={saving}
        >
          {saving ? 'Добавляем...' : 'Добавить план'}
        </button>
      </form>
    </Modal>
  );
};

export default AddPlanModal;