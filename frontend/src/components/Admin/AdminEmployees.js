import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faUserClock,
  faMoneyBillWave,
  faSearch,
  faEdit,
  faTrash,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

const AdminEmployees = () => {
  const [employeeData, setEmployeeData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    totalSalaries: 0,
    employees: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5000/api/admin/employees', config);
      setEmployeeData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Failed to fetch employee data');
      setIsLoading(false);
    }
  };

  const handleEdit = (employeeId) => {
    // Implement edit functionality
    console.log('Edit employee:', employeeId);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5000/api/admin/employees/${employeeId}`, config);
        toast.success('Employee deleted successfully');
        fetchEmployeeData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  const filteredEmployees = employeeData.employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = `
    .admin-employees {
      padding: 2rem;
      margin-left: 280px;
    }

    .employees-header {
      margin-bottom: 2rem;
    }

    .employees-title {
      font-size: 2rem;
      color: #2a7458;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.5rem;
      color: #2a7458;
    }

    .stat-title {
      font-size: 1.1rem;
      color: #666;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2a7458;
    }

    .employees-content {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-bar {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: none;
      padding: 0.5rem;
      font-size: 1rem;
      color: #333;
      outline: none;
    }

    .search-icon {
      color: #666;
    }

    .add-button {
      background: #2a7458;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;
      font-size: 1rem;
    }

    .add-button:hover {
      background: #1e5c41;
    }

    .employees-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .employees-table th,
    .employees-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .employees-table th {
      background: #f8f9fa;
      color: #2a7458;
      font-weight: 600;
    }

    .employees-table tr:hover {
      background: #f8f9fa;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .status-active {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-on-leave {
      background: #fff3e0;
      color: #f57c00;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .edit-button {
      color: #2196f3;
    }

    .edit-button:hover {
      color: #1976d2;
    }

    .delete-button {
      color: #f44336;
    }

    .delete-button:hover {
      color: #d32f2f;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      font-size: 1.2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .admin-employees {
        margin-left: 0;
        padding: 1rem;
      }

      .employees-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .employees-table {
        font-size: 0.9rem;
      }

      .employees-table th,
      .employees-table td {
        padding: 0.75rem 0.5rem;
      }

      .add-button {
        padding: 0.5rem 1rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <AdminNavbar />
        <div className="admin-employees">
          <div className="loading">Loading employee data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <AdminNavbar />
      <div className="admin-employees">
        <div className="employees-header">
          <h1 className="employees-title">Employee Management</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faUsers} className="stat-icon" />
              <h3 className="stat-title">Total Employees</h3>
            </div>
            <p className="stat-value">{employeeData.totalEmployees}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faUserCheck} className="stat-icon" />
              <h3 className="stat-title">Active Employees</h3>
            </div>
            <p className="stat-value">{employeeData.activeEmployees}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faUserClock} className="stat-icon" />
              <h3 className="stat-title">On Leave</h3>
            </div>
            <p className="stat-value">{employeeData.onLeaveEmployees}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <FontAwesomeIcon icon={faMoneyBillWave} className="stat-icon" />
              <h3 className="stat-title">Total Salaries</h3>
            </div>
            <p className="stat-value">${employeeData.totalSalaries.toLocaleString()}</p>
          </div>
        </div>

        <div className="employees-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, department, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button">
              <FontAwesomeIcon icon={faUserPlus} />
              Add Employee
            </button>
          </div>

          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        employee.status === 'active' ? 'status-active' : 'status-on-leave'
                      }`}
                    >
                      {employee.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td>${employee.salary.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(employee._id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(employee._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminEmployees; 