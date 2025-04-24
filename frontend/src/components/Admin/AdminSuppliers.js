import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faUsers,
  faMoneyBillWave,
  faSearch,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AdminSuppliers = () => {
  const [suppliersData, setSuppliersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliersData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/admins/suppliers', config);
      setSuppliersData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers data:', error);
      toast.error('Failed to fetch suppliers data');
      setLoading(false);
    }
  };

  const handleStatusChange = async (supplierId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      await axios.put(
        `http://localhost:5000/api/admins/suppliers/${supplierId}`,
        { status: newStatus },
        config
      );
      toast.success('Supplier status updated successfully');
      fetchSuppliersData();
    } catch (error) {
      console.error('Error updating supplier status:', error);
      toast.error('Failed to update supplier status');
    }
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
        await axios.delete(`http://localhost:5000/api/admins/suppliers/${supplierId}`, config);
        toast.success('Supplier deleted successfully');
        fetchSuppliersData();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error('Failed to delete supplier');
      }
    }
  };

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  if (loading || !suppliersData) {
    return <div>Loading...</div>;
  }

  const { stats, suppliers } = suppliersData;

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

      <style jsx>{`
        .admin-suppliers {
          padding: 2rem;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
        }

        .supplier-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          border-radius: 5px;
          font-size: 1rem;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .status-select.active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-select.inactive {
          background-color: #ffebee;
          color: #c62828;
        }

        .status-select.pending {
          background-color: #fff3e0;
          color: #ef6c00;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .action-btn.delete {
          background-color: #ffebee;
          color: #c62828;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .admin-suppliers {
            padding: 1rem;
          }

          .supplier-stats {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          th, td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSuppliers; 