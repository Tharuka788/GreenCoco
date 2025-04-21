// src/components/Employee/AddEmployeeForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddEmployeeForm = () => {
  const [employee, setEmployee] = useState({
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
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (['BasicSalary', 'Bonus', 'OverTimeHours'].includes(name)) {
      calculateSalary({
        ...employee,
        [name]: value,
      });
    }
  };

  const calculateSalary = (empData) => {
    const basicSalary = parseFloat(empData.BasicSalary) || 0;
    const bonus = parseFloat(empData.Bonus) || 0;
    const overtimeHours = parseFloat(empData.OverTimeHours) || 0;
    const overtimeRate = 500; // LKR per hour

    const epf = basicSalary * 0.08;
    const etf = basicSalary * 0.03;
    const totalEpfEtf = epf + etf;

    const overtimePayment = overtimeHours * overtimeRate;
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
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const employeeToSend = {
        ...employee,
        PhoneNumber: parseInt(employee.PhoneNumber) || 0,
        BasicSalary: parseFloat(employee.BasicSalary) || 0,
        Bonus: parseFloat(employee.Bonus) || 0,
        OverTimeHours: parseFloat(employee.OverTimeHours) || 0,
      };

      const response = await axios.post('http://localhost:5000/employees', employeeToSend);

      setSuccessMessage('Employee added successfully!');
      setEmployee({
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
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setEmployee({
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
      });
    }
  };

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .add-employee-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      font-family: 'Poppins', sans-serif;
    }

    .add-employee-container h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .success-message,
    .error-message {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
      animation: fadeIn 0.3s ease-in;
    }

    .success-message {
      background: #28a745;
      color: white;
    }

    .error-message {
      background: #dc3545;
      color: white;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .form-group {
      flex: 1;
      min-width: 200px;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2a7458;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #328e6e;
      box-shadow: 0 0 0 3px rgba(50, 142, 110, 0.1);
      outline: none;
    }

    .form-group input[readonly] {
      background: #f1f3f5;
      cursor: not-allowed;
    }

    .salary-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #328e6e;
      margin-bottom: 1.5rem;
    }

    .salary-section h3 {
      margin: 0 0 1rem;
      color: #2a7458;
      font-size: 1.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .form-actions button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .form-actions button[type='submit'] {
      background: #328e6e;
      color: white;
    }

    .form-actions button[type='submit']:hover {
      background: #46b38a;
      transform: translateY(-2px);
    }

    .form-actions button[type='button'] {
      background: #6c757d;
      color: white;
    }

    .form-actions button[type='button']:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    .form-actions button:disabled {
      background: #adb5bd;
      cursor: not-allowed;
      transform: none;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .add-employee-container {
        padding: 1.5rem;
      }

      .add-employee-container h1 {
        font-size: 1.8rem;
      }

      .form-row {
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        min-width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div className="add-employee-container">
        <h1>Add New Employee</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="EmployeeName">Employee Name</label>
              <input
                type="text"
                id="EmployeeName"
                name="EmployeeName"
                value={employee.EmployeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="EmployeeId">Employee ID</label>
              <input
                type="text"
                id="EmployeeId"
                name="EmployeeId"
                value={employee.EmployeeId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="DepartmentName">Department</label>
              <select
                id="DepartmentName"
                name="DepartmentName"
                value={employee.DepartmentName}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="HR">Human Resources</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="JobRole">Job Role</label>
              <input
                type="text"
                id="JobRole"
                name="JobRole"
                value={employee.JobRole}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="PhoneNumber">Phone Number</label>
              <input
                type="text"
                id="PhoneNumber"
                name="PhoneNumber"
                value={employee.PhoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={employee.Email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="salary-section">
            <h3>Salary Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="BasicSalary">Basic Salary (LKR)</label>
                <input
                  type="number"
                  id="BasicSalary"
                  name="BasicSalary"
                  value={employee.BasicSalary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Bonus">Bonus (LKR)</label>
                <input
                  type="number"
                  id="Bonus"
                  name="Bonus"
                  value={employee.Bonus}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="OverTimeHours">Overtime Hours</label>
                <input
                  type="number"
                  id="OverTimeHours"
                  name="OverTimeHours"
                  value={employee.OverTimeHours}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="OverTimePayment">Overtime Payment (LKR)</label>
                <input
                  type="number"
                  id="OverTimePayment"
                  name="OverTimePayment"
                  value={employee.OverTimePayment.toFixed(2)}
                  readOnly
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="EPF_ETF">EPF + ETF (LKR)</label>
                <input
                  type="number"
                  id="EPF_ETF"
                  name="EPF_ETF"
                  value={employee.EPF_ETF.toFixed(2)}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="NetSalary">Net Salary (LKR)</label>
                <input
                  type="number"
                  id="NetSalary"
                  name="NetSalary"
                  value={employee.NetSalary.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </button>
            <button type="button" onClick={handleReset} disabled={isSubmitting}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployeeForm;