import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomePage = () => {
  const [newIncome, setNewIncome] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  const [editIncome, setEditIncome] = useState(null); // State for editing an entry
  const [formErrors, setFormErrors] = useState({});
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/finance/income');
      setIncomeList(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
      setError('Failed to fetch income entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const targetState = editIncome ? editIncome : newIncome;
    const setTargetState = editIncome ? setEditIncome : setNewIncome;

    setTargetState({ ...targetState, [name]: value });

    const errors = { ...formErrors };
    if (name === 'title' && value.trim() === '') {
      errors.title = 'Title is required';
    } else {
      delete errors.title;
    }
    if (name === 'amount' && (value <= 0 || isNaN(value))) {
      errors.amount = 'Amount must be a positive number';
    } else {
      delete errors.amount;
    }
    if (name === 'category' && !value) {
      errors.category = 'Category is required';
    } else {
      delete errors.category;
    }
    if (name === 'date' && !value) {
      errors.date = 'Date is required';
    } else {
      delete errors.date;
    }
    if (name === 'description' && value.trim() === '') {
      errors.description = 'Description is required';
    } else {
      delete errors.description;
    }
    setFormErrors(errors);
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newIncome.title.trim()) errors.title = 'Title is required';
    if (!newIncome.amount || newIncome.amount <= 0) errors.amount = 'Amount must be a positive number';
    if (!newIncome.category) errors.category = 'Category is required';
    if (!newIncome.date) errors.date = 'Date is required';
    if (!newIncome.description.trim()) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const incomeData = {
        source: newIncome.title,
        amount: parseFloat(newIncome.amount),
        category: newIncome.category,
        date: newIncome.date,
        description: newIncome.description,
      };

      const response = await axios.post('http://localhost:5000/api/finance/income', incomeData);
      setIncomeList(response.data.income);
      setNewIncome({ title: '', amount: '', category: '', date: '', description: '' });
      setFormErrors({});
      alert('Income added successfully!');
    } catch (error) {
      console.error('Error adding income:', error);
      alert(error.response?.data?.message || 'Failed to add income.');
    }
  };

  const handleEditIncome = (income) => {
    setEditIncome({
      id: income._id,
      title: income.source,
      amount: income.amount,
      category: income.category,
      date: income.date.split('T')[0], // Format date for input
      description: income.description,
    });
  };

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editIncome.title.trim()) errors.title = 'Title is required';
    if (!editIncome.amount || editIncome.amount <= 0) errors.amount = 'Amount must be a positive number';
    if (!editIncome.category) errors.category = 'Category is required';
    if (!editIncome.date) errors.date = 'Date is required';
    if (!editIncome.description.trim()) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const incomeData = {
        source: editIncome.title,
        amount: parseFloat(editIncome.amount),
        category: editIncome.category,
        date: editIncome.date,
        description: editIncome.description,
      };

      const response = await axios.put(`http://localhost:5000/api/finance/income/${editIncome.id}`, incomeData);
      setIncomeList(response.data.income);
      setEditIncome(null);
      setFormErrors({});
      alert('Income updated successfully!');
    } catch (error) {
      console.error('Error updating income:', error);
      alert(error.response?.data?.message || 'Failed to update income.');
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/finance/income/${id}`);
        setIncomeList(response.data.income);
        alert('Income deleted successfully!');
      } catch (error) {
        console.error('Error deleting income:', error);
        alert(error.response?.data?.message || 'Failed to delete income.');
      }
    }
  };

  const styles = `
    .income-page {
      margin-left: 220px;
      padding: 30px;
      flex-grow: 1;
      background: #ffffff;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }

    .income-page h1 {
      margin-bottom: 30px;
      color: #2a7458;
      font-weight: 600;
      font-size: 2.5rem;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .form-container {
      margin-bottom: 30px;
      padding: 25px;
      background: #f5f7fa;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .form-container h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: 1.5rem;
      text-align: center;
    }

    .form-container label {
      display: block;
      margin-bottom: 8px;
      color: #2a7458;
      font-weight: 400;
      font-size: 1rem;
    }

    .form-container input,
    .form-container select,
    .form-container textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-container select {
      appearance: none;
      background: url('data:image/svg+xml;utf8,<svg fill="%232a7458" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
      background-size: 16px;
      padding-right: 30px;
    }

    .form-container textarea {
      height: 100px;
      resize: vertical;
    }

    .form-container input:focus,
    .form-container select:focus,
    .form-container textarea:focus {
      outline: none;
      border-color: #328e6e;
      box-shadow: 0 0 5px rgba(50, 142, 110, 0.3);
    }

    .form-container .error {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .form-container button {
      display: block;
      width: 100%;
      padding: 12px;
      background: #328e6e;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    .form-container button:hover {
      background: #46b38a;
      transform: scale(1.02);
    }

    .form-container button:active {
      transform: scale(0.98);
    }

    .form-container .cancel-button {
      background: #e74c3c;
      margin-top: 10px;
    }

    .form-container .cancel-button:hover {
      background: #c0392b;
    }

    .income-list {
      margin-top: 30px;
      padding: 25px;
      background: #f5f7fa;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .income-list h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: 1.5rem;
      text-align: center;
    }

    .income-list table {
      width: 100%;
      border-collapse: collapse;
    }

    .income-list th,
    .income-list td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 0.95rem;
      color: #5e6d55;
    }

    .income-list th {
      color: #2a7458;
      font-weight: 600;
    }

    .income-list tr:hover {
      background: #e6f0ea;
    }

    .income-list .action-buttons button {
      padding: 5px 10px;
      margin-right: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .income-list .edit-button {
      background: #328e6e;
      color: white;
    }

    .income-list .edit-button:hover {
      background: #46b38a;
    }

    .income-list .delete-button {
      background: #e74c3c;
      color: white;
    }

    .income-list .delete-button:hover {
      background: #c0392b;
    }

    .loading {
      text-align: center;
      color: #2a7458;
      font-size: 1rem;
      margin-top: 20px;
    }

    .error-message {
      text-align: center;
      color: #e74c3c;
      font-size: 1rem;
      margin-top: 20px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="income-page">
        <h1>Manage Income</h1>
        <div className="form-container">
          <h2>{editIncome ? 'Edit Income' : 'Add Income'}</h2>
          <form onSubmit={editIncome ? handleUpdateIncome : handleAddIncome}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={editIncome ? editIncome.title : newIncome.title}
                onChange={handleInputChange}
                required
              />
              {formErrors.title && <div className="error">{formErrors.title}</div>}
            </label>
            <label>
              Amount:
              <input
                type="number"
                name="amount"
                value={editIncome ? editIncome.amount : newIncome.amount}
                onChange={handleInputChange}
                required
              />
              {formErrors.amount && <div className="error">{formErrors.amount}</div>}
            </label>
            <label>
              Category:
              <select
                name="category"
                value={editIncome ? editIncome.category : newIncome.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.category && <div className="error">{formErrors.category}</div>}
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={editIncome ? editIncome.date : newIncome.date}
                onChange={handleInputChange}
                required
              />
              {formErrors.date && <div className="error">{formErrors.date}</div>}
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editIncome ? editIncome.description : newIncome.description}
                onChange={handleInputChange}
                required
              />
              {formErrors.description && <div className="error">{formErrors.description}</div>}
            </label>
            <button type="submit">{editIncome ? 'Update Income' : 'Add Income'}</button>
            {editIncome && (
              <button type="button" className="cancel-button" onClick={() => setEditIncome(null)}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="income-list">
          <h2>Income Entries</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : incomeList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title (Source)</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomeList.map((income) => (
                  <tr key={income._id}>
                    <td>{income.source}</td>
                    <td>${income.amount.toFixed(2)}</td>
                    <td>{income.category || '-'}</td>
                    <td>{income.description || '-'}</td>
                    <td>{new Date(income.date).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button className="edit-button" onClick={() => handleEditIncome(income)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteIncome(income._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No income entries found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IncomePage;