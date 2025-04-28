import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch, 
  faSave, 
  faTimes,
  faSort,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const SupplierManagement = ({ onUpdate }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'supplierName', direction: 'asc' });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierProduct: '',
    quantity: '',
    amount: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to load suppliers. Please try again.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'supplierName') {
      newValue = newValue.replace(/[^A-Za-z ]/g, '');
    }
    if (name === 'quantity' || name === 'amount') {
      newValue = newValue.replace(/[^0-9]/g, '');
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.supplierName.trim()) {
      errors.supplierName = 'Supplier name is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.supplierName.trim())) {
      errors.supplierName = 'Supplier name can only contain letters and spaces';
    }
    if (!formData.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (!/^[0-9]+$/.test(formData.quantity)) {
      errors.quantity = 'Quantity can only contain numbers';
    }
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (!/^[0-9]+$/.test(formData.amount)) {
      errors.amount = 'Amount can only contain numbers';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Email must contain @ symbol';
    }
    return errors;
  };

  // Add new supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      await axios.post('http://localhost:5000/api/suppliers', formData);
      setShowAddForm(false);
      setFormData({
        supplierName: '',
        supplierProduct: '',
        quantity: '',
        amount: '',
        email: ''
      });
      fetchSuppliers();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding supplier:', error);
      setError('Failed to add supplier. Please try again.');
    }
  };

  // Update supplier
  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${editingSupplier._id}`, formData);
      setEditingSupplier(null);
      setFormData({
        supplierName: '',
        supplierProduct: '',
        quantity: '',
        amount: '',
        email: ''
      });
      fetchSuppliers();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating supplier:', error);
      setError('Failed to update supplier. Please try again.');
    }
  };

  // Delete supplier
  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        fetchSuppliers();
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        setError('Failed to delete supplier. Please try again.');
      }
    }
  };

  // Start editing supplier
  const startEditing = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName,
      supplierProduct: supplier.supplierProduct,
      quantity: supplier.quantity,
      amount: supplier.amount,
      email: supplier.email
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSupplier(null);
    setFormData({
      supplierName: '',
      supplierProduct: '',
      quantity: '',
      amount: '',
      email: ''
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Filter and sort suppliers
  const filteredAndSortedSuppliers = React.useMemo(() => {
    return [...suppliers]
      .filter(supplier => 
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.supplierProduct.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [suppliers, searchTerm, sortConfig]);

  const styles = `
    .supplier-management {
      padding: 20px;
      max-width: 1200px;
      margin: 80px auto 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px 12px;
      width: 300px;
    }

    .search-box input {
      border: none;
      outline: none;
      margin-left: 8px;
      width: 100%;
    }

    .add-button {
      background: #00796b;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.3s;
    }

    .add-button:hover {
      background: #00695c;
    }

    .suppliers-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .suppliers-table th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      user-select: none;
    }

    .suppliers-table th:hover {
      background: #e0e0e0;
    }

    .suppliers-table td {
      padding: 12px;
      border-top: 1px solid #eee;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .edit-button, .delete-button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background-color 0.3s;
    }

    .edit-button {
      background: #2196f3;
      color: white;
    }

    .edit-button:hover {
      background: #1976d2;
    }

    .delete-button {
      background: #f44336;
      color: white;
    }

    .delete-button:hover {
      background: #d32f2f;
    }

    .supplier-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input:focus {
      border-color: #00796b;
      outline: none;
    }

    .form-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .save-button, .cancel-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.3s;
    }

    .save-button {
      background: #00796b;
      color: white;
    }

    .save-button:hover {
      background: #00695c;
    }

    .cancel-button {
      background: #9e9e9e;
      color: white;
    }

    .cancel-button:hover {
      background: #757575;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="supplier-management">
        <div className="header">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading suppliers...</div>
        ) : (
          <table className="suppliers-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('supplierName')}>
                  <FontAwesomeIcon icon={faSort} /> Name
                </th>
                <th onClick={() => handleSort('supplierProduct')}>
                  <FontAwesomeIcon icon={faSort} /> Product
                </th>
                <th onClick={() => handleSort('quantity')}>
                  <FontAwesomeIcon icon={faSort} /> Quantity
                </th>
                <th onClick={() => handleSort('amount')}>
                  <FontAwesomeIcon icon={faSort} /> Amount
                </th>
                <th onClick={() => handleSort('email')}>
                  <FontAwesomeIcon icon={faSort} /> Email
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.supplierProduct}</td>
                  <td>{supplier.quantity}</td>
                  <td>Rs. {supplier.amount.toLocaleString()}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => startEditing(supplier)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteSupplier(supplier._id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showAddForm || editingSupplier ? (
          <form className="supplier-form" onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier}>
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                required
              />
              {formErrors.supplierName && <div className="error-message">{formErrors.supplierName}</div>}
            </div>
            <div className="form-group">
              <label>Product</label>
              <input
                type="text"
                name="supplierProduct"
                value={formData.supplierProduct}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
              {formErrors.quantity && <div className="error-message">{formErrors.quantity}</div>}
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
              {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {formErrors.email && <div className="error-message">{formErrors.email}</div>}
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-button">
                <FontAwesomeIcon icon={faSave} /> {editingSupplier ? 'Update' : 'Add'}
              </button>
              <button type="button" className="cancel-button" onClick={cancelEditing}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
};

export default SupplierManagement; 