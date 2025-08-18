// src/components/Plans/PlansList.jsx
import React, { useState, useEffect } from 'react';
import { loadPlans, deletePlan } from '../../firebase/firebaseUtils';
import AddPlanModal from './AddPlanModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Trash2 } from 'lucide-react';

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPlansData();
  }, []);

  const loadPlansData = async () => {
    try {
      const planData = await loadPlans();
      setPlans(planData);
    } catch (error) {
      console.error('Ошибка загрузки планов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanAdded = () => {
    loadPlansData();
    setShowModal(false);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Удалить этот план?')) {
      try {
        await deletePlan(planId);
        setPlans(plans.filter(plan => plan.id !== planId));
      } catch (error) {
        console.error('Ошибка удаления плана:', error);
        alert('❌ Ошибка удаления плана');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="✈️ Загружаем планы..." />;
  }

  return (
    <>
      <button 
        className="add-button" 
        onClick={() => setShowModal(true)}
      >
        ➕ Добавить план
      </button>

      {plans.length === 0 ? (
        <div className="empty-state">
          <h3>✈️ Пока нет планов</h3>
          <p>Добавьте первую мечту для будущего</p>
        </div>
      ) : (
        <div className="plans-list">
          {plans.map(plan => (
            <div key={plan.id} className="dream-card">
              <div className="dream-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="dream-emoji">{plan.emoji || '✨'}</div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeletePlan(plan.id)}
                  title="Удалить план"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="dream-title">{plan.title}</h3>
              {plan.description && (
                <p className="dream-description">{plan.description}</p>
              )}
              <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.8rem' }}>
                Добавил: {plan.addedBy || 'Неизвестно'}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddPlanModal 
          onClose={() => setShowModal(false)}
          onPlanAdded={handlePlanAdded}
        />
      )}
    </>
  );
};

export default PlansList;