// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Image, 
  Film, 
  MapPin, 
  Heart, 
  Camera,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Главная', gradient: 'from-pink-500 to-rose-400' },
    { to: '/gallery', icon: Image, label: 'Галерея', gradient: 'from-purple-500 to-pink-500' },
    { to: '/movies', icon: Film, label: 'Фильмы', gradient: 'from-blue-500 to-purple-500' },
    { to: '/plans', icon: MapPin, label: 'Планы', gradient: 'from-green-500 to-blue-500' },
    { to: '/about-us', icon: Heart, label: 'Мы о нас', gradient: 'from-red-500 to-pink-500' },
    { to: '/upload', icon: Camera, label: 'Загрузить фото', gradient: 'from-orange-500 to-red-500' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Мобильная кнопка меню */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        aria-label="Открыть меню"
      >
        <Menu size={24} />
      </button>

      {/* Overlay для мобильного меню */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${isMobileMenuOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Мобильная кнопка закрытия */}
        <button 
          className="mobile-menu-close"
          onClick={closeMobileMenu}
          aria-label="Закрыть меню"
        >
          <X size={24} />
        </button>

        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={32} />
          </div>
          <h1>Наш Уголок</h1>
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <span className="user-name">{currentUser}</span>
          </div>
        </div>
        
        <ul className="nav-menu">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  <div className={`nav-icon bg-gradient-to-r ${item.gradient}`}>
                    <IconComponent size={20} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        
        <button className="logout-btn" onClick={() => { logout(); closeMobileMenu(); }}>
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;