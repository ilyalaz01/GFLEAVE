// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Пароли пользователей - ЗАМЕНИТЕ НА СВОИ!
const passwords = {
  '1337': 'Илья',
  '0608': 'Аделя'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedAuth = sessionStorage.getItem('loveAuth');
    const savedUser = sessionStorage.getItem('currentUser');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
    
    setLoading(false);
  }, []);

  const login = (password) => {
    if (passwords[password]) {
      const userName = passwords[password];
      setIsAuthenticated(true);
      setCurrentUser(userName);
      
      // Сохраняем сессию
      sessionStorage.setItem('loveAuth', 'true');
      sessionStorage.setItem('currentUser', userName);
      
      return { success: true, user: userName };
    } else {
      return { success: false, error: 'Неверный пароль 😢' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    sessionStorage.removeItem('loveAuth');
    sessionStorage.removeItem('currentUser');
  };

  const value = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};