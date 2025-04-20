import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch inventory item details
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
          collectionDate: data.inventory.collectionDate.split('T')[0], // Format for input type="date"
          sourceLocation: data.inventory.sourceLocation,
          totalWeight: data.inventory.totalWeight,
          wasteType: data.inventory.wasteType,
          qualityGrade: data.inventory.qualityGrade,
          processingStatus: data.inventory.processingStatus,
          processingMethod: data.inventory.processingMethod,
          notes: data.inventory.notes
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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

      setSuccess('Inventory updated successfully!');
      setTimeout(() => navigate('/inventory'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = `
    .inventory-details-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: #f5f7fa;
      font-family: Arial, sans-serif;
    }

    .inventory-details {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .inventory-details h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 20px;
    }

    .detail-field,
    .form-group {
      margin-bottom: 15px;
    }

    .detail-field label,
    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: bold;
    }

    .detail-field span,
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      border: ${isEditMode ? '1px solid #ccc' : 'none'};
      background: ${isEditMode ? 'white' : 'transparent'};
      pointer-events: ${isEditMode ? 'auto' : 'none'};
    }

    .form-group textarea {
      height: 100px;
      resize: vertical;
    }

    .submit-btn,
    .back-btn {
      background: #2a7458;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
      margin-top: 10px;
    }

    .back-btn {
      background: #328e6e;
    }

    .submit-btn:hover,
    .back-btn:hover {
      background: #46b38a;
    }

    .error {
      color: red;
      text-align: center;
      margin-bottom: 10px;
    }

    .success {
      color: green;
      text-align: center;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .inventory-details {
        padding: 15px;
      }

      .inventory-details-container {
        margin-top: 120px;
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
            <p>Loading...</p>
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
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          {isEditMode ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="batchId">Batch ID</label>
                <input
                  type="text"
                  id="batchId"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="collectionDate">Collection Date</label>
                <input
                  type="date"
                  id="collectionDate"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sourceLocation">Source Location</label>
                <input
                  type="text"
                  id="sourceLocation"
                  name="sourceLocation"
                  value={formData.sourceLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalWeight">Total Weight (kg)</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="wasteType">Waste Type</label>
                <select
                  id="wasteType"
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Waste Type</option>
                  <option value="Organic">Organic</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="qualityGrade">Quality Grade</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="processingStatus">Processing Status</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="processingMethod">Processing Method</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Update Inventory</button>
            </form>
          ) : (
            <div>
              <div className="detail-field">
                <label>Batch ID</label>
                <span>{inventory.batchId}</span>
              </div>
              <div className="detail-field">
                <label>Collection Date</label>
                <span>{new Date(inventory.collectionDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-field">
                <label>Source Location</label>
                <span>{inventory.sourceLocation}</span>
              </div>
              <div className="detail-field">
                <label>Total Weight (kg)</label>
                <span>{inventory.totalWeight}</span>
              </div>
              <div className="detail-field">
                <label>Waste Type</label>
                <span>{inventory.wasteType}</span>
              </div>
              <div className="detail-field">
                <label>Quality Grade</label>
                <span>{inventory.qualityGrade}</span>
              </div>
              <div className="detail-field">
                <label>Processing Status</label>
                <span>{inventory.processingStatus}</span>
              </div>
              <div className="detail-field">
                <label>Processing Method</label>
                <span>{inventory.processingMethod}</span>
              </div>
              <div className="detail-field">
                <label>Notes</label>
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