import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UPLOADS_BASE_URL } from '../config';

const IDCardViewer = ({ employee, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(employee);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee?.id) {
      fetchLatestData();
    }
  }, [employee?.id]);

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/employees/${employee.id}`);
      setCurrentEmployee(response.data);
    } catch (error) {
      console.error('Error fetching latest employee data:', error);
      setCurrentEmployee(employee);
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return null;
  const displayEmployee = currentEmployee || employee;

  const formatDate = (value, options) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toLocaleDateString('en-IN', options || {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const numeric = Number(String(value).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(numeric)) {
      return value;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numeric);
  };

  const issuedDate = displayEmployee.created_at ? new Date(displayEmployee.created_at) : null;
  const expiryDate = issuedDate ? new Date(issuedDate) : null;
  if (expiryDate) {
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  }

  const issuedOn = formatDate(issuedDate);
  const validUntil = formatDate(expiryDate);
  const joiningDate = formatDate(displayEmployee.joining_date);
  const dob = formatDate(displayEmployee.date_of_birth);
  const emergencyPhone = displayEmployee.emergency_phone;
  const emergencyContact = displayEmployee.emergency_contact;
  const salaryValue = formatCurrency(displayEmployee.salary);
  const normalizedStatus = (displayEmployee.status || 'active').toLowerCase();
  const statusLabel = (displayEmployee.status || 'active').toUpperCase();
  const uuidDisplay = displayEmployee.uuid ? `${displayEmployee.uuid.slice(0, 8)}...${displayEmployee.uuid.slice(-6)}` : null;

  const infoSections = [
    {
      title: 'Contact Details',
      icon: '📞',
      items: [
        displayEmployee.phone && { label: 'Mobile', value: displayEmployee.phone },
        displayEmployee.email && { label: 'Email', value: displayEmployee.email }
      ]
    },
    {
      title: 'Employment',
      icon: '💼',
      items: [
        displayEmployee.department && { label: 'Department', value: displayEmployee.department },
        displayEmployee.designation && { label: 'Role', value: displayEmployee.designation },
        displayEmployee.type && { label: 'Type', value: displayEmployee.type.toUpperCase() },
        displayEmployee.manager && { label: 'Manager', value: displayEmployee.manager },
        joiningDate && { label: 'Joined On', value: joiningDate },
        { label: 'Status', value: statusLabel, badge: `status-${normalizedStatus}` }
      ]
    },
    {
      title: 'Personal',
      icon: '👤',
      items: [
        dob && { label: 'Date of Birth', value: dob },
        displayEmployee.blood_group && { label: 'Blood Group', value: displayEmployee.blood_group },
        displayEmployee.address && { label: 'Address', value: displayEmployee.address }
      ]
    },
    {
      title: 'Emergency',
      icon: '🚨',
      items: [
        emergencyContact && { label: 'Contact', value: emergencyContact },
        emergencyPhone && { label: 'Phone', value: emergencyPhone }
      ]
    },
    {
      title: 'Compliance IDs',
      icon: '🆔',
      items: [
        displayEmployee.aadhar_number && { label: 'Aadhar', value: displayEmployee.aadhar_number },
        displayEmployee.pan_number && { label: 'PAN', value: displayEmployee.pan_number },
        displayEmployee.bank_account && { label: 'Bank A/C', value: displayEmployee.bank_account },
        uuidDisplay && { label: 'Verification UUID', value: uuidDisplay }
      ]
    },
    {
      title: 'Compensation',
      icon: '💰',
      items: [
        salaryValue && { label: 'Salary', value: salaryValue }
      ]
    }
  ]
    .map(section => ({
      ...section,
      items: section.items.filter(Boolean)
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="card-viewer-overlay" onClick={onClose}>
      <div className="card-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-viewer-header">
          <h2>ID Card - {displayEmployee.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="card-display-area">
          <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
            <div className="card-front">
              <div className="card-header">
                <div className="company-title">SARAL WORKS</div>
                <div className="card-type">{displayEmployee.type.toUpperCase()} ID</div>
              </div>
              
              <div className="card-main">
                {displayEmployee.photo ? (
                  <img 
                    src={`${UPLOADS_BASE_URL}/${displayEmployee.photo}`}
                    alt={displayEmployee.name}
                    className="employee-photo"
                  />
                ) : (
                  <div className="photo-placeholder">📷</div>
                )}
                
                <div className="employee-details">
                  <div className="name">{displayEmployee.name}</div>
                  <div className="info">Dept: {displayEmployee.department}</div>
                  <div className="info">Role: {displayEmployee.designation}</div>
                  <div className="info">Status: <span className={`status-${displayEmployee.status || 'active'}`}>{(displayEmployee.status || 'active').toUpperCase()}</span></div>
                </div>
              </div>

              <div className="card-bottom">
                <div className="card-id">{displayEmployee.employee_id}</div>
                {displayEmployee.qr_code && (
                  <div className="qr-area">
                    <img src={displayEmployee.qr_code} alt="QR Code" className="qr-code" />
                    <div className="qr-text">SCAN TO VERIFY</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-back">
              <div className="card-header">
                <div className="company-title">SARAL WORKS</div>
                <div className="card-type">EMPLOYEE INFO</div>
              </div>
              
              <div className="back-content">
                {infoSections.length > 0 ? (
                  <div className="info-sections">
                    {infoSections.map(section => (
                      <div className="section-card" key={section.title}>
                        <div className="section-header">
                          <span className="section-icon">{section.icon}</span>
                          <span className="section-title">{section.title}</span>
                        </div>
                        <ul className="section-list">
                          {section.items.map(item => (
                            <li className="section-item" key={`${section.title}-${item.label}`}>
                              <span className="item-label">{item.label}</span>
                              <span className={`item-value ${item.badge || ''}`}>{item.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="info-empty">No additional information available.</div>
                )}
                
                <div className="card-footer">
                  {issuedOn && <div>Issued: {issuedOn}</div>}
                  {validUntil && <div>Valid Until: {validUntil}</div>}
                  <div>Authorized - SARAL WORKS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default IDCardViewer;