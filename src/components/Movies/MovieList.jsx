// src/components/Movies/MovieList.jsx
import React, { useState, useEffect } from 'react';
import { loadMovies, deleteMovie, saveMovie } from '../../firebase/firebaseUtils';
import AddMovieModal from './AddMovieModal';
import EditMovieModal from './EditMovieModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Trash2, Edit, Star, Calendar, Eye, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadMoviesData();
  }, []);

  const loadMoviesData = async () => {
    try {
      const movieData = await loadMovies();
      
      // Дедупликация фильмов по ID
      const uniqueMovies = movieData.reduce((acc, movie) => {
        const movieId = movie.id || movie.firestoreId;
        if (!acc.find(m => (m.id || m.firestoreId) === movieId)) {
          acc.push(movie);
        }
        return acc;
      }, []);
      
      setMovies(uniqueMovies);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieAdded = () => {
    loadMoviesData();
    setShowAddModal(false);
  };

  const handleMovieUpdated = () => {
    loadMoviesData();
    setShowEditModal(false);
    setEditingMovie(null);
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Удалить этот фильм из списка?')) {
      try {
        await deleteMovie(movieId);
        setMovies(movies.filter(movie => movie.id !== movieId));
      } catch (error) {
        console.error('Ошибка удаления фильма:', error);
        alert('❌ Ошибка удаления фильма');
      }
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setShowEditModal(true);
  };

  const handleQuickStatusChange = async (movie) => {
    try {
      console.log('Изменяем статус фильма:', movie);
      
      const newStatus = movie.status === 'planned' ? 'watched' : 'planned';
      const movieId = movie.id || movie.firestoreId;
      
      if (!movieId) {
        console.error('ID фильма не найден:', movie);
        alert('❌ Ошибка: ID фильма не найден');
        return;
      }
      
      // Сначала проверим, существует ли документ
      const { collection, doc, getDoc, updateDoc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      const movieRef = doc(db, 'movies', movieId);
      const movieSnap = await getDoc(movieRef);
      
      const updateData = {
        ...movie,
        status: newStatus,
        updatedBy: currentUser,
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus === 'watched') {
        updateData.watchedDate = new Date().toISOString();
      } else {
        updateData.rating = null;
        updateData.review = '';
        updateData.watchedDate = null;
      }

      if (movieSnap.exists()) {
        // Документ существует - обновляем
        await updateDoc(movieRef, updateData);
      } else {
        // Документ не существует - создаем новый
        console.log('Документ не найден, создаем новый');
        await setDoc(movieRef, updateData);
      }
      
      loadMoviesData();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      alert('❌ Ошибка изменения статуса: ' + error.message);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="movie-rating">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-number">{rating}/10</span>
      </div>
    );
  };

  const getMoviePoster = (title) => {
    // Используем простой градиент вместо внешнего сервиса
    const colors = ['ff6b9d', 'c471ed', '667eea', 'f093fb', 'f5576c', '4facfe'];
    const colorIndex = title.length % colors.length;
    const color = colors[colorIndex];
    
    // Создаем простое изображение с градиентом
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    
    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, 300, 450);
    gradient.addColorStop(0, `#${color}`);
    gradient.addColorStop(1, `#${color}88`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 450);
    
    // Добавляем текст
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Разбиваем длинный текст на строки
    const words = title.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      if (ctx.measureText(testLine).width > 250 && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim());
    
    // Рисуем строки текста
    const lineHeight = 30;
    const startY = 225 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 150, startY + index * lineHeight);
    });
    
    return canvas.toDataURL();
  };

  if (loading) {
    return <LoadingSpinner message="🎬 Загружаем список фильмов..." />;
  }

  // Дедупликация и фильтрация фильмов
  const uniqueMovies = movies.reduce((acc, movie) => {
    const movieId = movie.id || movie.firestoreId;
    const existingMovie = acc.find(m => (m.id || m.firestoreId) === movieId);
    
    if (!existingMovie) {
      acc.push(movie);
    } else {
      // Если фильм уже есть, обновляем его данными (берем более свежий)
      const existingIndex = acc.findIndex(m => (m.id || m.firestoreId) === movieId);
      if (movie.updatedAt && (!existingMovie.updatedAt || movie.updatedAt > existingMovie.updatedAt)) {
        acc[existingIndex] = movie;
      }
    }
    
    return acc;
  }, []);

  const plannedMovies = uniqueMovies.filter(movie => movie.status === 'planned');
  const watchedMovies = uniqueMovies.filter(movie => movie.status === 'watched');

  return (
    <>
      <div className="movies-header">
        <button 
          className="add-button" 
          onClick={() => setShowAddModal(true)}
        >
          ➕ Добавить фильм
        </button>
        
        <div className="movies-stats">
          <div className="stat-item">
            <Clock size={20} />
            <span>Запланировано: {plannedMovies.length}</span>
          </div>
          <div className="stat-item">
            <Eye size={20} />
            <span>Просмотрено: {watchedMovies.length}</span>
          </div>
        </div>
      </div>

              {uniqueMovies.length === 0 ? (
        <div className="empty-state">
          <h3>🎬 Пока нет фильмов в списке</h3>
          <p>Добавьте первый фильм для просмотра</p>
        </div>
      ) : (
        <div className="movies-sections">
          {/* Запланированные фильмы */}
          {plannedMovies.length > 0 && (
            <div className="movies-section">
              <h2 className="section-title">
                <Clock size={24} />
                Запланированные ({plannedMovies.length})
              </h2>
              <div className="movie-grid">
                {plannedMovies.map((movie, index) => {
                  const uniqueKey = `planned-${movie.id || movie.firestoreId}-${movie.createdAt || index}`;
                  return (
                    <div key={uniqueKey} className="movie-card planned">
                    <div className="movie-poster">
                      <img 
                        src={movie.posterUrl || getMoviePoster(movie.title)} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.src = getMoviePoster(movie.title);
                        }}
                      />
                      <div className="movie-overlay">
                        <button 
                          className="quick-action-btn"
                          onClick={() => handleQuickStatusChange(movie)}
                          title="Отметить как просмотренный"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-status status-planned">
                          Запланирован
                        </span>
                        {movie.genre && (
                          <span className="movie-genre">{movie.genre}</span>
                        )}
                      </div>
                      
                      <div className="movie-actions">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditMovie(movie)}
                          title="Редактировать"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteMovie(movie.id || movie.firestoreId)}
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="movie-added">
                        Добавил: {movie.addedBy || 'Неизвестно'}
                      </p>
                    </div>
                                      </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Просмотренные фильмы */}
          {watchedMovies.length > 0 && (
            <div className="movies-section">
              <h2 className="section-title">
                <Eye size={24} />
                Просмотренные ({watchedMovies.length})
              </h2>
              <div className="movie-grid">
                {watchedMovies.map((movie, index) => {
                  const uniqueKey = `watched-${movie.id || movie.firestoreId}-${movie.createdAt || index}`;
                  return (
                    <div key={uniqueKey} className="movie-card watched">
                    <div className="movie-poster">
                      <img 
                        src={movie.posterUrl || getMoviePoster(movie.title)} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.src = getMoviePoster(movie.title);
                        }}
                      />
                      <div className="movie-overlay">
                        <button 
                          className="quick-action-btn"
                          onClick={() => handleQuickStatusChange(movie)}
                          title="Вернуть в запланированные"
                        >
                          <Clock size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-status status-watched">
                          Просмотрен
                        </span>
                        {movie.watchedDate && (
                          <span className="watch-date">
                            <Calendar size={14} />
                            {new Date(movie.watchedDate).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                      
                      {renderStars(movie.rating)}
                      
                      {movie.review && (
                        <p className="movie-review">"{movie.review}"</p>
                      )}
                      
                      <div className="movie-actions">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditMovie(movie)}
                          title="Редактировать"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteMovie(movie.id)}
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="movie-added">
                        Добавил: {movie.addedBy || 'Неизвестно'}
                      </p>
                    </div>
                                      </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddMovieModal 
          onClose={() => setShowAddModal(false)}
          onMovieAdded={handleMovieAdded}
        />
      )}

      {showEditModal && editingMovie && (
        <EditMovieModal 
          movie={editingMovie}
          onClose={() => {
            setShowEditModal(false);
            setEditingMovie(null);
          }}
          onMovieUpdated={handleMovieUpdated}
        />
      )}
    </>
  );
};

export default MovieList;