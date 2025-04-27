import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';

// Import icons (assuming FontAwesome is installed)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faBox, faCalendar, faMapMarkerAlt, faWeight, faRecycle, faStar, faTasks, faCogs, faStickyNote } from '@fortawesome/free-solid-svg-icons';

const InventoryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    batchId: '',
    collectionDate: '',
    sourceLocation: '',
    totalWeight: '',
    wasteType: '',
    qualityGrade: '',
    processingStatus: '',
    processingMethod: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [lowStockMessage, setLowStockMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate form completion progress
  useEffect(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '').length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.batchId.match(/^[a-zA-Z0-9]{3,}$/)) {
      newErrors.batchId = 'Batch ID must be alphanumeric and at least 3 characters';
    }

    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Collection Date is required';
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.collectionDate);
      if (selectedDate > today) {
        newErrors.collectionDate = 'Collection Date cannot be in the future';
      }
    }

    if (formData.sourceLocation.length < 2) {
      newErrors.sourceLocation = 'Source Location must be at least 2 characters';
    }

    if (!formData.totalWeight || formData.totalWeight <= 0) {
      newErrors.totalWeight = 'Total Weight must be a positive number';
    }

    if (!formData.wasteType) {
      newErrors.wasteType = 'Please select a Waste Type';
    }

    if (!formData.qualityGrade) {
      newErrors.qualityGrade = 'Please select a Quality Grade';
    }

    if (!formData.processingStatus) {
      newErrors.processingStatus = 'Please select a Processing Status';
    }

    if (!formData.processingMethod) {
      newErrors.processingMethod = 'Please select a Processing Method';
    }

    if (formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'batchId') {
      // Only allow letters and numbers
      newValue = value.replace(/[^a-zA-Z0-9]/g, '');
    } else if (name === 'totalWeight') {
      // Only allow numbers and a single decimal point
      newValue = value.replace(/[^0-9.]/g, '');
      // Remove multiple decimals
      newValue = newValue.replace(/(\..*)\./g, '$1');
    } else if (name === 'sourceLocation') {
      // Only allow letters
      newValue = value.replace(/[^a-zA-Z]/g, '');
    } else if (name === 'notes') {
      // Only allow up to 100 words
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length > 100) {
        newValue = words.slice(0, 100).join(' ');
      }
    }

    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLowStockMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add inventory');
      }

      const data = await response.json();
      setSuccess('Inventory added successfully!');

      if (data.lowStock) {
        setLowStockMessage('This item is low on stock. A notification email has been sent to the admin.');
      }

      setFormData({
        batchId: '',
        collectionDate: '',
        sourceLocation: '',
        totalWeight: '',
        wasteType: '',
        qualityGrade: '',
        processingStatus: '',
        processingMethod: '',
        notes: ''
      });
      setTimeout(() => navigate('/inventory'), 2000);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    .inventory-form-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    .inventory-form {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .inventory-form h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .form-group label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #004d40;
      font-weight: 500;
    }

    .form-group label svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #b0bec5;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s ease;
      background: #f5f5f5;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #26a69a;
      background: white;
      box-shadow: 0 0 8px rgba(38, 166, 154, 0.2);
      transform: scale(1.01);
    }

    .form-group textarea {
      height: 120px;
      resize: vertical;
    }

    .form-error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

    .submit-btn {
      background: #00796b;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .submit-btn:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
    }

    .submit-btn:disabled {
      background: #b0bec5;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      border: 3px solid #ffffff;
      border-top: 3px solid transparent;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    @keyframes spin {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(360deg); }
    }

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .success {
      color: #2e7d32;
      text-align: center;
      margin-bottom: 15px;
      background: #e8f5e9;
      padding: 10px;
      border-radius: 4px;
    }

    .low-stock-message {
      color: #721c24;
      background: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 15px;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #eceff1;
      border-radius: 3px;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #26a69a;
      transition: width 0.3s ease;
    }

    .tooltip {
      position: relative;
      display: inline-block;
      margin-left: 8px;
    }

    .tooltip .tooltip-text {
      visibility: hidden;
      width: 200px;
      background: #37474f;
      color: white;
      text-align: center;
      padding: 8px;
      border-radius: 4px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    @media (max-width: 768px) {
      .inventory-form {
        padding: 20px;
      }

      .inventory-form-container {
        margin-top: 120px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="inventory-form-container">
        <form className="inventory-form" onSubmit={handleSubmit}>
          <h1>Add New Inventory</h1>
          
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
          </div>

          {errors.submit && <div className="error">{errors.submit}</div>}
          {success && <div className="success">{success}</div>}
          {lowStockMessage && <div className="low-stock-message">{lowStockMessage}</div>}

          <div className="form-group">
            <label htmlFor="batchId">
              <FontAwesomeIcon icon={faBox} /> Batch ID
            </label>
            <input
              type="text"
              id="batchId"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            />
            {errors.batchId && <span className="form-error">{errors.batchId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="collectionDate">
              <FontAwesomeIcon icon={faCalendar} /> Collection Date
            </label>
            <input
              type="date"
              id="collectionDate"
              name="collectionDate"
              value={formData.collectionDate}
              onChange={handleChange}
              required
              min={todayStr}
            />
            {errors.collectionDate && <span className="form-error">{errors.collectionDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sourceLocation">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Source Location
            </label>
            <input
              type="text"
              id="sourceLocation"
              name="sourceLocation"
              value={formData.sourceLocation}
              onChange={handleChange}
              required
            />
            {errors.sourceLocation && <span className="form-error">{errors.sourceLocation}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalWeight">
              <FontAwesomeIcon icon={faWeight} /> Total Weight (kg)
            </label>
            <input
              type="number"
              id="totalWeight"
              name="totalWeight"
              value={formData.totalWeight}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            {errors.totalWeight && <span className="form-error">{errors.totalWeight}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="wasteType">
              <FontAwesomeIcon icon={faRecycle} /> Waste Type
            </label>
            <select
              id="wasteType"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleChange}
              required
            >
              <option value="">Select Waste Type</option>
              <option value="CoconutHusk">Coconut Husk</option>
              <option value="CoconutShell">Coconut Shell</option>
              <option value="CoconutFiber">Coconut Fiber</option>
              <option value="CoconutPith">Coconut Pith</option>
              <option value="CoconutLeaves">Coconut Leaves</option>
              <option value="CoconutTrunk">Coconut Trunk</option>
            </select>
            {errors.wasteType && <span className="form-error">{errors.wasteType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="qualityGrade">
              <FontAwesomeIcon icon={faStar} /> Quality Grade
            </label>
            <select
              id="qualityGrade"
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleChange}
              required
            >
              <option value="">Select Quality Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            {errors.qualityGrade && <span className="form-error">{errors.qualityGrade}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="processingStatus">
              <FontAwesomeIcon icon={faTasks} /> Processing Status
            </label>
            <select
              id="processingStatus"
              name="processingStatus"
              value={formData.processingStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Received">Received</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.processingStatus && <span className="form-error">{errors.processingStatus}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="processingMethod">
              <FontAwesomeIcon icon={faCogs} /> Processing Method
            </label>
            <select
              id="processingMethod"
              name="processingMethod"
              value={formData.processingMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Method</option>
              <option value="Recycling">Recycling</option>
              <option value="Composting">Composting</option>
              <option value="Incineration">Incineration</option>
            </select>
            {errors.processingMethod && <span className="form-error">{errors.processingMethod}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              <FontAwesomeIcon icon={faStickyNote} /> Notes
              <div className="tooltip">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="tooltip-text">Maximum 500 characters. Add any additional information about the inventory item.</span>
              </div>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
            {errors.notes && <span className="form-error">{errors.notes}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner"></span>
            ) : (
              'Add Inventory'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default InventoryForm;