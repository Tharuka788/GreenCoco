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
  faSpinner,
  faPlus,
  faCheck,
  faTimes,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const STATUS_OPTIONS = ['all', 'approved', 'pending', 'rejected'];

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    supplierName: '',
    supplierProduct: '',
    quantity: '',
    amount: '',
    email: '',
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [addFormErrors, setAddFormErrors] = useState({});

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

  // Approve supplier
  const handleApprove = async (supplierId, email) => {
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${supplierId}`, { status: 'approved' });
      toast.success('Supplier approved!');
      fetchSuppliersData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve supplier.');
    }
  };

  // Reject supplier
  const handleReject = async (supplierId, email) => {
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${supplierId}`, { status: 'rejected' });
      toast.success('Supplier rejected!');
      fetchSuppliersData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject supplier.');
    }
  };

  // Add supplier (manual)
  const validateAddForm = () => {
    const errors = {};
    if (!addForm.supplierName.trim()) {
      errors.supplierName = 'Supplier name is required';
    } else if (!/^[A-Za-z ]+$/.test(addForm.supplierName.trim())) {
      errors.supplierName = 'Supplier name can only contain letters and spaces';
    }
    if (!addForm.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (!/^[0-9]+$/.test(addForm.quantity)) {
      errors.quantity = 'Quantity can only contain numbers';
    }
    if (!addForm.amount) {
      errors.amount = 'Amount is required';
    } else if (!/^[0-9]+$/.test(addForm.amount)) {
      errors.amount = 'Amount can only contain numbers';
    }
    if (!addForm.email) {
      errors.email = 'Email is required';
    } else if (!addForm.email.includes('@')) {
      errors.email = 'Email must contain @ symbol';
    }
    return errors;
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    const errors = validateAddForm();
    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors);
      return;
    }
    setAddFormErrors({});
    try {
      await axios.post('http://localhost:5000/api/suppliers', {
        ...addForm,
        quantity: addForm.quantity === '' ? 0 : Number(addForm.quantity),
        amount: addForm.amount === '' ? 0 : Number(addForm.amount),
      });
      setShowAddModal(false);
      setAddForm({ supplierName: '', supplierProduct: '', quantity: '', amount: '', email: '' });
      toast.success('Supplier added!');
      fetchSuppliersData();
    } catch (error) {
      toast.error('Failed to add supplier.');
    }
  };

  // Fetch supplier performance data
  useEffect(() => {
    const fetchPerformance = async () => {
      setLoadingPerformance(true);
      try {
        const res = await axios.get('http://localhost:5000/api/suppliers/performance');
        setPerformanceData(res.data);
      } catch (err) {
        toast.error('Failed to load supplier performance');
      }
      setLoadingPerformance(false);
    };
    fetchPerformance();
  }, []);

  // Fetch low stock inventory items
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inventory/low-stock');
        setLowStockItems(res.data);
      } catch (err) {
        // Optionally show a toast or ignore
      }
    };
    fetchLowStock();
  }, []);

  // Summary cards
  const activeSuppliers = performanceData.filter(s => s.status === 'approved').length;
  const pendingSuppliers = performanceData.filter(s => s.status === 'pending').length;
  const topSupplier = performanceData.reduce((top, s) => (s.totalDelivered > (top?.totalDelivered || 0) ? s : top), null);

  // Table data (filtered)
  const filteredPerformance = performanceData.filter(supplier => {
    if (statusFilter === 'all') return true;
    return (supplier.status || 'pending').toLowerCase() === statusFilter;
  }).filter(supplier =>
    (supplier.supplierName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (supplier.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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

  // Filter by status
  const filteredSuppliers = suppliers.filter(supplier => {
    if (statusFilter === 'all') return true;
    return (supplier.status || 'pending').toLowerCase() === statusFilter;
  }).filter(supplier =>
    (supplier.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (supplier.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminNavbar />
      <div className="admin-suppliers">
        {/* Low Stock Notification */}
        {lowStockItems.length > 0 && (
          <div style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: 8, padding: 18, marginBottom: 24, fontWeight: 600, fontSize: 16 }}>
            <FontAwesomeIcon icon={faTruck} style={{ marginRight: 8 }} />
            Warning: The following items are low in stock:&nbsp;
            {lowStockItems.map(item => `${item.batchId} (${item.totalWeight}kg)`).join(', ')}
          </div>
        )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="add-supplier-btn"
              style={{
                background: '#00796b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 22px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add New Supplier
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt}
                style={{
                  background: statusFilter === opt ? '#00796b' : '#f0f0f0',
                  color: statusFilter === opt ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => setStatusFilter(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>

          <div className="table-container">
            {loadingPerformance ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading performance data...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Total Delivered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerformance.map((supplier) => (
                    <tr key={supplier.email}>
                      <td>{supplier.supplierName}</td>
                      <td>{supplier.email}</td>
                      <td style={{ textTransform: 'capitalize' }}>{supplier.status || 'pending'}</td>
                      <td>{supplier.totalDelivered}</td>
                      <td>
                        {/* Approve/Reject for pending */}
                        {(supplier.status === 'pending' || !supplier.status) ? (
                          <>
                            <button
                              style={{ background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', marginRight: '6px', cursor: 'pointer' }}
                              onClick={() => handleApprove(supplier._id, supplier.email)}
                            >
                              <FontAwesomeIcon icon={faCheck} /> Approve
                            </button>
                            <button
                              style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', cursor: 'pointer' }}
                              onClick={() => handleReject(supplier._id, supplier.email)}
                            >
                              <FontAwesomeIcon icon={faTimes} /> Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ color: supplier.status === 'approved' ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>{supplier.status}</span>
                        )}
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(supplier._id)}
                          style={{ marginLeft: 8 }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Supplier Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleAddSupplier} style={{ background: 'white', padding: 32, borderRadius: 12, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
              <h2 style={{ marginBottom: 20 }}>Add New Supplier</h2>
              <div style={{ marginBottom: 12 }}>
                <label>Supplier Name</label>
                <input type="text" value={addForm.supplierName} onChange={e => {
                  const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                  setAddForm(f => ({ ...f, supplierName: value }));
                }} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                {addFormErrors.supplierName && <div className="error-message">{addFormErrors.supplierName}</div>}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Product</label>
                <select
                  value={addForm.supplierProduct}
                  onChange={e => setAddForm(f => ({ ...f, supplierProduct: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                >
                  <option value="">Select a product</option>
                  <option value="coconut husk">Coconut Husk</option>
                  <option value="coconut shell">Coconut Shell</option>
                  <option value="coconut fiber">Coconut Fiber</option>
                  <option value="coconut pith">Coconut Pith</option>
                  <option value="coconut leaves">Coconut Leaves</option>
                  <option value="coconut trunk">Coconut Trunk</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Quantity</label>
                <input type="number" value={addForm.quantity} min="0" onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setAddForm(f => ({ ...f, quantity: value }));
                }} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                {addFormErrors.quantity && <div className="error-message">{addFormErrors.quantity}</div>}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Amount</label>
                <input type="number" value={addForm.amount} min="0" onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setAddForm(f => ({ ...f, amount: value }));
                }} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                {addFormErrors.amount && <div className="error-message">{addFormErrors.amount}</div>}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                {addFormErrors.email && <div className="error-message">{addFormErrors.email}</div>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#00796b', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Add Supplier</button>
              </div>
            </form>
          </div>
        )}
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