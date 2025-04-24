import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faBoxes,
  faFileInvoiceDollar,
  faHandshake,
  faSearch,
  faEdit,
  faTrash,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminSuppliers = () => {
  const [supplierData, setSupplierData] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalOrders: 0,
    totalSpent: 0,
    suppliers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5000/api/admin/suppliers', config);
      setSupplierData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching supplier data:', error);
      toast.error('Failed to fetch supplier data');
      setIsLoading(false);
    }
  };

  const handleEdit = (supplierId) => {
    // Implement edit functionality
    console.log('Edit supplier:', supplierId);
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5000/api/admin/suppliers/${supplierId}`, config);
        toast.success('Supplier deleted successfully');
        fetchSupplierData();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error('Failed to delete supplier');
      }
    }
  };

  const filteredSuppliers = supplierData.suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = `
    .admin-suppliers {
      padding: 2rem;
      margin-left: 280px;
    }

    .suppliers-header {
      margin-bottom: 2rem;
    }

    .suppliers-title {
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

    .suppliers-content {
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

    .add-button {
      background: #2a7458;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;
      font-size: 1rem;
    }

    .add-button:hover {
      background: #1e5c41;
    }

    .suppliers-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .suppliers-table th,
    .suppliers-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .suppliers-table th {
      background: #f8f9fa;
      color: #2a7458;
      font-weight: 600;
    }

    .suppliers-table tr:hover {
      background: #f8f9fa;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-active {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-inactive {
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

    @media (max-width: 768px) {
      .admin-suppliers {
        margin-left: 0;
        padding: 1rem;
      }

      .suppliers-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .suppliers-table {
        font-size: 0.9rem;
      }

      .suppliers-table th,
      .suppliers-table td {
        padding: 0.75rem 0.5rem;
      }

      .add-button {
        padding: 0.5rem 1rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <AdminNavbar />
        <div className="admin-suppliers">
          <div className="loading">Loading supplier data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />
      <div className="admin-suppliers">
        <div className="suppliers-header">
          <h1 className="suppliers-title">Supplier Management</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faTruck} className="stat-icon" />
              <h3 className="stat-title">Total Suppliers</h3>
            </div>
            <p className="stat-value">{supplierData.totalSuppliers}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faHandshake} className="stat-icon" />
              <h3 className="stat-title">Active Suppliers</h3>
            </div>
            <p className="stat-value">{supplierData.activeSuppliers}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faBoxes} className="stat-icon" />
              <h3 className="stat-title">Total Orders</h3>
            </div>
            <p className="stat-value">{supplierData.totalOrders}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="stat-icon" />
              <h3 className="stat-title">Total Spent</h3>
            </div>
            <p className="stat-value">${supplierData.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="suppliers-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button">
              <FontAwesomeIcon icon={faUserPlus} />
              Add Supplier
            </button>
          </div>

          <table className="suppliers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.category}</td>
                  <td>{supplier.location}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        supplier.status === 'active' ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {supplier.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{supplier.totalOrders}</td>
                  <td>${supplier.totalSpent.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(supplier._id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(supplier._id)}
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

export default AdminSuppliers; 