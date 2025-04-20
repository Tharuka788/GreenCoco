import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';

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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/inventory/add', { // Updated port to 5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add inventory');
      }

      setSuccess('Inventory added successfully!');
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
      setError(err.message);
    }
  };

  const styles = `
    .inventory-form-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: #f5f7fa;
      font-family: Arial, sans-serif;
    }

    .inventory-form {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .inventory-form h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #333;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group textarea {
      height: 100px;
      resize: vertical;
    }

    .submit-btn {
      background: #2a7458;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
    }

    .submit-btn:hover {
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
      .inventory-form {
        padding: 15px;
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
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

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

          <button type="submit" className="submit-btn">Add Inventory</button>
        </form>
      </div>
    </>
  );
};

export default InventoryForm;