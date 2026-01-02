import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useToast } from './Toast';

const ManageOfferLetters = () => {
  const toast = useToast();
  const [offerLetters, setOfferLetters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    fetchOfferLetters();
    fetchBatches();
  }, []);

  const fetchOfferLetters = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/offer-letters');
      setOfferLetters(response.data);
    } catch (error) {
      toast.error('Failed to fetch offer letters');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/offer-letters/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleView = (offer) => {
    setViewModal(offer);
  };

  const handleEdit = (offer) => {
    setEditModal({
      ...offer,
      offer_data: typeof offer.offer_data === 'string' ? JSON.parse(offer.offer_data) : offer.offer_data
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/offer-letters/${editModal.id}`, {
        offerData: editModal.offer_data,
        status: editModal.status
      });
      toast.success('Offer letter updated successfully');
      setEditModal(null);
      fetchOfferLetters();
    } catch (error) {
      toast.error('Failed to update offer letter');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer letter?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/offer-letters/${id}`);
      toast.success('Offer letter deleted successfully');
      fetchOfferLetters();
    } catch (error) {
      toast.error('Failed to delete offer letter');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/offer-letters/export');
      const data = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Offer Letters');

      if (data.length > 0) {
        worksheet.columns = Object.keys(data[0]).map(key => ({
          header: key,
          key,
          width: Math.min(Math.max(key.length + 5, 15), 50)
        }));
        data.forEach(row => worksheet.addRow(row));
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Offer_Letters_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Export successful!');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offerLetters
    .filter(offer => filter === 'all' || offer.batch_id === filter)
    .filter(offer => {
      if (!searchTerm) return true;
      const data = offer.offer_data;
      const candidateName = data.candidate_name || data['Candidate Name'] || '';
      const company = data.company_name || data.Company || '';
      const designation = data.designation || data.Designation || '';
      return (
        offer.offer_letter_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <div className="manage-certificates-container">
      <div className="manage-header">
        <h2>📋 Manage Offer Letters</h2>
        <button onClick={exportToExcel} className="btn-success" disabled={loading}>
          📊 Export to Excel
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name, company, number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label>Filter by Batch:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Offer Letters</option>
            {batches.map((batch, idx) => (
              <option key={idx} value={batch.batch_id}>
                {batch.batch_id} ({batch.offer_count} offers)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-box">
              <h3>{offerLetters.length}</h3>
              <p>Total Offer Letters</p>
            </div>
            <div className="stat-box">
              <h3>{batches.length}</h3>
              <p>Total Batches</p>
            </div>
            <div className="stat-box">
              <h3>{filteredOffers.length}</h3>
              <p>Filtered Results</p>
            </div>
          </div>

          <div className="certificates-table-wrapper">
            <table className="certificates-table">
              <thead>
                <tr>
                  <th>Offer Letter Number</th>
                  <th>Candidate Name</th>
                  <th>Company</th>
                  <th>Designation</th>
                  <th>Batch ID</th>
                  <th>Generated Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, idx) => (
                  <tr key={idx}>
                    <td><strong>{offer.offer_letter_number}</strong></td>
                    <td>{offer.offer_data.candidate_name || offer.offer_data['Candidate Name'] || 'N/A'}</td>
                    <td>{offer.offer_data.company_name || offer.offer_data.Company || 'N/A'}</td>
                    <td>{offer.offer_data.designation || offer.offer_data.Designation || 'N/A'}</td>
                    <td>{offer.batch_id || 'Single'}</td>
                    <td>{new Date(offer.generated_timestamp).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${offer.status}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-inline">
                        <button onClick={() => handleView(offer)} className="btn-action btn-view" title="View">
                          👁️
                        </button>
                        <button onClick={() => handleEdit(offer)} className="btn-action btn-edit" title="Edit">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(offer.id)} className="btn-action btn-delete" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOffers.length === 0 && (
            <div className="no-data">
              <p>No offer letters found</p>
            </div>
          )}
        </>
      )}

      {viewModal && (
        <div className="modal-overlay" onClick={() => setViewModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Offer Letter Details</h2>
              <button onClick={() => setViewModal(null)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Offer Letter Number:</strong>
                <span>{viewModal.offer_letter_number}</span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={`status-badge ${viewModal.status}`}>{viewModal.status}</span>
              </div>
              <div className="detail-row">
                <strong>Generated Date:</strong>
                <span>{new Date(viewModal.generated_timestamp).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <strong>Batch ID:</strong>
                <span>{viewModal.batch_id || 'Single'}</span>
              </div>
              <hr />
              <h3>Offer Data:</h3>
              {Object.entries(viewModal.offer_data).map(([key, value]) => (
                <div key={key} className="detail-row">
                  <strong>{key}:</strong>
                  <span>{value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Offer Letter</h2>
              <button onClick={() => setEditModal(null)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editModal.status}
                  onChange={(e) => setEditModal({...editModal, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="revoked">Revoked</option>
                  <option value="expired">Expired</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
              {Object.entries(editModal.offer_data).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => setEditModal({
                      ...editModal,
                      offer_data: {...editModal.offer_data, [key]: e.target.value}
                    })}
                  />
                </div>
              ))}
              <div className="modal-actions">
                <button onClick={handleUpdate} className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : '💾 Update'}
                </button>
                <button onClick={() => setEditModal(null)} className="btn-secondary">
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {batches.length > 0 && (
        <div className="batches-section">
          <h3>📦 Batch Information</h3>
          <div className="batches-grid">
            {batches.map((batch, idx) => (
              <div key={idx} className="batch-card">
                <h4>{batch.batch_id}</h4>
                <p><strong>File:</strong> {batch.excel_filename || 'N/A'}</p>
                <p><strong>Count:</strong> {batch.offer_count}</p>
                <p><strong>Generated:</strong> {new Date(batch.generated_timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOfferLetters;
