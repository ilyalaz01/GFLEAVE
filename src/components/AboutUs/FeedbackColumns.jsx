// src/components/AboutUs/FeedbackColumns.jsx
import React, { useState, useEffect } from 'react';
import { loadFeedback, deleteFeedback } from '../../firebase/firebaseUtils';
import AddFeedbackModal from './AddFeedbackModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Trash2 } from 'lucide-react';

const FeedbackColumns = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = async () => {
    try {
      const feedbackData = await loadFeedback();
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackAdded = () => {
    loadFeedbackData();
    setShowModal(false);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Удалить этот отзыв?')) {
      try {
        await deleteFeedback(feedbackId);
        setFeedback(feedback.filter(item => item.id !== feedbackId));
      } catch (error) {
        console.error('Ошибка удаления отзыва:', error);
        alert('❌ Ошибка удаления отзыва');
      }
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner message="💌 Загружаем отзывы..." />;
  }

  const positiveFeedback = feedback.filter(item => item.type === 'positive');
  const negativeFeedback = feedback.filter(item => item.type === 'negative');

  return (
    <>
      <div className="feedback-columns">
        {/* Положительные отзывы */}
        <div className="feedback-column positive">
          <h2 className="column-title">💖 Мне понравилось</h2>
          <button 
            className="add-button" 
            onClick={() => openModal('positive')}
          >
            ➕ Добавить плюс
          </button>
          
          {positiveFeedback.length === 0 ? (
            <div className="empty-state">
              <p>💖 Пока нет положительных отзывов</p>
            </div>
          ) : (
            positiveFeedback.map(item => (
              <div key={item.id} className="feedback-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ flex: 1, margin: 0 }}>{item.text}</p>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteFeedback(item.id)}
                    title="Удалить отзыв"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <small style={{ color: '#999', marginTop: '0.5rem', display: 'block' }}>
                  — {item.addedBy || 'Неизвестно'}
                </small>
              </div>
            ))
          )}
        </div>

        {/* Негативные отзывы */}
        <div className="feedback-column negative">
          <h2 className="column-title">😢 Мне не понравилось</h2>
          <button 
            className="add-button" 
            onClick={() => openModal('negative')}
          >
            ➕ Добавить минус
          </button>
          
          {negativeFeedback.length === 0 ? (
            <div className="empty-state">
              <p>😢 Пока нет негативных отзывов</p>
            </div>
          ) : (
            negativeFeedback.map(item => (
              <div key={item.id} className="feedback-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ flex: 1, margin: 0 }}>{item.text}</p>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteFeedback(item.id)}
                    title="Удалить отзыв"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <small style={{ color: '#999', marginTop: '0.5rem', display: 'block' }}>
                  — {item.addedBy || 'Неизвестно'}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AddFeedbackModal 
          onClose={() => setShowModal(false)}
          onFeedbackAdded={handleFeedbackAdded}
          type={modalType}
        />
      )}
    </>
  );
};

export default FeedbackColumns;