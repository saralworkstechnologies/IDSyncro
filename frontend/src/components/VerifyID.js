import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { API_BASE_URL } from '../config';
import '../styles/verify-id.css';

const VerifyID = () => {
  const { uuid } = useParams();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputUuid, setInputUuid] = useState(uuid || '');
  const [activeTab, setActiveTab] = useState('id');
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    if (uuid) {
      // Auto-detect verification type based on UUID format if no type specified
      if (!type) {
        const detectedType = detectVerificationType(uuid);
        setActiveTab(detectedType);
        setTimeout(() => verifyID(uuid), 100);
      } else {
        // Use specified type from QR code
        if (type === 'certificate') {
          setActiveTab('certificate');
          setTimeout(() => verifyID(uuid), 100);
        } else if (type === 'offer') {
          setActiveTab('offer');
          setTimeout(() => verifyID(uuid), 100);
        } else {
          setActiveTab('id');
          verifyID(uuid);
        }
      }
    } else if (type) {
      // Set tab based on type parameter even without UUID
      if (type === 'certificate') {
        setActiveTab('certificate');
      } else if (type === 'offer') {
        setActiveTab('offer');
      } else {
        setActiveTab('id');
      }
    }
  }, [uuid]);

  // Auto-detect verification type based on input format
  const detectVerificationType = (input) => {
    if (!input) return 'id';
    
    // Offer Letter format: OL-YYYY-XXXXXX
    if (/^OL-\d{4}-\d{6}$/.test(input)) {
      return 'offer';
    }
    
    // Employee ID formats: SWT-YY-EMP-XXXX or SWT-YY-INT-XXXX
    if (/^SWT-\d{2}-(EMP|INT)-\d{4}$/.test(input)) {
      return 'id';
    }
    
    // Certificate code format (if it has specific pattern)
    if (/^CERT-/.test(input) || /^[A-Z]{2,4}-\d{4}-[A-Z0-9]+$/.test(input)) {
      return 'certificate';
    }
    
    // Default to ID for UUID format or unknown patterns
    return 'id';
  };

  // Initialize QR Scanner
  const initializeScanner = async () => {
    try {
      setScannerError(null);
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScannerError('Camera not supported on this device');
        return;
      }
      
      // Request camera permission explicitly
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (permissionError) {
        if (permissionError.name === 'NotAllowedError') {
          setScannerError('Camera permission denied. Please allow camera access and try again.');
        } else if (permissionError.name === 'NotFoundError') {
          setScannerError('No camera found on this device.');
        } else {
          setScannerError('Camera access failed. Please check your camera settings.');
        }
        return;
      }
      
      if (videoRef.current && !qrScannerRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleScanResult(result.data),
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment'
          }
        );
        await qrScannerRef.current.start();
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      if (err.name === 'NotAllowedError') {
        setScannerError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setScannerError('No camera found. Please connect a camera and try again.');
      } else {
        setScannerError('Failed to start camera. Please check permissions and try again.');
      }
    }
  };

  // Handle QR scan result
  const handleScanResult = (data) => {
    try {
      // Extract UUID from URL if it's a full URL
      let extractedCode = data;
      if (data.includes('/verify/')) {
        const urlParts = data.split('/verify/');
        if (urlParts.length > 1) {
          const params = urlParts[1].split('?')[0];
          extractedCode = params;
        }
      }
      
      // Auto-detect type and verify
      const detectedType = detectVerificationType(extractedCode);
      setActiveTab(detectedType);
      setInputUuid(extractedCode);
      stopScanner();
      
      // Verify after a short delay to allow tab switch
      setTimeout(() => {
        verifyID(extractedCode);
      }, 100);
    } catch (err) {
      setScannerError('Invalid QR code format');
    }
  };

  // Stop scanner
  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setShowScanner(false);
    setScannerError(null);
  };

  // Toggle scanner
  const toggleScanner = async () => {
    if (showScanner) {
      stopScanner();
    } else {
      setShowScanner(true);
      // Wait for video element to be rendered
      setTimeout(initializeScanner, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const verifyID = async (verifyUuid) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (activeTab === 'id') {
        response = await axios.get(`${API_BASE_URL}/api/verify/${verifyUuid}`);
        setVerificationData({ ...response.data, verificationType: 'id' });
      } else if (activeTab === 'certificate') {
        response = await axios.get(`${API_BASE_URL}/api/certificates/verify/${verifyUuid}`);
        setVerificationData({ ...response.data, verificationType: 'certificate' });
      } else if (activeTab === 'offer') {
        response = await axios.get(`${API_BASE_URL}/api/offer-letters/verify/${verifyUuid}`);
        setVerificationData({ ...response.data, verificationType: 'offer' });
      }
    } catch (error) {
      const typeLabel = activeTab === 'id' ? 'Employee ID' : activeTab === 'certificate' ? 'Certificate Code' : 'Offer Letter Number';
      setError(`The ${typeLabel} was not found or is invalid. Please check and try again.`);
      setVerificationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (inputUuid.trim()) {
      // Auto-detect and switch tab based on input format
      const detectedType = detectVerificationType(inputUuid.trim());
      if (detectedType !== activeTab) {
        setActiveTab(detectedType);
        // Wait for tab switch then verify
        setTimeout(() => verifyID(inputUuid.trim()), 100);
      } else {
        verifyID(inputUuid.trim());
      }
    } else {
      const typeLabel = activeTab === 'id' ? 'Employee ID' : activeTab === 'certificate' ? 'Certificate Code' : 'Offer Letter Number';
      setError(`Please enter a valid ${typeLabel}`);
    }
  };

  const resetVerification = () => {
    setVerificationData(null);
    setError(null);
    setInputUuid('');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: 'Active', color: '#10B981', bg: '#D1FAE5' },
      inactive: { text: 'Inactive', color: '#6B7280', bg: '#F3F4F6' },
      revoked: { text: 'Revoked', color: '#EF4444', bg: '#FEE2E2' },
      expired: { text: 'Expired', color: '#F59E0B', bg: '#FEF3C7' },
      pending: { text: 'Pending', color: '#6366F1', bg: '#E0E7FF' }
    };
    
    const statusLower = (status || 'active').toLowerCase();
    const statusConfig = statusMap[statusLower] || statusMap.active;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: statusConfig.bg,
        color: statusConfig.color
      }}>
        ● {statusConfig.text}
      </span>
    );
  };

  return (
    <div className="verify-container">
      {/* Header */}
      <header className="verify-header">
        <div className="verify-header-content">
          <div className="verify-logo-section">
            <div className="verify-logo">V</div>
            <div>
              <h1>Verification Portal</h1>
              <p>ISO 9001:2015 Compliant Verification System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="verify-main">
        {/* Page Title */}
        <div className="verify-page-title">
          <h2>Document Verification</h2>
          <p>
            Verify the authenticity and status of employee credentials and certificates using our ISO-compliant verification system.
          </p>
        </div>

        <div className="verify-grid">
          {/* Left Panel - Verification Form */}
          <div>
            <div className="verify-form-panel">
              <div>
                <h3 className="verify-form-title">Verification Type</h3>
                
                <div className="verify-tabs">
                  <button
                    onClick={() => { setActiveTab('id'); resetVerification(); }}
                    className={`verify-tab ${activeTab === 'id' ? 'active' : ''}`}
                  >
                    Employee ID
                  </button>
                  <button
                    onClick={() => { setActiveTab('certificate'); resetVerification(); }}
                    className={`verify-tab ${activeTab === 'certificate' ? 'active' : ''}`}
                  >
                    Certificate
                  </button>
                  <button
                    onClick={() => { setActiveTab('offer'); resetVerification(); }}
                    className={`verify-tab ${activeTab === 'offer' ? 'active' : ''}`}
                  >
                    Offer Letter
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerify} className="verify-form">
                <div className="verify-form-group">
                  <label className="verify-form-label">
                    {activeTab === 'id' ? 'Employee ID / UUID' : activeTab === 'certificate' ? 'Certificate Code / UUID' : 'Offer Letter Number'}
                  </label>
                  <div className="verify-input-container">
                    <input
                      type="text"
                      value={inputUuid}
                      onChange={(e) => setInputUuid(e.target.value)}
                      placeholder={activeTab === 'id' ? "Enter employee ID or UUID" : activeTab === 'certificate' ? "Enter certificate code or UUID" : "Enter offer letter number (e.g., OL-2024-123456)"}
                      className="verify-input"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={toggleScanner}
                      className="scan-btn"
                      title="Scan QR Code"
                    >
                      📷
                    </button>
                  </div>
                </div>

                {/* QR Scanner Modal */}
                {showScanner && (
                  <div className="scanner-modal">
                    <div className="scanner-container">
                      <div className="scanner-header">
                        <h3>Scan QR Code</h3>
                        <button
                          type="button"
                          onClick={stopScanner}
                          className="scanner-close"
                        >
                          ×
                        </button>
                      </div>
                      <div className="scanner-content">
                        {scannerError ? (
                          <div className="scanner-error">
                            <div className="error-icon">📷</div>
                            <h4>Camera Access Required</h4>
                            <p>{scannerError}</p>
                            <div className="error-actions">
                              <button
                                type="button"
                                onClick={initializeScanner}
                                className="retry-btn"
                              >
                                Try Again
                              </button>
                              <button
                                type="button"
                                onClick={stopScanner}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="permission-help">
                              <small>
                                💡 If permission was denied, please:
                                <br />• Click the camera icon in your browser's address bar
                                <br />• Select "Allow" for camera access
                                <br />• Refresh the page and try again
                              </small>
                            </div>
                          </div>
                        ) : (
                          <>
                            <video
                              ref={videoRef}
                              className="scanner-video"
                              playsInline
                            />
                            <div className="scanner-overlay">
                              <div className="scan-frame"></div>
                              <p>Position QR code within the frame</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="verify-btn"
                >
                  {loading ? (
                    <>
                      <div className="verify-loading-spinner" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Document'
                  )}
                </button>

                <div className="verify-tips">
                  <div className="verify-tips-header">
                    <span className="verify-tips-icon">💡</span>
                    <span className="verify-tips-title">Quick Tips</span>
                  </div>
                  <p className="verify-tips-text">
                    {activeTab === 'id' 
                      ? 'Enter the full Employee ID or UUID found on the identification document.'
                      : activeTab === 'certificate'
                      ? 'Enter the Certificate Code or UUID exactly as shown on the certificate.'
                      : 'Enter the Offer Letter Number exactly as shown (format: OL-YYYY-XXXXXX).'}
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div>
            {error && (
              <div className="verify-error">
                <div className="verify-error-content">
                  <div className="verify-error-icon">
                    <span>!</span>
                  </div>
                  <div>
                    <h3 className="verify-error-title">Verification Failed</h3>
                    <p className="verify-error-text">{error}</p>
                    <div className="verify-error-actions">
                      <button
                        onClick={resetVerification}
                        className="verify-error-btn primary"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setError(null)}
                        className="verify-error-btn secondary"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationData && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                {/* Verification Header */}
                <div style={{
                  backgroundColor: verificationData.verificationType === 'id' ? '#4F46E5' : verificationData.verificationType === 'certificate' ? '#059669' : '#F59E0B',
                  color: 'white',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          {verificationData.verificationType === 'id' ? '👔' : verificationData.verificationType === 'certificate' ? '📜' : '📄'}
                        </div>
                        <div>
                          <h2 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '700',
                            margin: 0
                          }}>
                            {verificationData.verificationType === 'offer' 
                              ? (verificationData.candidate_name || verificationData.name || 'Offer Letter')
                              : verificationData.name}
                          </h2>
                          <p style={{ 
                            fontSize: '0.875rem',
                            opacity: '0.9',
                            margin: '0.25rem 0 0 0'
                          }}>
                            {verificationData.verificationType === 'id' 
                              ? verificationData.employee_id
                              : verificationData.verificationType === 'certificate'
                              ? verificationData.certificate_code
                              : verificationData.offer_letter_number}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        ✅ Verified
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        opacity: '0.9',
                        marginTop: '0.5rem'
                      }}>
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Details */}
                <div style={{ padding: '2rem' }}>
                  {/* Status Bar */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    marginBottom: '1.5rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>
                        VERIFICATION STATUS
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                        {getStatusBadge(verificationData.status)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>
                        VERIFIED BY
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                        SaralWorks System
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    {verificationData.verificationType === 'offer' ? (
                      <>
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            CANDIDATE NAME
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.candidate_name || verificationData.name || 'N/A'}
                          </div>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            DESIGNATION
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.designation || 'N/A'}
                          </div>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            VALIDITY PERIOD
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.validity_period || 'N/A'}
                          </div>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            ISSUE YEAR
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.issue_year || 'N/A'}
                          </div>
                        </div>
                      </>
                    ) : verificationData.verificationType === 'id' ? (
                      <>
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            EMPLOYEE TYPE
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.type === 'employee' ? 'Full-time Employee' : 'Intern'}
                          </div>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            DEPARTMENT
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.department}
                          </div>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            DESIGNATION
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.designation}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            CERTIFICATE TYPE
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.certificate_type}
                          </div>
                        </div>
                        
                        {verificationData.domain && (
                          <div style={{ 
                            backgroundColor: '#F9FAFB', 
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB'
                          }}>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                              DOMAIN
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                              {verificationData.domain}
                            </div>
                          </div>
                        )}
                        
                        {verificationData.technology && (
                          <div style={{ 
                            backgroundColor: '#F9FAFB', 
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB'
                          }}>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                              TECHNOLOGY
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                              {verificationData.technology}
                            </div>
                          </div>
                        )}
                        
                        <div style={{ 
                          backgroundColor: '#F9FAFB', 
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500', marginBottom: '0.25rem' }}>
                            ISSUE YEAR
                          </div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                            {verificationData.issue_year || 'N/A'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #E5E7EB'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Verification ID: {verificationData.verificationType === 'id' 
                        ? verificationData.employee_id 
                        : verificationData.verificationType === 'certificate'
                        ? verificationData.certificate_code
                        : verificationData.offer_letter_number}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={resetVerification}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'transparent',
                          color: '#4F46E5',
                          border: '1px solid #4F46E5',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#4F46E5'; e.target.style.color = 'white'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#4F46E5'; }}
                      >
                        Verify Another
                      </button>
                      <button
                        onClick={() => window.print()}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#4F46E5',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Print Verification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!verificationData && !error && (
              <div className="verify-empty-state">
                <div className="verify-empty-icon">
                  <span>
                    {activeTab === 'id' ? '👔' : activeTab === 'certificate' ? '📜' : '📄'}
                  </span>
                </div>
                <h3 className="verify-empty-title">
                  Ready for Verification
                </h3>
                <p className="verify-empty-text">
                  Enter a {activeTab === 'id' ? 'Employee ID' : activeTab === 'certificate' ? 'Certificate Code' : 'Offer Letter Number'} in the form to begin verification. 
                  Results will appear here.
                </p>
                <div className="verify-empty-badge">
                  <span className="verify-empty-badge-icon">🔒</span>
                  <span className="verify-empty-badge-text">
                    All verifications are encrypted and secure
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1F2937',
        color: 'white',
        padding: '3rem 2rem 2rem',
        marginTop: '4rem',
        borderTop: '4px solid #4F46E5'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Main Footer Content */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* About Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#4F46E5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>V</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>SaralWorks</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#D1D5DB', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                Secure and reliable verification system for employee credentials and certificates. 
                Trusted by organizations worldwide for authentic document verification.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: '#10B981',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>✓ ISO Certified</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: '#3B82F6',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>🔒 Secure</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
                Quick Links
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Home
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="/verify" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Verify Document
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → How It Works
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
                Legal & Compliance
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Privacy Policy
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Terms of Service
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Data Protection
                  </a>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <a href="#" style={{ 
                    fontSize: '0.875rem', 
                    color: '#D1D5DB', 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4F46E5'}
                  onMouseOut={(e) => e.target.style.color = '#D1D5DB'}>
                    → Compliance Standards
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
                Support
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>📧</span>
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>support@saralworkstechnologies.info</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>📞</span>
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>+91 (555) 123-4567</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🕐</span>
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>Mon-Fri: 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#374151',
                borderRadius: '8px',
                border: '1px solid #4B5563'
              }}>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                  REPORT FRAUD
                </p>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0 }}>
                  fraud@saralworkstechnologies.info
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#374151',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔒</div>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, fontWeight: '600' }}>SSL Encrypted</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✓</div>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, fontWeight: '600' }}>ISO 9001:2015</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🛡️</div>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, fontWeight: '600' }}>GDPR Compliant</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚡</div>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, fontWeight: '600' }}>99.9% Uptime</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🌐</div>
                <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, fontWeight: '600' }}>Global Access</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ 
            borderTop: '1px solid #4B5563', 
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
              © {new Date().getFullYear()} SaralWorks Technologies. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Powered by SaralWorks Technologies</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="#" style={{ 
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#4B5563',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>🔗</a>
                <a href="#" style={{ 
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#4B5563',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}>📧</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          /* QR Scanner Styles */
          .verify-input-container {
            position: relative;
            display: flex;
            align-items: center;
          }
          
          .verify-input {
            flex: 1;
            padding-right: 50px;
          }
          
          .scan-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #4F46E5;
            border: none;
            border-radius: 6px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          
          .scan-btn:hover {
            background: #3730A3;
          }
          
          .scanner-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }
          
          .scanner-container {
            background: white;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            max-height: 90vh;
            overflow: hidden;
          }
          
          .scanner-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #E5E7EB;
            background: #F9FAFB;
          }
          
          .scanner-header h3 {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
          }
          
          .scanner-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6B7280;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
          }
          
          .scanner-close:hover {
            background: #E5E7EB;
            color: #111827;
          }
          
          .scanner-content {
            position: relative;
            aspect-ratio: 1;
            background: #000;
          }
          
          .scanner-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .scanner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          
          .scan-frame {
            width: 200px;
            height: 200px;
            border: 2px solid #4F46E5;
            border-radius: 12px;
            position: relative;
            margin-bottom: 1rem;
          }
          
          .scan-frame::before,
          .scan-frame::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border: 3px solid #4F46E5;
          }
          
          .scan-frame::before {
            top: -3px;
            left: -3px;
            border-right: none;
            border-bottom: none;
          }
          
          .scan-frame::after {
            bottom: -3px;
            right: -3px;
            border-left: none;
            border-top: none;
          }
          
          .scanner-overlay p {
            color: white;
            font-size: 0.875rem;
            text-align: center;
            background: rgba(0, 0, 0, 0.7);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            margin: 0;
          }
          
          .scanner-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            padding: 2rem;
            text-align: center;
          }
          
          .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .scanner-error h4 {
            color: #111827;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
            font-weight: 600;
          }
          
          .scanner-error p {
            color: #DC2626;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            line-height: 1.4;
          }
          
          .error-actions {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
          
          .retry-btn {
            background: #4F46E5;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .retry-btn:hover {
            background: #3730A3;
          }
          
          .cancel-btn {
            background: #6B7280;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .cancel-btn:hover {
            background: #4B5563;
          }
          
          .permission-help {
            background: #F3F4F6;
            border: 1px solid #D1D5DB;
            border-radius: 6px;
            padding: 0.75rem;
            max-width: 280px;
          }
          
          .permission-help small {
            color: #4B5563;
            font-size: 0.75rem;
            line-height: 1.4;
          }
        `}
      </style>
    </div>
  );
};

export default VerifyID;