import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faUsers,
  faMoneyBillWave,
  faSearch,
  faEdit,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminSuppliers = () => {
  const [suppliersData, setSuppliersData] = useState({
    stats: {
      totalSuppliers: 0,
      activeSuppliers: 0,
      totalSpent: 0
    },
    suppliers: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchSuppliersData = async () => {
    try {
      setLoading(true);
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

      // Try primary endpoint
      try {
        const response = await axios.get('http://localhost:5000/api/admin/suppliers', config);
        if (response.data) {
          setSuppliersData({
            stats: response.data.stats || {
              totalSuppliers: 0,
              activeSuppliers: 0,
              totalSpent: 0
            },
            suppliers: response.data.suppliers || []
          });
          setLoading(false);
          return;
        }
      } catch (primaryError) {
        console.log('Primary endpoint failed, trying fallback...');
        // Try fallback endpoint
        const fallbackResponse = await axios.get('http://localhost:5000/api/suppliers', config);
        if (fallbackResponse.data) {
          const suppliers = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
          setSuppliersData({
            stats: {
              totalSuppliers: suppliers.length,
              activeSuppliers: suppliers.filter(s => s.status === 'active').length,
              totalSpent: suppliers.reduce((total, s) => total + (s.totalSpent || 0), 0)
            },
            suppliers: suppliers
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers data:', error);
      setError(error.response?.data?.message || 'Failed to fetch suppliers data');
      toast.error(error.response?.data?.message || 'Failed to fetch suppliers data. Please try again later.');
      setSuppliersData({
        stats: {
          totalSuppliers: 0,
          activeSuppliers: 0,
          totalSpent: 0
        },
        suppliers: []
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (supplierId, newStatus) => {
    try {
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

      // Try primary endpoint
      try {
        await axios.put(
          `http://localhost:5000/api/admin/suppliers/${supplierId}/status`,
          { status: newStatus },
          config
        );
      } catch (primaryError) {
        // Try fallback endpoint
        await axios.put(
          `http://localhost:5000/api/suppliers/${supplierId}`,
          { status: newStatus },
          config
        );
      }

      toast.success('Supplier status updated successfully');
      fetchSuppliersData();
    } catch (error) {
      console.error('Error updating supplier status:', error);
      toast.error(error.response?.data?.message || 'Failed to update supplier status. Please try again.');
    }
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
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

        // Try primary endpoint
        try {
          await axios.delete(`http://localhost:5000/api/admin/suppliers/${supplierId}`, config);
        } catch (primaryError) {
          // Try fallback endpoint
          await axios.delete(`http://localhost:5000/api/suppliers/${supplierId}`, config);
        }

        toast.success('Supplier deleted successfully');
        fetchSuppliersData();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error(error.response?.data?.message || 'Failed to delete supplier. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-suppliers">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Loading suppliers data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-suppliers">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchSuppliersData}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const { stats, suppliers } = suppliersData;

  const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (supplier.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <div className="admin-suppliers">
        <h1>Suppliers Management</h1>

        <div className="supplier-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faTruck} className="icon" />
            <div className="stat-content">
              <h3>Total Suppliers</h3>
              <p>{stats.totalSuppliers.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <FontAwesomeIcon icon={faUsers} className="icon success" />
            <div className="stat-content">
              <h3>Active Suppliers</h3>
              <p>{stats.activeSuppliers.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <FontAwesomeIcon icon={faMoneyBillWave} className="icon warning" />
            <div className="stat-content">
              <h3>Total Spent</h3>
              <p>${stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="suppliers-content">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>Total Orders</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.category}</td>
                    <td>
                      <div>{supplier.email}</div>
                      <div>{supplier.phone}</div>
                    </td>
                    <td>{supplier.totalOrders}</td>
                    <td>
                      <select
                        value={supplier.status}
                        onChange={(e) => handleStatusChange(supplier._id, e.target.value)}
                        className={`status-select ${supplier.status}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(supplier._id)}
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
        .admin-suppliers {
          padding: 2rem;
          margin-left: 250px; /* Space for sidebar */
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 600;
        }

        .supplier-stats {
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
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
          width: 40px;
        }

        .icon.success {
          color: #2ecc71;
        }

        .icon.warning {
          color: #f1c40f;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1rem;
          color: #7f8c8d;
          font-weight: 500;
        }

        .stat-content p {
          margin: 0.5rem 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .suppliers-content {
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
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52,152,219,0.1);
        }

        .table-container {
          overflow-x: auto;
          margin: 0 -1.5rem;
          padding: 0 1.5rem;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 1rem;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        tbody tr:hover {
          background-color: #f8f9fa;
        }

        td > div {
          margin: 0.25rem 0;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          background-color: white;
          min-width: 120px;
        }

        .status-select.active {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-color: #2e7d32;
        }

        .status-select.inactive {
          background-color: #ffebee;
          color: #c62828;
          border-color: #c62828;
        }

        .status-select.pending {
          background-color: #fff3e0;
          color: #ef6c00;
          border-color: #ef6c00;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }

        .action-btn.delete {
          color: #e74c3c;
        }

        .action-btn.delete:hover {
          background-color: #ffebee;
        }

        @media (max-width: 1024px) {
          .admin-suppliers {
            margin-left: 0;
            padding: 1rem;
          }

          .supplier-stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stat-card {
            padding: 1rem;
          }

          .table-container {
            margin: 0 -1rem;
            padding: 0 1rem;
          }

          th, td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }

          .status-select {
            min-width: 100px;
            padding: 0.4rem;
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #2c3e50;
        }

        .loading-icon {
          font-size: 3rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 2rem;
          text-align: center;
        }

        .error-message {
          color: #e74c3c;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </>
  );
};

export default AdminSuppliers; 