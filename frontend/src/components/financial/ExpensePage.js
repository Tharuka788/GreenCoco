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

  const [editExpense, setEditExpense] = useState(null); // State for editing an entry
  const [formErrors, setFormErrors] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newExpense.title.trim()) errors.title = 'Title is required';
    if (!newExpense.amount || newExpense.amount <= 0) errors.amount = 'Amount must be a positive number';
    if (!newExpense.category) errors.category = 'Category is required';
    if (!newExpense.date) errors.date = 'Date is required';
    if (!newExpense.description.trim()) errors.description = 'Description is required';

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
    const errors = {};
    if (!editExpense.title.trim()) errors.title = 'Title is required';
    if (!editExpense.amount || editExpense.amount <= 0) errors.amount = 'Amount must be a positive number';
    if (!editExpense.category) errors.category = 'Category is required';
    if (!editExpense.date) errors.date = 'Date is required';
    if (!editExpense.description.trim()) errors.description = 'Description is required';

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
      margin-left: 220px;
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

    .expense-list .action-buttons button {
      padding: 5px 10px;
      margin-right: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .expense-list .edit-button {
      background: #328e6e;
      color: white;
    }

    .expense-list .edit-button:hover {
      background: #46b38a;
    }

    .expense-list .delete-button {
      background: #e74c3c;
      color: white;
    }

    .expense-list .delete-button:hover {
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
                <option value="Utilities">Utilities</option>
                <option value="Supplies">Supplies</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
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
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>{expense.expenseCategory || '-'}</td>
                    <td>{expense.description || '-'}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button className="edit-button" onClick={() => handleEditExpense(expense)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteExpense(expense._id)}>
                        Delete
                      </button>
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