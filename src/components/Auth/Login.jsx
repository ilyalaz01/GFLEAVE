// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(password);
    
    if (result.success) {
      // Успешный вход обрабатывается в AuthContext
      setError('');
    } else {
      setError(result.error);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card ${isShaking ? 'shake' : ''}`}>
        <div className="heart-icon">
          <Heart size={60} />
        </div>
        <h1 className="login-title">Введите пароль любви ❤️</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль..."
            className="password-input"
            autoComplete="off"
          />
          <button type="submit" className="login-button">
            Войти 💕
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;