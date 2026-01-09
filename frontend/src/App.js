import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import CreateEmployee from './components/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import EditEmployee from './components/EditEmployee';
import VerifyID from './components/VerifyID';
import BulkUpload from './components/BulkUpload';
import Certificates from './components/Certificates';
import OfferLetters from './components/OfferLetters';
import MobileBottomNav from './components/MobileBottomNav';
import MobileHeader from './components/MobileHeader';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { buildVerifyPortalUrl } from './config';
import './App.css';
import './styles/id-card-viewer-new.css';

function Navigation({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const verifyPortalUrl = buildVerifyPortalUrl('/verify');
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    closeMobileMenu();
  };

  // Calculate active tab position for animation
  const getActiveTabStyle = () => {
    const paths = ['/', '/employees', '/certificates', '/offer-letters', '/verify'];
    const activeIndex = paths.findIndex(path => 
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    );
    
    if (activeIndex === -1) return { width: '0%', left: '0%' };
    
    const tabWidth = 100 / 6; // 6 items total (5 tabs + logout)
    return {
      width: `${tabWidth * 0.8}%`, // Make active background 80% of tab width
      left: `${activeIndex * tabWidth + (tabWidth * 0.1)}%` // Center it within the tab
    };
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
        <h2>SWID</h2>
      </Link>
      
      <div className="nav-controls">
        <ThemeToggle />
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{'--active-left': getActiveTabStyle().left, '--active-width': getActiveTabStyle().width}}>
        <Link to="/" className={isActive('/')} onClick={closeMobileMenu}>Dashboard</Link>
        <Link to="/employees" className={isActive('/employees')} onClick={closeMobileMenu}>Manage IDs</Link>
        <Link to="/certificates" className={isActive('/certificates')} onClick={closeMobileMenu}>Certificates</Link>
        <Link to="/offer-letters" className={isActive('/offer-letters')} onClick={closeMobileMenu}>Offer Letters</Link>
        <Link to="/verify" className={isActive('/verify')} onClick={closeMobileMenu}>
          Verify ID
        </Link>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
function VerifyPortalRedirect() {
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return; // Stay on localhost, don't redirect
    }
    
    const targetPath = location.pathname.startsWith('/verify') ? location.pathname : '/verify';
    const targetUrl = buildVerifyPortalUrl(`${targetPath}${location.search || ''}${location.hash || ''}`);
    if (typeof window !== 'undefined' && window.location.href !== targetUrl) {
      window.location.replace(targetUrl);
    }
  }, [location]);

  // On localhost, render VerifyID component instead of redirecting
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return <VerifyID />;
  }

  return (
    <div className="verify-redirect" style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to secure verification portal...
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const isVerifyHost = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.location.hostname.startsWith('verify.');
  }, []);

  return (
    <div className="App">
      {!isVerifyHost && isAuthenticated && <Navigation onLogout={logout} />}
      {!isVerifyHost && isAuthenticated && <MobileHeader />}
      {!isVerifyHost && isAuthenticated && <MobileBottomNav />}

      <main className="main-content">
        <Routes>
          {isVerifyHost ? (
            <>
              <Route path="/" element={<VerifyID />} />
              <Route path="/verify" element={<VerifyID />} />
              <Route path="/verify/:uuid?" element={<VerifyID />} />
              <Route path="*" element={<Navigate to="/verify" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/verify/*" element={<VerifyPortalRedirect />} />
              <Route path="/" element={<PrivateRoute><ProfessionalDashboard /></PrivateRoute>} />
              <Route path="/create" element={<PrivateRoute><CreateEmployee /></PrivateRoute>} />
              <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
              <Route path="/edit/:id" element={<PrivateRoute><EditEmployee /></PrivateRoute>} />
              <Route path="/certificates/*" element={<PrivateRoute><Certificates /></PrivateRoute>} />
              <Route path="/offer-letters/*" element={<PrivateRoute><OfferLetters /></PrivateRoute>} />
              <Route path="/bulk-upload" element={<PrivateRoute><BulkUpload /></PrivateRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;