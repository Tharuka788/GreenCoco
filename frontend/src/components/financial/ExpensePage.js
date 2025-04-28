import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpensePage = () => {
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  const [editExpense, setEditExpense] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/finance/expense');
      setExpenseList(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expense entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const targetState = editExpense ? editExpense : newExpense;
    const setTargetState = editExpense ? setEditExpense : setNewExpense;

    // Filter out symbols for title field
    if (name === 'title') {
      const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
      setTargetState({ ...targetState, [name]: filteredValue });
    } 
    // Filter out negative numbers and non-numeric characters for amount field
    else if (name === 'amount') {
      const filteredValue = value.replace(/[^0-9.]/g, '');
      // Remove multiple decimal points
      const singleDecimal = filteredValue.replace(/(\..*)\./g, '$1');
      // Ensure the value is positive
      const positiveValue = singleDecimal.startsWith('-') ? singleDecimal.slice(1) : singleDecimal;
      setTargetState({ ...targetState, [name]: positiveValue });
    }
    else {
      setTargetState({ ...targetState, [name]: value });
    }

    const errors = { ...formErrors };

    // Title Validation
    if (name === 'title') {
      if (value.trim() === '') {
        errors.title = 'Title is required';
      } else if (value.trim().length > 50) {
        errors.title = 'Title cannot exceed 50 characters';
      } else if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
        errors.title = 'Title cannot contain symbols';
      } else {
        delete errors.title;
      }
    }

    // Amount Validation
    if (name === 'amount') {
      if (value === '') {
        errors.amount = 'Amount is required';
      } else if (!/^\d*\.?\d*$/.test(value)) {
        errors.amount = 'Amount must contain only numbers';
      } else if (parseFloat(value) <= 0) {
        errors.amount = 'Amount must be a positive number';
      } else if (parseFloat(value) > 1000000000) {
        errors.amount = 'Amount cannot exceed LKR 1,000,000,000';
      } else {
        delete errors.amount;
      }
    }

    // Category Validation
    if (name === 'category') {
      if (!value) {
        errors.category = 'Category is required';
      } else {
        delete errors.category;
      }
    }

    // Date Validation
    if (name === 'date') {
      if (!value) {
        errors.date = 'Date is required';
      } else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
        selectedDate.setHours(0, 0, 0, 0); // Reset time for selected date
        if (selectedDate < today) {
          errors.date = 'Date cannot be earlier than today';
        } else {
          delete errors.date;
        }
      }
    }

    // Description Validation
    if (name === 'description') {
      if (value.trim() === '') {
        errors.description = 'Description is required';
      } else if (value.trim().length < 5) {
        errors.description = 'Description must be at least 5 characters long';
      } else if (value.trim().length > 200) {
        errors.description = 'Description cannot exceed 200 characters';
      } else {
        delete errors.description;
      }
    }

    setFormErrors(errors);
  };

  const validateForm = (expenseData) => {
    const errors = {};

    // Title Validation
    if (!expenseData.title.trim()) {
      errors.title = 'Title is required';
    } else if (expenseData.title.trim().length > 50) {
      errors.title = 'Title cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s]*$/.test(expenseData.title)) {
      errors.title = 'Title can only contain letters and spaces';
    }

    // Amount Validation
    if (!expenseData.amount || isNaN(expenseData.amount) || parseFloat(expenseData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    } else if (parseFloat(expenseData.amount) > 1000000000) {
      errors.amount = 'Amount cannot exceed LKR 1,000,000,000';
    }

    // Category Validation
    if (!expenseData.category) {
      errors.category = 'Category is required';
    }

    // Date Validation
    if (!expenseData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(expenseData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() !== today.getTime()) {
        errors.date = 'Date must be today';
      }
    }

    // Description Validation
    if (!expenseData.description.trim()) {
      errors.description = 'Description is required';
    } else if (expenseData.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters long';
    } else if (expenseData.description.trim().length > 200) {
      errors.description = 'Description cannot exceed 200 characters';
    }

    return errors;
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const errors = validateForm(newExpense);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const expenseData = {
        category: newExpense.title,
        amount: parseFloat(newExpense.amount),
        expenseCategory: newExpense.category,
        date: newExpense.date,
        description: newExpense.description,
      };

      const response = await axios.post('http://localhost:5000/api/finance/expense', expenseData);
      setExpenseList(response.data.expenses);
      setNewExpense({ title: '', amount: '', category: '', date: '', description: '' });
      setFormErrors({});
      alert('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert(error.response?.data?.message || 'Failed to add expense.');
    }
  };

  const handleEditExpense = (expense) => {
    setEditExpense({
      id: expense._id,
      title: expense.category,
      amount: expense.amount,
      category: expense.expenseCategory,
      date: expense.date.split('T')[0],
      description: expense.description,
    });
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    const errors = validateForm(editExpense);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const expenseData = {
        category: editExpense.title,
        amount: parseFloat(editExpense.amount),
        expenseCategory: editExpense.category,
        date: editExpense.date,
        description: editExpense.description,
      };

      const response = await axios.put(`http://localhost:5000/api/finance/expense/${editExpense.id}`, expenseData);
      setExpenseList(response.data.expenses);
      setEditExpense(null);
      setFormErrors({});
      alert('Expense updated successfully!');
    } catch (error) {
      console.error('Error updating expense:', error);
      alert(error.response?.data?.message || 'Failed to update expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/finance/expense/${id}`);
        setExpenseList(response.data.expenses);
        alert('Expense deleted successfully!');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert(error.response?.data?.message || 'Failed to delete expense.');
      }
    }
  };

  const styles = `
    .expense-page {
      margin-top: 80px; /* Space for the fixed MainNavbar */
      padding: 30px;
      flex-grow: 1;
      background: #ffffff;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }

    .expense-page h1 {
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

    .expense-list {
      margin-top: 30px;
      padding: 25px;
      background: #f5f7fa;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .expense-list h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: 1.5rem;
      text-align: center;
    }

    .expense-list table {
      width: 100%;
      border-collapse: collapse;
    }

    .expense-list th,
    .expense-list td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 0.95rem;
      color: #5e6d55;
    }

    .expense-list th {
      color: #2a7458;
      font-weight: 600;
    }

    .expense-list tr:hover {
      background: #e6f0ea;
    }

    .expense-list .action-buttons {
      display: flex;
      gap: 10px;
    }

    .expense-list .action-buttons svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;
      padding: 5px;
      border-radius: 4px;
    }

    .expense-list .edit-icon {
      fill: #328e6e;
    }

    .expense-list .edit-icon:hover {
      fill: #46b38a;
      transform: scale(1.2);
      background: #e6f0ea;
    }

    .expense-list .delete-icon {
      fill: #e74c3c;
    }

    .expense-list .delete-icon:hover {
      fill: #c0392b;
      transform: scale(1.2);
      background: #f8e1e1;
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

    @media (max-width: 768px) {
      .expense-page {
        margin-top: 120px; /* Adjust for taller MainNavbar */
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="expense-page">
        <h1>Manage Expenses</h1>
        <div className="form-container">
          <h2>{editExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          <form onSubmit={editExpense ? handleUpdateExpense : handleAddExpense}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={editExpense ? editExpense.title : newExpense.title}
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
                value={editExpense ? editExpense.amount : newExpense.amount}
                onChange={handleInputChange}
                required
              />
              {formErrors.amount && <div className="error">{formErrors.amount}</div>}
            </label>
            <label>
              Category:
              <select
                name="category"
                value={editExpense ? editExpense.category : newExpense.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Operational Expenses">Operational Expenses</option>
                <option value="Labor Costs">Labor Costs</option>
                <option value="Utilities and Overheads">Utilities and Overheads</option>
                <option value="Compliance and Legal">Compliance and Legal</option>
              </select>
              {formErrors.category && <div className="error">{formErrors.category}</div>}
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={editExpense ? editExpense.date : newExpense.date}
                onChange={handleInputChange}
                required
                min={todayStr}
              />
              {formErrors.date && <div className="error">{formErrors.date}</div>}
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editExpense ? editExpense.description : newExpense.description}
                onChange={handleInputChange}
                required
              />
              {formErrors.description && <div className="error">{formErrors.description}</div>}
            </label>
            <button type="submit">{editExpense ? 'Update Expense' : 'Add Expense'}</button>
            {editExpense && (
              <button type="button" className="cancel-button" onClick={() => setEditExpense(null)}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="expense-list">
          <h2>Expense Entries</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : expenseList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title (Category)</th>
                  <th>Amount</th>
                  <th>Expense Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.category}</td>
                    <td>LKR {expense.amount.toFixed(2)}</td>
                    <td>{expense.expenseCategory || '-'}</td>
                    <td>{expense.description || '-'}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <svg
                        className="edit-icon"
                        onClick={() => handleEditExpense(expense)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                      <svg
                        className="delete-icon"
                        onClick={() => handleDeleteExpense(expense._id)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No expense entries found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpensePage;