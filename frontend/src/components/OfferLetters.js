import React, { useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateOfferLetter from './CreateOfferLetter';
import BulkOfferLetter from './BulkOfferLetter';
import ManageOfferLetters from './ManageOfferLetters';
import { buildVerifyPortalUrl } from '../config';

const OfferLetters = () => {
  const location = useLocation();
  const tabsRef = useRef(null);
  
  const isActive = (path) => {
    if (path === '/offer-letters/create' && (location.pathname === '/offer-letters' || location.pathname === '/offer-letters/')) {
      return 'active-tab';
    }
    return location.pathname === path ? 'active-tab' : '';
  };
  
  useEffect(() => {
    const updateActiveTab = () => {
      const tabsContainer = tabsRef.current;
      if (!tabsContainer) return;
      
      const activeTab = tabsContainer.querySelector('.active-tab');
      const allTabs = Array.from(tabsContainer.querySelectorAll('a'));
      
      if (!activeTab || allTabs.length === 0) return;
      
      const activeIndex = allTabs.indexOf(activeTab);
      
      if (activeIndex !== -1) {
        const tabWidth = 100 / allTabs.length;
        const leftPosition = activeIndex * tabWidth;
        
        tabsContainer.style.setProperty('--active-width', `${tabWidth}%`);
        tabsContainer.style.setProperty('--active-left', `${leftPosition}%`);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateActiveTab, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <div className="certificates-container">
      <div className="certificates-header">
        <h1>📄 Offer Letter Management</h1>
        <p>Generate, manage, and verify offer letters</p>
      </div>
      
      <div className="certificates-tabs-wrapper">
        <div className="certificates-tabs" ref={tabsRef}>
          <Link 
            to="/offer-letters/create" 
            className={isActive('/offer-letters/create')}
          >
            ➕ Create Single
          </Link>
          <Link 
            to="/offer-letters/bulk" 
            className={isActive('/offer-letters/bulk')}
          >
            📤 Bulk Generation
          </Link>
          <Link 
            to="/offer-letters/manage" 
            className={isActive('/offer-letters/manage')}
          >
            📋 Manage
          </Link>
        </div>
      </div>
      
      <Routes>
        <Route path="create" element={<CreateOfferLetter />} />
        <Route path="bulk" element={<BulkOfferLetter />} />
        <Route path="manage" element={<ManageOfferLetters />} />
        <Route index element={<CreateOfferLetter />} />
      </Routes>
    </div>
  );
};

export default OfferLetters;
