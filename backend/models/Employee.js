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
    NetSalary: 0
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate salary components if relevant fields change
    if (['BasicSalary', 'Bonus', 'OverTimeHours'].includes(name)) {
      calculateSalary({
        ...employee,
        [name]: value
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

    setEmployee(prev => ({
      ...prev,
      EPF_ETF: totalEpfEtf,
      OverTimePayment: overtimePayment,
      NetSalary: netSalary
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Convert number fields to actual numbers
      const employeeToSend = {
        ...employee,
        PhoneNumber: parseInt(employee.PhoneNumber),
        BasicSalary: parseFloat(employee.BasicSalary),
        Bonus: parseFloat(employee.Bonus),
        OverTimeHours: parseFloat(employee.OverTimeHours)
      };

      const response = await axios.post('/employees', employeeToSend);
      
      setSuccessMessage('Employee added successfully!');
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
        NetSalary: 0
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding employee');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add New Employee</h1>
      
      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="EmployeeName" style={styles.label}>Employee Name</label>
            <input
              type="text"
              id="EmployeeName"
              name="EmployeeName"
              value={employee.EmployeeName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="EmployeeId" style={styles.label}>Employee ID</label>
            <input
              type="text"
              id="EmployeeId"
              name="EmployeeId"
              value={employee.EmployeeId}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="DepartmentName" style={styles.label}>Department</label>
            <select
              id="DepartmentName"
              name="DepartmentName"
              value={employee.DepartmentName}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Department</option>
              <option value="HR">Human Resources</option>
              <option value="IT">Information Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="JobRole" style={styles.label}>Job Role</label>
            <input
              type="text"
              id="JobRole"
              name="JobRole"
              value={employee.JobRole}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label htmlFor="PhoneNumber" style={styles.label}>Phone Number</label>
            <input
              type="text"
              id="PhoneNumber"
              name="PhoneNumber"
              value={employee.PhoneNumber}
              onChange={handleChange}
              required
              style={styles.input}
              pattern="[0-9]{10}"
              title="10-digit phone number"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="Email" style={styles.label}>Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={employee.Email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>
        
        <div style={styles.salarySection}>
          <h3 style={styles.sectionHeading}>Salary Information</h3>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="BasicSalary" style={styles.label}>Basic Salary (LKR)</label>
              <input
                type="number"
                id="BasicSalary"
                name="BasicSalary"
                value={employee.BasicSalary}
                onChange={handleChange}
                required
                style={styles.input}
                min="0"
                step="0.01"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="Bonus" style={styles.label}>Bonus (LKR)</label>
              <input
                type="number"
                id="Bonus"
                name="Bonus"
                value={employee.Bonus}
                onChange={handleChange}
                style={styles.input}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="OverTimeHours" style={styles.label}>Overtime Hours</label>
              <input
                type="number"
                id="OverTimeHours"
                name="OverTimeHours"
                value={employee.OverTimeHours}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="OverTimePayment" style={styles.label}>Overtime Payment (LKR)</label>
              <input
                type="number"
                id="OverTimePayment"
                name="OverTimePayment"
                value={employee.OverTimePayment.toFixed(2)}
                readOnly
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="EPF_ETF" style={styles.label}>EPF + ETF (LKR)</label>
              <input
                type="number"
                id="EPF_ETF"
                name="EPF_ETF"
                value={employee.EPF_ETF.toFixed(2)}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="NetSalary" style={styles.label}>Net Salary (LKR)</label>
              <input
                type="number"
                id="NetSalary"
                name="NetSalary"
                value={employee.NetSalary.toFixed(2)}
                readOnly
                style={styles.input}
              />
            </div>
          </div>
        </div>
        
        <button type="submit" style={styles.submitButton}>Add Employee</button>
      </form>
    </div>
  );
};

// Internal CSS styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    flex: '1',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  salarySection: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    borderLeft: '4px solid #3498db',
  },
  sectionHeading: {
    marginTop: '0',
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  successMessage: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};

export default AddEmployeeForm;