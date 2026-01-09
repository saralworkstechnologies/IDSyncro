import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResponsiveContainer from './layout/ResponsiveContainer';

const CreateCertificate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    person_uuid: '',
    name: '',
    certificate_type: 'Internship',
    domain: '',
    technology: '',
    mentor: '',
    issue_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/certificates/create-single', {
        certificateData: formData
      });
      
      setResult(response.data);
      setTimeout(() => navigate('/certificates/manage'), 2000);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create certificate');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <ResponsiveContainer>
        <div className="success-card">
          <div className="success-header">
            <div className="success-icon">✅</div>
            <h3>Certificate Created Successfully!</h3>
          </div>
          <div className="success-content">
            <div className="success-details">
              <h4>Certificate Details</h4>
              <p><strong>Certificate ID:</strong> {result.certificateCode}</p>
            </div>
          </div>
          <p className="success-text">Redirecting to manage page...</p>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <div className="create-employee-header">
        <h1>📜 Create Single Certificate</h1>
        <p>Manually create a certificate for an individual</p>
      </div>
      
      <div className="create-employee-form">
        <form onSubmit={handleSubmit} className="professional-form">
          <div className="form-section">
            <div className="section-header">
              <h3>📋 Certificate Information</h3>
              <div className="section-line"></div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Person UUID *</label>
                <input
                  type="text"
                  name="person_uuid"
                  value={formData.person_uuid}
                  onChange={handleChange}
                  required
                  placeholder="Enter person UUID from ID system"
                />
              </div>
              
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                />
              </div>
              
              <div className="form-group">
                <label>Certificate Type *</label>
                <select
                  name="certificate_type"
                  value={formData.certificate_type}
                  onChange={handleChange}
                >
                  <option value="Internship">Internship</option>
                  <option value="Employment">Employment</option>
                  <option value="Training">Training</option>
                  <option value="Achievement">Achievement</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="e.g., Web Development"
                />
              </div>
              
              <div className="form-group">
                <label>Technology</label>
                <input
                  type="text"
                  name="technology"
                  value={formData.technology}
                  onChange={handleChange}
                  placeholder="e.g., MERN Stack"
                />
              </div>
              
              <div className="form-group">
                <label>Mentor</label>
                <input
                  type="text"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  placeholder="Mentor name"
                />
              </div>
              
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary submit-btn"
            >
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Creating...
                </>
              ) : (
                'Create Certificate'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/certificates')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ResponsiveContainer>
  );
};

export default CreateCertificate;
