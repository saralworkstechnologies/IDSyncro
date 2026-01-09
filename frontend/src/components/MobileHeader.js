import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const MobileHeader = () => {
  const { logout } = useAuth();

  return (
    <div className="mobile-header">
      <Link to="/" className="mobile-brand">
        🏢 SWID
      </Link>
      
      <div className="mobile-controls">
        <ThemeToggle />
        <button type="button" className="mobile-logout-btn" onClick={logout}>
          🚪
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;