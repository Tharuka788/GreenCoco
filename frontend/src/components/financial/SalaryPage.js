import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalaryPage = () => {
  const [newSalary, setNewSalary] = useState({
    title: '',
    amount: '',
    date: '',
    description: '',
  });

  const [editSalary, setEditSalary] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [salaryList, setSalaryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/finance/salary');
      setSalaryList(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
      setError('Failed to fetch salary entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const targetState = editSalary ? editSalary : newSalary;
    const setTargetState = editSalary ? setEditSalary : setNewSalary;

    setTargetState({ ...targetState, [name]: value });

    const errors = { ...formErrors };

    // Title Validation
    if (name === 'title') {
      if (value.trim() === '') {
        errors.title = 'Title is required';
      } else if (value.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters long';
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

  const validateForm = (salaryData) => {
    const errors = {};

    // Title Validation
    if (!salaryData.title.trim()) {
      errors.title = 'Title is required';
    } else if (salaryData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (salaryData.title.trim().length > 50) {
      errors.title = 'Title cannot exceed 50 characters';
    } else if (!/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(salaryData.title)) {
      errors.title = 'Title contains invalid characters';
    }

    // Amount Validation
    if (!salaryData.amount || isNaN(salaryData.amount) || parseFloat(salaryData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    } else if (parseFloat(salaryData.amount) > 1000000000) {
      errors.amount = 'Amount cannot exceed LKR 1,000,000,000';
    }

    // Date Validation
    if (!salaryData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(salaryData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() !== today.getTime()) {
        errors.date = 'Date must be today';
      }
    }

    // Description Validation
    if (!salaryData.description.trim()) {
      errors.description = 'Description is required';
    } else if (salaryData.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters long';
    } else if (salaryData.description.trim().length > 200) {
      errors.description = 'Description cannot exceed 200 characters';
    }

    return errors;
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();

    const errors = validateForm(newSalary);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const salaryData = {
        employeeId: newSalary.title,
        amount: parseFloat(newSalary.amount),
        date: newSalary.date,
        description: newSalary.description,
      };

      const response = await axios.post('http://localhost:5000/api/finance/salary', salaryData);
      setSalaryList(response.data.salaries);
      setNewSalary({ title: '', amount: '', date: '', description: '' });
      setFormErrors({});
      alert('Salary added successfully!');
    } catch (error) {
      console.error('Error adding salary:', error);
      alert(error.response?.data?.message || 'Failed to add salary.');
    }
  };

  const handleEditSalary = (salary) => {
    setEditSalary({
      id: salary._id,
      title: salary.employeeId,
      amount: salary.amount,
      date: salary.date.split('T')[0],
      description: salary.description,
    });
  };

  const handleUpdateSalary = async (e) => {
    e.preventDefault();

    const errors = validateForm(editSalary);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const salaryData = {
        employeeId: editSalary.title,
        amount: parseFloat(editSalary.amount),
        date: editSalary.date,
        description: editSalary.description,
      };

      const response = await axios.put(`http://localhost:5000/api/finance/salary/${editSalary.id}`, salaryData);
      setSalaryList(response.data.salaries);
      setEditSalary(null);
      setFormErrors({});
      alert('Salary updated successfully!');
    } catch (error) {
      console.error('Error updating salary:', error);
      alert(error.response?.data?.message || 'Failed to update salary.');
    }
  };

  const handleDeleteSalary = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary entry?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/finance/salary/${id}`);
        setSalaryList(response.data.salaries);
        alert('Salary deleted successfully!');
      } catch (error) {
        console.error('Error deleting salary:', error);
        alert(error.response?.data?.message || 'Failed to delete salary.');
      }
    }
  };

  const styles = `
    .salary-page {
      margin-top: 80px; /* Space for the fixed MainNavbar */
      padding: 30px;
      flex-grow: 1;
      background: #ffffff;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }

    .salary-page h1 {
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

    .salary-list {
      margin-top: 30px;
      padding: 25px;
      background: #f5f7fa;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .salary-list h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2a7458;
      font-weight: 600;
      font-size: 1.5rem;
      text-align: center;
    }

    .salary-list table {
      width: 100%;
      border-collapse: collapse;
    }

    .salary-list th,
    .salary-list td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 0.95rem;
      color: #5e6d55;
    }

    .salary-list th {
      color: #2a7458;
      font-weight: 600;
    }

    .salary-list tr:hover {
      background: #e6f0ea;
    }

    .salary-list .action-buttons {
      display: flex;
      gap: 10px;
    }

    .salary-list .action-buttons svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
      transition: transform 0.2s ease;
      padding: 5px;
      border-radius: 4px;
    }

    .salary-list .edit-icon {
      fill: #328e6e;
    }

    .salary-list .edit-icon:hover {
      fill: #46b38a;
      transform: scale(1.2);
      background: #e6f0ea;
    }

    .salary-list .delete-icon {
      fill: #e74c3c;
    }

    .salary-list .delete-icon:hover {
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
      .salary-page {
        margin-top: 120px; /* Adjust for taller MainNavbar */
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="salary-page">
        <h1>Manage Salaries</h1>
        <div className="form-container">
          <h2>{editSalary ? 'Edit Salary' : 'Add Salary'}</h2>
          <form onSubmit={editSalary ? handleUpdateSalary : handleAddSalary}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={editSalary ? editSalary.title : newSalary.title}
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
                value={editSalary ? editSalary.amount : newSalary.amount}
                onChange={handleInputChange}
                required
              />
              {formErrors.amount && <div className="error">{formErrors.amount}</div>}
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={editSalary ? editSalary.date : newSalary.date}
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
                value={editSalary ? editSalary.description : newSalary.description}
                onChange={handleInputChange}
                required
              />
              {formErrors.description && <div className="error">{formErrors.description}</div>}
            </label>
            <button type="submit">{editSalary ? 'Update Salary' : 'Add Salary'}</button>
            {editSalary && (
              <button type="button" className="cancel-button" onClick={() => setEditSalary(null)}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="salary-list">
          <h2>Salary Entries</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : salaryList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title (Employee ID)</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaryList.map((salary) => (
                  <tr key={salary._id}>
                    <td>{salary.employeeId}</td>
                    <td>LKR {salary.amount.toFixed(2)}</td>
                    <td>{salary.description || '-'}</td>
                    <td>{new Date(salary.date).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <svg
                        className="edit-icon"
                        onClick={() => handleEditSalary(salary)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                      <svg
                        className="delete-icon"
                        onClick={() => handleDeleteSalary(salary._id)}
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
            <p>No salary entries found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SalaryPage;