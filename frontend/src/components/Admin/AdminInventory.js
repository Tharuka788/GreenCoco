import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faExclamationTriangle,
  faBoxOpen,
  faWarehouse,
  faSearch,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    processedItems: 0,
    totalWeight: 0,
    items: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5000/inventory', config);
      const items = response.data || [];

      // Calculate inventory statistics
      const stats = {
        totalItems: items.length,
        lowStockItems: items.filter(item => item.lowStock).length,
        processedItems: items.filter(item => item.processingStatus === 'Processed').length,
        totalWeight: items.reduce((sum, item) => sum + (Number(item.totalWeight) || 0), 0),
        items: items
      };

      setInventoryData(stats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError('Failed to fetch inventory data. Please try again later.');
      toast.error('Failed to fetch inventory data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(fetchInventoryData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5000/inventory/delete/${itemId}`, config);
        toast.success('Item deleted successfully');
        fetchInventoryData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredItems = inventoryData.items.filter(item =>
    (item.batchId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.wasteType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.sourceLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-inventory">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Loading inventory data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-inventory">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchInventoryData}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-inventory">
        <div className="inventory-header">
          <h1 className="inventory-title">Inventory Management</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faBox} className="stat-icon" />
              <h3 className="stat-title">Total Items</h3>
            </div>
            <p className="stat-value">{inventoryData.totalItems}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faExclamationTriangle} className="stat-icon warning" />
              <h3 className="stat-title">Low Stock Items</h3>
            </div>
            <p className="stat-value warning">{inventoryData.lowStockItems}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faBoxOpen} className="stat-icon success" />
              <h3 className="stat-title">Processed Items</h3>
            </div>
            <p className="stat-value success">{inventoryData.processedItems}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faWarehouse} className="stat-icon" />
              <h3 className="stat-title">Total Weight</h3>
            </div>
            <p className="stat-value">{inventoryData.totalWeight.toLocaleString()} kg</p>
          </div>
        </div>

        <div className="inventory-content">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by batch ID, waste type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Collection Date</th>
                  <th>Source Location</th>
                  <th>Waste Type</th>
                  <th>Total Weight</th>
                  <th>Quality Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.batchId}</td>
                    <td>{new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>{item.sourceLocation}</td>
                    <td>{item.wasteType}</td>
                    <td>{item.totalWeight} kg</td>
                    <td>{item.qualityGrade}</td>
                    <td>
                      <span className={`status-badge ${item.processingStatus.toLowerCase()}`}>
                        {item.processingStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-inventory {
          padding: 2rem;
          margin-left: 250px;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-icon {
          font-size: 2rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #e74c3c;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background-color: #2980b9;
        }

        .inventory-header {
          margin-bottom: 2rem;
        }

        .inventory-title {
          font-size: 2rem;
          color: #2c3e50;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: #3498db;
        }

        .stat-icon.warning {
          color: #f1c40f;
        }

        .stat-icon.success {
          color: #2ecc71;
        }

        .stat-title {
          margin: 0;
          color: #7f8c8d;
          font-size: 1rem;
        }

        .stat-value {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .stat-value.warning {
          color: #f1c40f;
        }

        .stat-value.success {
          color: #2ecc71;
        }

        .inventory-content {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .search-bar {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52,152,219,0.1);
        }

        .table-container {
          overflow-x: auto;
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
        }

        .inventory-table th,
        .inventory-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .inventory-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.processed {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.processing {
          background-color: #fff3e0;
          color: #ef6c00;
        }

        .status-badge.pending {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }

        .action-btn.delete {
          color: #e74c3c;
        }

        .action-btn.delete:hover {
          background-color: #ffebee;
        }

        @media (max-width: 1024px) {
          .admin-inventory {
            margin-left: 0;
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminInventory; 