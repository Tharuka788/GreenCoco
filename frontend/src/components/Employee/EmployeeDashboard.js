import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployeeForm from './AddEmployeeForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set axios base URL to avoid 404 errors
axios.defaults.baseURL = 'http://localhost:5000';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees...');
      const response = await axios.get('/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch employees');
      setLoading(false);
      toast.error('Failed to fetch employees');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/employees/${id}`);
        setEmployees(employees.filter((employee) => employee._id !== id));
        toast.success('Employee deleted successfully');
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .employee-dashboard {
      max-width: 1200px;
      margin: 100px auto 20px;
      padding: 20px;
      font-family: 'Poppins', sans-serif;
      background: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 600;
    }

    .add-button {
      background-color: #2a7458;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.3s;
    }

    .add-button:hover {
      background-color: #3b9c73;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .employee-table th,
    .employee-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .employee-table th {
      background: #2a7458;
      color: white;
      font-weight: 600;
    }

    .employee-table tr:hover {
      background: #f1f1f1;
    }

    .action-buttons button {
      background: none;
      border: none;
      cursor: pointer;
      margin-right: 10px;
      font-size: 1.2rem;
    }

    .action-buttons .edit {
      color: #3498db;
    }

    .action-buttons .delete {
      color: #e74c3c;
    }

    .loading,
    .error {
      text-align: center;
      color: #2c3e50;
      font-size: 1.2rem;
      margin: 20px 0;
    }

    @media (max-width: 768px) {
      .employee-dashboard {
        margin: 120px auto 20px;
        padding: 10px;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .employee-table th,
      .employee-table td {
        padding: 10px;
        font-size: 0.9rem;
      }

      .add-button {
        padding: 8px 15px;
        font-size: 0.9rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="employee-dashboard">
        <div className="dashboard-header">
          <h1>
            <FontAwesomeIcon icon={faUsers} /> Employee Dashboard
          </h1>
          <button className="add-button" onClick={toggleAddForm}>
            <FontAwesomeIcon icon={faPlus} /> {showAddForm ? 'Close Form' : 'Add Employee'}
          </button>
        </div>

        {showAddForm && <AddEmployeeForm />}

        {loading && <div className="loading">Loading employees...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Job Role</th>
                <th>Net Salary (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No employees found
                </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.EmployeeName}</td>
                    <td>{employee.EmployeeId}</td>
                    <td>{employee.DepartmentName}</td>
                    <td>{employee.JobRole}</td>
                    <td>{employee.NetSalary.toFixed(2)}</td>
                    <td className="action-buttons">
                      <button className="edit" title="Edit Employee">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="delete"
                        title="Delete Employee"
                        onClick={() => handleDelete(employee._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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

export default EmployeeDashboard;