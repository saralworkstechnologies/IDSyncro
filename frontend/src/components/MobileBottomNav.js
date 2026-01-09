import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navRef = useRef(null);
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };
  
  useEffect(() => {
    const updateActiveTab = () => {
      const navContainer = navRef.current;
      if (!navContainer) return;
      
      const activeTab = navContainer.querySelector('.active');
      const allTabs = Array.from(navContainer.querySelectorAll('a'));
      
      if (!activeTab || allTabs.length === 0) return;
      
      const activeIndex = allTabs.indexOf(activeTab);
      
      if (activeIndex !== -1) {
        const tabWidth = 100 / allTabs.length;
        const leftPosition = activeIndex * tabWidth;
        
        navContainer.style.setProperty('--active-width', `${tabWidth}%`);
        navContainer.style.setProperty('--active-left', `${leftPosition}%`);
      }
    };
    
    const timer = setTimeout(updateActiveTab, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <div className="mobile-bottom-nav" ref={navRef}>
      <Link to="/" className={isActive('/')}>
        🏠 Home
      </Link>
      <Link to="/employees" className={isActive('/employees')}>
        👥 IDs
      </Link>
      <Link to="/certificates" className={isActive('/certificates')}>
        📜 Certs
      </Link>
      <Link to="/offer-letters" className={isActive('/offer-letters')}>
        📄 Offers
      </Link>
      <Link to="/verify" className={isActive('/verify')}>
        ✅ Verify
      </Link>
    </div>
  );
};

export default MobileBottomNav;