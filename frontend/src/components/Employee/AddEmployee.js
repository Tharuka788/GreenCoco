import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    EmployeeName: '',
    DepartmentName: '',
    EmployeeId: '',
    PhoneNumber: '',
    Email: '',
    JobRole: '',
    BasicSalary: '',
    Bonus: '',
    OverTimeHours: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict EmployeeName, DepartmentName, and JobRole to letters and spaces only
    if (name === 'EmployeeName' || name === 'DepartmentName' || name === 'JobRole') {
      if (!/^[a-zA-Z\s]*$/.test(value)) return; // Allow only letters and spaces
    }

    // Restrict PhoneNumber to 10 digits
    if (name === 'PhoneNumber') {
      if (!/^\d*$/.test(value)) return; // Allow only digits
      if (value.length > 10) return; // Prevent more than 10 digits
    }

    setEmployee({ ...employee, [name]: value });
    // Clear the error for the field when the user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Validate Employee Name
    if (!employee.EmployeeName.trim()) {
      // newErrors.EmployeeName = 'Employee Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(employee.EmployeeName)) {
      newErrors.EmployeeName = 'Employee Name must contain only letters and spaces';
    }

    // Validate Department Name
    if (!employee.DepartmentName.trim()) {
      newErrors.DepartmentName = 'Department Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(employee.DepartmentName)) {
      newErrors.DepartmentName = 'Department Name must contain only letters and spaces';
    }

    // Validate Employee ID
    if (!employee.EmployeeId.trim()) {
      newErrors.EmployeeId = 'Employee ID is required';
    }

    // Validate Phone Number
    if (!employee.PhoneNumber.trim()) {
      newErrors.PhoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(employee.PhoneNumber)) {
      newErrors.PhoneNumber = 'Phone Number must be exactly 10 digits';
    }

    // Validate Email
    if (!employee.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.Email)) {
      newErrors.Email = 'Invalid email format';
    }

    // Validate Job Role
    if (!employee.JobRole.trim()) {
      newErrors.JobRole = 'Job Role is required';
    } else if (!/^[a-zA-Z\s]+$/.test(employee.JobRole)) {
      newErrors.JobRole = 'Job Role must contain only letters and spaces';
    }

    // Validate Basic Salary
    if (!employee.BasicSalary || employee.BasicSalary <= 0) {
      newErrors.BasicSalary = 'Basic Salary must be greater than 0';
    }

    // Validate Bonus (optional, but must be non-negative if provided)
    if (employee.Bonus && employee.Bonus < 0) {
      newErrors.Bonus = 'Bonus cannot be negative';
    }

    // Validate OverTimeHours (optional, but must be non-negative if provided)
    if (employee.OverTimeHours && employee.OverTimeHours < 0) {
      newErrors.OverTimeHours = 'Overtime Hours cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors before submitting.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/employees/', employee, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Employee added successfully!');
      navigate('/');
    } catch (error) {
      alert('Error adding employee: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="employee-form">
      <style jsx>{`
        /* Container for the form */
        .employee-form {
          max-width: 800px;
          margin: 2rem auto;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 10px;
          box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .employee-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        /* Title styling */
        .employee-form h2 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: 600;
        }

        /* Fieldset styling */
        fieldset {
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 1rem;
          padding: 1rem;
        }

        legend {
          padding: 0 0.5rem;
          color: #34495e;
          font-weight: 600;
        }

        /* Form group styling */
        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        /* Input fields styling */
        input[type="text"],
        input[type="email"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        /* Error message styling */
        .error-text {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }

        /* Form actions container */
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        /* Button styling */
        button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .submit-btn {
          background-color: #48bb78;
          color: white;
        }

        .submit-btn:hover {
          background-color: #3aa76d;
        }

        .cancel-btn {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .cancel-btn:hover {
          background-color: #cbd5e0;
        }
      `}</style>

      <h2>Add Employee Details</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personal Information</legend>
          <div className="form-group">
            <label>Employee Name</label>
            <input type="text" name="EmployeeName" value={employee.EmployeeName} onChange={handleChange} required />
            {errors.EmployeeName && <span className="error-text">{errors.EmployeeName}</span>}
          </div>
          <div className="form-group">
            <label>Department Name</label>
            <input type="text" name="DepartmentName" value={employee.DepartmentName} onChange={handleChange} required />
            {errors.DepartmentName && <span className="error-text">{errors.DepartmentName}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact Details</legend>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="PhoneNumber"
              value={employee.PhoneNumber}
              onChange={handleChange}
              maxLength="10"
              required
            />
            {errors.PhoneNumber && <span className="error-text">{errors.PhoneNumber}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="Email" value={employee.Email} onChange={handleChange} required />
            {errors.Email && <span className="error-text">{errors.Email}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Job Information</legend>
          <div className="form-group">
            <label>Employee ID</label>
            <input type="text" name="EmployeeId" value={employee.EmployeeId} onChange={handleChange} required />
            {errors.EmployeeId && <span className="error-text">{errors.EmployeeId}</span>}
          </div>
          <div className="form-group">
            <label>Job Role</label>
            <input type="text" name="JobRole" value={employee.JobRole} onChange={handleChange} required />
            {errors.JobRole && <span className="error-text">{errors.JobRole}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Salary & Benefits</legend>
          <div className="form-group">
            <label>Basic Salary</label>
            <input type="number" name="BasicSalary" value={employee.BasicSalary} onChange={handleChange} required />
            {errors.BasicSalary && <span className="error-text">{errors.BasicSalary}</span>}
          </div>
          <div className="form-group">
            <label>Bonus</label>
            <input type="number" name="Bonus" value={employee.Bonus} onChange={handleChange} />
            {errors.Bonus && <span className="error-text">{errors.Bonus}</span>}
          </div>
          <div className="form-group">
            <label>Overtime Hours</label>
            <input type="number" name="OverTimeHours" value={employee.OverTimeHours} onChange={handleChange} />
            {errors.OverTimeHours && <span className="error-text">{errors.OverTimeHours}</span>}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Employee</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;