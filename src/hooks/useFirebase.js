// src/hooks/useFirebase.js
import { useState, useEffect } from 'react';
import { 
  loadPhotos, 
  loadMovies, 
  loadPlans, 
  loadFeedback 
} from '../firebase/firebaseUtils';

/**
 * Хук для работы с данными Firebase
 * @param {string} dataType - тип данных ('photos', 'movies', 'plans', 'feedback')
 */
export const useFirebaseData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result = [];
      
      switch (dataType) {
        case 'photos':
          result = await loadPhotos();
          break;
        case 'movies':
          result = await loadMovies();
          break;
        case 'plans':
          result = await loadPlans();
          break;
        case 'feedback':
          result = await loadFeedback();
          break;
        default:
          throw new Error(`Неподдерживаемый тип данных: ${dataType}`);
      }
      
      setData(result);
    } catch (err) {
      console.error(`Ошибка загрузки ${dataType}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dataType]);

  return {
    data,
    loading,
    error,
    reload: loadData,
    setData
  };
};

/**
 * Хук для работы с фотографиями
 */
export const usePhotos = () => {
  return useFirebaseData('photos');
};

/**
 * Хук для работы с фильмами
 */
export const useMovies = () => {
  return useFirebaseData('movies');
};

/**
 * Хук для работы с планами
 */
export const usePlans = () => {
  return useFirebaseData('plans');
};

/**
 * Хук для работы с отзывами
 */
export const useFeedback = () => {
  return useFirebaseData('feedback');
};

export default useFirebaseData;