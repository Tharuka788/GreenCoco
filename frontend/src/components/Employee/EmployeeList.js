// src/components/Employee/EmployeeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching employees');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .employee-list-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      font-family: 'Poppins', sans-serif;
    }

    .employee-list-container h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .employee-table th,
    .employee-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .employee-table th {
      background: #328e6e;
      color: white;
      font-weight: 600;
    }

    .employee-table tr:hover {
      background: #f8f9fa;
    }

    .edit-button,
    .delete-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .edit-button {
      background: #ffc107;
      color: #212529;
      margin-right: 0.5rem;
    }

    .edit-button:hover {
      background: #e0a800;
      transform: translateY(-2px);
    }

    .delete-button {
      background: #dc3545;
      color: white;
    }

    .delete-button:hover {
      background: #c82333;
      transform: translateY(-2px);
    }

    .loading,
    .error-message {
      text-align: center;
      padding: 2rem;
      font-size: 1.2rem;
    }

    .loading {
      color: #2a7458;
    }

    .error-message {
      color: #dc3545;
    }

    .no-employees {
      text-align: center;
      font-size: 1.1rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .employee-list-container {
        padding: 1.5rem;
      }

      .employee-list-container h1 {
        font-size: 1.8rem;
      }

      .employee-table {
        display: block;
        overflow-x: auto;
      }

      .employee-table th,
      .employee-table td {
        min-width: 120px;
      }
    }
  `;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div className="employee-list-container">
        <h1>Employee List</h1>
        {employees.length === 0 ? (
          <p className="no-employees">No employees found.</p>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Job Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Net Salary (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.EmployeeName}</td>
                  <td>{emp.EmployeeId}</td>
                  <td>{emp.DepartmentName}</td>
                  <td>{emp.JobRole}</td>
                  <td>{emp.Email}</td>
                  <td>{emp.PhoneNumber}</td>
                  <td>{emp.NetSalary.toFixed(2)}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => alert('Edit functionality coming soon!')}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default EmployeeList;