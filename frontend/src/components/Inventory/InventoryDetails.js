import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendar, faMapMarkerAlt, faWeight, faRecycle, faStar, faTasks, faCogs, faStickyNote, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const InventoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');

  const [inventory, setInventory] = useState(null);
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
  const [weightBreakdown, setWeightBreakdown] = useState({});
  const LOW_STOCK_THRESHOLD = 10;

  // Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/inventory/get/${id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inventory item');
        }

        const data = await response.json();
        setInventory(data.inventory);
        setFormData({
          batchId: data.inventory.batchId,
          collectionDate: data.inventory.collectionDate.split('T')[0],
          sourceLocation: data.inventory.sourceLocation,
          totalWeight: data.inventory.totalWeight,
          wasteType: data.inventory.wasteType,
          qualityGrade: data.inventory.qualityGrade,
          processingStatus: data.inventory.processingStatus,
          processingMethod: data.inventory.processingMethod,
          notes: data.inventory.notes
        });

        // Mock weight breakdown by waste type (replace with actual API data if available)
        setWeightBreakdown({
          CoconutHusk: data.inventory.wasteType === 'CoconutHusk' ? data.inventory.totalWeight : 0,
          CoconutShell: data.inventory.wasteType === 'CoconutShell' ? data.inventory.totalWeight : 0,
          CoconutFiber: data.inventory.wasteType === 'CoconutFiber' ? data.inventory.totalWeight : 0,
          CoconutPith: data.inventory.wasteType === 'CoconutPith' ? data.inventory.totalWeight : 0,
          CoconutLeaves: data.inventory.wasteType === 'CoconutLeaves' ? data.inventory.totalWeight : 0,
          CoconutTrunk: data.inventory.wasteType === 'CoconutTrunk' ? data.inventory.totalWeight : 0
        });
      } catch (err) {
        setErrors({ fetch: `Error: ${err.message}. Please try again later.` });
      }
    };

    fetchInventory();
  }, [id]);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
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
      const response = await fetch(`http://localhost:5000/inventory/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      const data = await response.json();
      setSuccess('Inventory updated successfully!');

      if (data.lowStock) {
        setLowStockMessage('This item is low on stock. A notification email has been sent to the admin.');
      }

      setTimeout(() => navigate('/inventory'), 2000);
    } catch (err) {
      setErrors({ submit: `Error: ${err.message}. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .inventory-details-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Poppins', sans-serif;
    }

    .inventory-details {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .inventory-details h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: 600;
    }

    .low-stock-warning,
    .low-stock-message {
      background: #ffebee;
      color: #d32f2f;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 500;
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

    .detail-field,
    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .detail-field label,
    .form-group label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #004d40;
      font-weight: 500;
    }

    .detail-field label svg,
    .form-group label svg {
      margin-right: 8px;
      color: #26a69a;
    }

    .detail-field span {
      display: block;
      padding: 10px;
      border: 2px solid #b0bec5;
      border-radius: 6px;
      font-size: 14px;
      background: #f5f5f5;
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

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.waste-type {
      background: #26a69a;
      color: white;
    }

    .status-badge.processing-status {
      background: #00796b;
      color: white;
    }

    .weight-section {
      margin-bottom: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .weight-section h3 {
      color: #004d40;
      margin-bottom: 10px;
      font-size: 18px;
    }

    .weight-breakdown {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
    }

    .weight-item {
      padding: 10px;
      background: white;
      border-radius: 6px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .weight-progress {
      height: 8px;
      background: #eceff1;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }

    .weight-progress-fill {
      height: 100%;
      background: #26a69a;
      transition: width 0.3s ease;
    }

    .submit-btn,
    .back-btn {
      background: #00796b;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .back-btn {
      background: #26a69a;
    }

    .submit-btn:hover,
    .back-btn:hover {
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
      .inventory-details {
        padding: 20px;
      }

      .inventory-details-container {
        margin-top: 120px;
      }

      .weight-breakdown {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (!inventory) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <MainNavbar />
        <div className="inventory-details-container">
          <div className="inventory-details">
            <h1>{isEditMode ? 'Edit Inventory' : 'Inventory Details'}</h1>
            {errors.fetch && <div className="error">{errors.fetch}</div>}
            {!errors.fetch && <p>Loading...</p>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="inventory-details-container">
        <div className="inventory-details">
          <h1>{isEditMode ? 'Edit Inventory' : 'Inventory Details'}</h1>

          {inventory.totalWeight < LOW_STOCK_THRESHOLD && (
            <div className="low-stock-warning">
              Warning: This item is low on stock (below {LOW_STOCK_THRESHOLD} kg)!
            </div>
          )}

          {errors.submit && <div className="error">{errors.submit}</div>}
          {success && <div className="success">{success}</div>}
          {lowStockMessage && <div className="low-stock-message">{lowStockMessage}</div>}

          <div className="weight-section">
            <h3>Weight Information</h3>
            <div className="weight-item">
              <strong>Total Weight:</strong> {inventory.totalWeight} kg
              <div className="weight-progress">
                <div
                  className="weight-progress-fill"
                  style={{ width: `${(inventory.totalWeight / LOW_STOCK_THRESHOLD) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="weight-item">
              <strong>Batch Cumulative Weight:</strong> {inventory.totalWeight * 1.5} kg (Mock)
            </div>
            <h3 style={{ marginTop: '15px' }}>Weight Breakdown by Waste Type</h3>
            <div className="weight-breakdown">
              {Object.entries(weightBreakdown).map(([type, weight]) => (
                weight > 0 && (
                  <div key={type} className="weight-item">
                    <strong>{type}:</strong> {weight} kg
                  </div>
                )
              ))}
            </div>
          </div>

          {isEditMode ? (
            <form onSubmit={handleSubmit}>
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

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading-spinner"></span> : 'Update Inventory'}
              </button>
            </form>
          ) : (
            <div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faBox} /> Batch ID</label>
                <span>{inventory.batchId}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faCalendar} /> Collection Date</label>
                <span>{new Date(inventory.collectionDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Source Location</label>
                <span>{inventory.sourceLocation}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faWeight} /> Total Weight (kg)</label>
                <span>{inventory.totalWeight}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faRecycle} /> Waste Type</label>
                <span className="status-badge waste-type">{inventory.wasteType}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faStar} /> Quality Grade</label>
                <span>{inventory.qualityGrade}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faTasks} /> Processing Status</label>
                <span className="status-badge processing-status">{inventory.processingStatus}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faCogs} /> Processing Method</label>
                <span>{inventory.processingMethod}</span>
              </div>
              <div className="detail-field">
                <label><FontAwesomeIcon icon={faStickyNote} /> Notes</label>
                <span>{inventory.notes}</span>
              </div>
            </div>
          )}

          <button className="back-btn" onClick={() => navigate('/inventory')}>
            Back to Inventory
          </button>
        </div>
      </div>
    </>
  );
};

export default InventoryDetails;