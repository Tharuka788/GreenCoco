import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faExclamationTriangle,
  faBoxOpen,
  faWarehouse,
  faSearch,
  faEdit,
  faTrash,
  faTachometerAlt,
  faPlus,
  faChartLine,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import { Link, useNavigate } from 'react-router-dom';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    items: [],
    dashboardStats: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch both inventory items and dashboard data
      const [inventoryResponse, dashboardResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/inventory', config),
        axios.get('http://localhost:5000/api/admin/inventory/dashboard', config)
      ]);

      setInventoryData({
        ...inventoryResponse.data,
        dashboardStats: dashboardResponse.data
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to fetch inventory data');
      setIsLoading(false);
    }
  };

  const handleEdit = (itemId) => {
    // Implement edit functionality
    console.log('Edit item:', itemId);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5000/api/admin/inventory/${itemId}`, config);
        toast.success('Item deleted successfully');
        fetchInventoryData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredItems = inventoryData.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = `
    .admin-inventory {
      padding: 2rem;
      margin-left: 280px;
    }

    .inventory-header {
      margin-bottom: 2rem;
    }

    .inventory-title {
      font-size: 2rem;
      color: #2a7458;
      margin-bottom: 1rem;
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #2a7458;
    }

    .stat-title {
      font-size: 1.1rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2a7458;
    }

    .inventory-content {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-bar {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: none;
      padding: 0.5rem;
      font-size: 1rem;
      color: #333;
      outline: none;
    }

    .search-icon {
      color: #666;
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
      background: #f8f9fa;
      color: #2a7458;
      font-weight: 600;
    }

    .inventory-table tr:hover {
      background: #f8f9fa;
    }

    .stock-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-in-stock {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-low-stock {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-out-of-stock {
      background: #ffebee;
      color: #d32f2f;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .edit-button {
      color: #2196f3;
    }

    .edit-button:hover {
      color: #1976d2;
    }

    .delete-button {
      color: #f44336;
    }

    .delete-button:hover {
      color: #d32f2f;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      font-size: 1.2rem;
      color: #666;
    }

    .view-dashboard-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #2a7458;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .view-dashboard-btn:hover {
      background: #1e5c42;
      transform: translateY(-2px);
    }

    .admin-actions {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #ffffff;
      color: #2a7458;
      border: 2px solid #2a7458;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: #2a7458;
      color: white;
    }

    @media (max-width: 768px) {
      .admin-inventory {
        margin-left: 0;
        padding: 1rem;
      }

      .inventory-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .inventory-table {
        font-size: 0.9rem;
      }

      .inventory-table th,
      .inventory-table td {
        padding: 0.75rem 0.5rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <AdminNavbar />
        <div className="admin-inventory">
          <div className="loading">Loading inventory data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />
      <div className="admin-inventory">
        <div className="inventory-header">
          <h1 className="inventory-title">Admin Inventory Management</h1>
          <Link to="/admin/inventory/dashboard" className="view-dashboard-btn">
            <FontAwesomeIcon icon={faTachometerAlt} /> View Dashboard
          </Link>
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
              <FontAwesomeIcon icon={faExclamationTriangle} className="stat-icon" />
              <h3 className="stat-title">Low Stock Items</h3>
            </div>
            <p className="stat-value">{inventoryData.lowStockItems}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faBoxOpen} className="stat-icon" />
              <h3 className="stat-title">Out of Stock</h3>
            </div>
            <p className="stat-value">{inventoryData.outOfStockItems}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faWarehouse} className="stat-icon" />
              <h3 className="stat-title">Total Value</h3>
            </div>
            <p className="stat-value">${inventoryData.totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-actions">
          <button className="action-btn" onClick={() => navigate('/admin/inventory/add')}>
            <FontAwesomeIcon icon={faPlus} /> Add New Item
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/inventory/reports')}>
            <FontAwesomeIcon icon={faChartLine} /> View Reports
          </button>
          <button className="action-btn" onClick={exportToCSV}>
            <FontAwesomeIcon icon={faDownload} /> Export Data
          </button>
        </div>

        <div className="inventory-content">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by item name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toLocaleString()}</td>
                  <td>
                    <span
                      className={`stock-status ${
                        item.quantity === 0
                          ? 'status-out-of-stock'
                          : item.quantity <= item.lowStockThreshold
                          ? 'status-low-stock'
                          : 'status-in-stock'
                      }`}
                    >
                      {item.quantity === 0
                        ? 'Out of Stock'
                        : item.quantity <= item.lowStockThreshold
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(item._id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminInventory; 