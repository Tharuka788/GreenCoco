import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

const AddEmployeeForm = ({ onSuccess, editingEmployee, onUpdate }) => {
  const initialState = {
    EmployeeName: '',
    DepartmentName: '',
    EmployeeId: '',
    PhoneNumber: '',
    Email: '',
    JobRole: '',
    BasicSalary: '',
    Bonus: 0,
    OverTimeHours: 0,
    OverTimePayment: 0,
    EPF_ETF: 0,
    NetSalary: 0,
  };

  const [employee, setEmployee] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEmployee) {
      setEmployee(editingEmployee);
      setErrors({}); // Clear any existing errors when editing
    } else {
      setEmployee(initialState);
    }
  }, [editingEmployee]);

  const resetForm = () => {
    setEmployee(initialState);
    setErrors({});
    setSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    onUpdate(null); // Notify parent component to exit edit mode
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Employee Name: only letters (no numbers or symbols)
    if (!employee.EmployeeName.trim()) {
      newErrors.EmployeeName = 'Employee name is required';
    } else if (!/^[A-Za-z ]+$/.test(employee.EmployeeName.trim())) {
      newErrors.EmployeeName = 'Employee name can only contain letters and spaces';
    }

    if (!employee.EmployeeId.trim()) {
      newErrors.EmployeeId = 'Employee ID is required';
    }

    if (!employee.DepartmentName) {
      newErrors.DepartmentName = 'Department is required';
    }

    // Job Role: only letters (no numbers or symbols)
    if (!employee.JobRole.trim()) {
      newErrors.JobRole = 'Job role is required';
    } else if (!/^[A-Za-z ]+$/.test(employee.JobRole.trim())) {
      newErrors.JobRole = 'Job role can only contain letters and spaces';
    }

    // Phone Number: only numbers, exactly 10 digits
    if (!employee.PhoneNumber) {
      newErrors.PhoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(employee.PhoneNumber)) {
      newErrors.PhoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (!employee.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!employee.Email.includes('@')) {
      newErrors.Email = 'Email must contain @ symbol';
    } else if (!/\S+@\S+\.\S+/.test(employee.Email)) {
      newErrors.Email = 'Invalid email format';
    }

    if (!employee.BasicSalary || employee.BasicSalary <= 0) {
      newErrors.BasicSalary = 'Basic salary must be greater than 0';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // Employee Name: only letters and spaces
    if (name === 'EmployeeName') {
      newValue = newValue.replace(/[^A-Za-z ]/g, '');
    }
    // Job Role: only letters and spaces
    if (name === 'JobRole') {
      newValue = newValue.replace(/[^A-Za-z ]/g, '');
    }
    // Phone Number: only numbers, max 10 digits
    if (name === 'PhoneNumber') {
      newValue = newValue.replace(/[^0-9]/g, '').slice(0, 10);
    }
    setEmployee((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Recalculate salary components if relevant fields change
    if (['BasicSalary', 'Bonus', 'OverTimeHours'].includes(name)) {
      calculateSalary({
        ...employee,
        [name]: newValue,
      });
    }
  };

  const calculateSalary = (empData) => {
    const basicSalary = parseFloat(empData.BasicSalary) || 0;
    const bonus = parseFloat(empData.Bonus) || 0;
    const overtimeHours = parseFloat(empData.OverTimeHours) || 0;
    const overtimeRate = 500; // LKR per hour

    // Calculate EPF (8%) and ETF (3%)
    const epf = basicSalary * 0.08;
    const etf = basicSalary * 0.03;
    const totalEpfEtf = epf + etf;

    // Calculate overtime payment
    const overtimePayment = overtimeHours * overtimeRate;

    // Calculate net salary
    const netSalary = basicSalary + bonus + overtimePayment - totalEpfEtf;

    setEmployee((prev) => ({
      ...prev,
      EPF_ETF: totalEpfEtf,
      OverTimePayment: overtimePayment,
      NetSalary: netSalary,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const employeeData = {
        ...employee,
        PhoneNumber: parseInt(employee.PhoneNumber),
        BasicSalary: parseFloat(employee.BasicSalary),
        Bonus: parseFloat(employee.Bonus),
        OverTimeHours: parseFloat(employee.OverTimeHours),
      };

      let response;
      if (editingEmployee) {
        response = await axios.put(`/employees/${editingEmployee._id}`, employeeData);
        onUpdate(response.data);
        toast.success('Employee updated successfully!');
      } else {
        response = await axios.post('/employees', employeeData);
        onSuccess(response.data);
      }

      setEmployee(initialState);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.code === 11000 ? 'Employee ID or Email already exists' : 'Failed to save employee');
      toast.error(errorMessage);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .add-employee-form {
      max-width: 800px;
      margin: 24px auto;
      padding: 24px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      font-family: 'Poppins', sans-serif;
    }

    .form-heading {
      font-size: 1.75rem;
      font-weight: 600;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #2a7458;
      box-shadow: 0 0 0 2px rgba(42, 116, 88, 0.2);
    }

    .form-input[readonly] {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .salary-section {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 24px;
      border-left: 4px solid #2a7458;
    }

    .salary-heading {
      font-size: 1.25rem;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 24px;
    }

    .submit-button,
    .cancel-button {
      width: 200px;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .submit-button {
      background: #2a7458;
      color: white;
    }

    .submit-button:hover {
      background: #3b9c73;
    }

    .submit-button:disabled {
      background: #a0a0a0;
      cursor: not-allowed;
    }

    .cancel-button {
      background: #e74c3c;
      color: white;
    }

    .cancel-button:hover {
      background: #c0392b;
    }

    @media (max-width: 768px) {
      .add-employee-form {
        margin: 16px;
        padding: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-heading {
        font-size: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .submit-button,
      .cancel-button {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="add-employee-form">
        <h2 className="form-heading">
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="EmployeeName" className="form-label">
                Employee Name
              </label>
              <input
                type="text"
                id="EmployeeName"
                name="EmployeeName"
                value={employee.EmployeeName}
                onChange={handleChange}
                className={`form-input ${errors.EmployeeName ? 'error' : ''}`}
              />
              {errors.EmployeeName && (
                <div className="error-message">{errors.EmployeeName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="EmployeeId" className="form-label">
                Employee ID
              </label>
              <input
                type="text"
                id="EmployeeId"
                name="EmployeeId"
                value={employee.EmployeeId}
                onChange={handleChange}
                className={`form-input ${errors.EmployeeId ? 'error' : ''}`}
              />
              {errors.EmployeeId && (
                <div className="error-message">{errors.EmployeeId}</div>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="DepartmentName" className="form-label">
                Department
              </label>
              <select
                id="DepartmentName"
                name="DepartmentName"
                value={employee.DepartmentName}
                onChange={handleChange}
                className={`form-select ${errors.DepartmentName ? 'error' : ''}`}
              >
                <option value="">Select Department</option>
                <option value="HR">Human Resources</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.DepartmentName && (
                <div className="error-message">{errors.DepartmentName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="JobRole" className="form-label">
                Job Role
              </label>
              <input
                type="text"
                id="JobRole"
                name="JobRole"
                value={employee.JobRole}
                onChange={handleChange}
                className={`form-input ${errors.JobRole ? 'error' : ''}`}
              />
              {errors.JobRole && (
                <div className="error-message">{errors.JobRole}</div>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="PhoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                id="PhoneNumber"
                name="PhoneNumber"
                value={employee.PhoneNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="10-digit phone number"
                className={`form-input ${errors.PhoneNumber ? 'error' : ''}`}
              />
              {errors.PhoneNumber && (
                <div className="error-message">{errors.PhoneNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={employee.Email}
                onChange={handleChange}
                className={`form-input ${errors.Email ? 'error' : ''}`}
              />
              {errors.Email && (
                <div className="error-message">{errors.Email}</div>
              )}
            </div>
          </div>

          <div className="salary-section">
            <h3 className="salary-heading">Salary Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="BasicSalary" className="form-label">
                  Basic Salary (LKR)
                </label>
                <input
                  type="number"
                  id="BasicSalary"
                  name="BasicSalary"
                  value={employee.BasicSalary}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`form-input ${errors.BasicSalary ? 'error' : ''}`}
                />
                {errors.BasicSalary && (
                  <div className="error-message">{errors.BasicSalary}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Bonus" className="form-label">
                  Bonus (LKR)
                </label>
                <input
                  type="number"
                  id="Bonus"
                  name="Bonus"
                  value={employee.Bonus}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="OverTimeHours" className="form-label">
                  Overtime Hours
                </label>
                <input
                  type="number"
                  id="OverTimeHours"
                  name="OverTimeHours"
                  value={employee.OverTimeHours}
                  onChange={handleChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="OverTimePayment" className="form-label">
                  Overtime Payment (LKR)
                </label>
                <input
                  type="number"
                  id="OverTimePayment"
                  name="OverTimePayment"
                  value={employee.OverTimePayment.toFixed(2)}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="EPF_ETF" className="form-label">
                  EPF + ETF (LKR)
                </label>
                <input
                  type="number"
                  id="EPF_ETF"
                  name="EPF_ETF"
                  value={employee.EPF_ETF.toFixed(2)}
                  readOnly
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="NetSalary" className="form-label">
                  Net Salary (LKR)
                </label>
                <input
                  type="number"
                  id="NetSalary"
                  name="NetSalary"
                  value={employee.NetSalary.toFixed(2)}
                  readOnly
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
            {editingEmployee && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployeeForm;