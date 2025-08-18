// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage
 * @param {string} key - ключ для хранения
 * @param {any} initialValue - начальное значение
 */
export const useLocalStorage = (key, initialValue) => {
  // Получаем значение из localStorage или используем начальное
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для установки значения
  const setValue = (value) => {
    try {
      // Позволяем передавать функцию как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Ошибка записи в localStorage для ключа "${key}":`, error);
    }
  };

  // Функция для удаления значения
  const removeValue = () => {
    try {
      setStoredValue(undefined);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка удаления из localStorage для ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Хук для работы с session storage
 * @param {string} key - ключ для хранения
 * @param {any} initialValue - начальное значение
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения sessionStorage для ключа "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Ошибка записи в sessionStorage для ключа "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(undefined);
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка удаления из sessionStorage для ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;