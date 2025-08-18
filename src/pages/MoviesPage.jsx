// src/pages/MoviesPage.jsx
import React from 'react';
import MovieList from '../components/Movies/MovieList';

const MoviesPage = () => {
  return (
    <div className="page-container movies-container">
      <h1 className="page-title">🎬 Наши Фильмы</h1>
      <MovieList />
    </div>
  );
};

export default MoviesPage;