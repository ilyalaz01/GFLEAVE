// src/pages/AboutUsPage.jsx
import React from 'react';
import FeedbackColumns from '../components/AboutUs/FeedbackColumns';

const AboutUsPage = () => {
  return (
    <div className="page-container about-us-container">
      <h1 className="page-title">💌 Мы о нас</h1>
      <FeedbackColumns />
    </div>
  );
};

export default AboutUsPage;