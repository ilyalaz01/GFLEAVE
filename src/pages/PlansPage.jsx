// src/pages/PlansPage.jsx
import React from 'react';
import PlansList from '../components/Plans/PlansList';

const PlansPage = () => {
  return (
    <div className="page-container plans-container">
      <h1 className="page-title">✈️ Наши Планы</h1>
      <PlansList />
    </div>
  );
};

export default PlansPage;