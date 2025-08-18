// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import MoviesPage from './pages/MoviesPage';
import PlansPage from './pages/PlansPage';
import AboutUsPage from './pages/AboutUsPage';
import UploadPage from './pages/UploadPage';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Загружаем наши воспоминания..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;