import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faWallet,
  faSearch,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AdminEmployees = () => {
  const [employeesData, setEmployeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployeesData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/admins/employees', config);
      setEmployeesData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees data:', error);
      toast.error('Failed to fetch employees data');
      setLoading(false);
    }
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      await axios.put(
        `http://localhost:5000/api/admins/employees/${employeeId}`,
        { status: newStatus },
        config
      );
      toast.success('Employee status updated successfully');
      fetchEmployeesData();
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast.error('Failed to update employee status');
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
        await axios.delete(`http://localhost:5000/api/admins/employees/${employeeId}`, config);
        toast.success('Employee deleted successfully');
        fetchEmployeesData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  if (loading || !employeesData) {
    return <div>Loading...</div>;
  }

  const { stats, employees } = employeesData;

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-employees">
      <h1>Employees Management</h1>

      <div className="employee-stats">
        <div className="stat-card">
          <FontAwesomeIcon icon={faUsers} className="icon" />
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p>{stats.totalEmployees.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <FontAwesomeIcon icon={faUserCheck} className="icon success" />
          <div className="stat-content">
            <h3>Active Employees</h3>
            <p>{stats.activeEmployees.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <FontAwesomeIcon icon={faWallet} className="icon warning" />
          <div className="stat-content">
            <h3>Total Salaries</h3>
            <p>${stats.totalSalaries.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="employees-content">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, department, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Salary</th>
                <th>Status</th>
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
                    <div>{employee.email}</div>
                    <div>{employee.phone}</div>
                  </td>
                  <td>${employee.salary.toLocaleString()}</td>
                  <td>
                    <select
                      value={employee.status}
                      onChange={(e) => handleStatusChange(employee._id, e.target.value)}
                      className={`status-select ${employee.status}`}
                    >
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-employees {
          padding: 2rem;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
        }

        .employee-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
        }

        .icon.success {
          color: #2ecc71;
        }

        .icon.warning {
          color: #f1c40f;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1rem;
          color: #7f8c8d;
        }

        .stat-content p {
          margin: 0.5rem 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .employees-content {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-bar {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          font-size: 1rem;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .status-select.active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-select.on_leave {
          background-color: #fff3e0;
          color: #ef6c00;
        }

        .status-select.inactive {
          background-color: #ffebee;
          color: #c62828;
        }

        .action-btn {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .action-btn.delete {
          background-color: #ffebee;
          color: #c62828;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .admin-employees {
            padding: 1rem;
          }

          .employee-stats {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          th, td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEmployees; 