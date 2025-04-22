import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

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

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Recalculate salary components if relevant fields change
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
    setSubmitting(true);

    try {
      // Convert number fields to actual numbers
      const employeeToSend = {
        ...employee,
        PhoneNumber: parseInt(employee.PhoneNumber) || 0,
        BasicSalary: parseFloat(employee.BasicSalary) || 0,
        Bonus: parseFloat(employee.Bonus) || 0,
        OverTimeHours: parseFloat(employee.OverTimeHours) || 0,
      };

      await axios.post('/employees', employeeToSend);
      
      toast.success('Employee added successfully!');
      // Reset form
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding employee');
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

    .submit-button {
      display: block;
      width: 200px;
      margin: 0 auto;
      padding: 12px;
      background: #2a7458;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
    }

    .submit-button:hover {
      background: #3b9c73;
    }

    .submit-button:disabled {
      background: #a0a0a0;
      cursor: not-allowed;
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

      .submit-button {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="add-employee-form">
        <h2 className="form-heading">Add New Employee</h2>
        
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
                required
                className="form-input"
              />
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
                required
                className="form-input"
              />
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
                required
                className="form-select"
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
              <label htmlFor="JobRole" className="form-label">
                Job Role
              </label>
              <input
                type="text"
                id="JobRole"
                name="JobRole"
                value={employee.JobRole}
                onChange={handleChange}
                required
                className="form-input"
              />
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
                required
                pattern="[0-9]{10}"
                title="10-digit phone number"
                className="form-input"
              />
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
                required
                className="form-input"
              />
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
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
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

          <button
            type="submit"
            disabled={submitting}
            className="submit-button"
          >
            {submitting ? 'Adding...' : 'Add Employee'}
          </button>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default AddEmployeeForm;