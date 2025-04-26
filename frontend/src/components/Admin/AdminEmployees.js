import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faWallet,
  faSearch,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Validate employee data structure
const isValidEmployeeData = (data) => {
  return data && (
    (Array.isArray(data.employees) && data.employees.every(emp => 
      emp && typeof emp === 'object' && 'id' in emp && 'name' in emp
    )) ||
    (Array.isArray(data) && data.every(emp =>
      emp && typeof emp === 'object' && 'id' in emp && 'name' in emp
    ))
  );
};

const AdminEmployees = () => {
  const [employeesData, setEmployeesData] = useState({
    stats: {
      totalEmployees: 0,
      activeEmployees: 0,
      totalSalaries: 0
    },
    employees: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchEmployeesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch employees from the backend
      const response = await axios.get('http://localhost:5000/employees', config);
      console.log('Raw response:', response.data);

      let employeesList = Array.isArray(response.data) ? response.data : [response.data];

      if (employeesList.length === 0) {
        console.log('No employees found in the response');
        setEmployeesData({
          stats: { totalEmployees: 0, activeEmployees: 0, totalSalaries: 0 },
          employees: []
        });
        return;
      }

      // Transform the data to match our frontend structure
      const validEmployees = employeesList
        .filter(emp => emp && typeof emp === 'object')
        .map(emp => ({
          _id: emp._id || '',
          name: emp.EmployeeName || 'Unknown',
          department: emp.DepartmentName || 'Unassigned',
          position: emp.JobRole || 'Unassigned',
          email: emp.Email || '',
          phone: emp.PhoneNumber ? emp.PhoneNumber.toString() : '',
          salary: emp.BasicSalary || 0,
          status: 'active', // Default to active since it's not in the model
          employeeId: emp.EmployeeId || '',
          bonus: emp.Bonus || 0,
          overtimeHours: emp.OverTimeHours || 0,
          overtimePayment: emp.OverTimePayment || 0,
          netSalary: emp.NetSalary || 0
        }))
        .filter(emp => emp._id && emp.name !== 'Unknown');

      console.log('Processed employees:', validEmployees);

      // Calculate statistics
      const stats = {
        totalEmployees: validEmployees.length,
        activeEmployees: validEmployees.length, // All employees are active in this case
        totalSalaries: validEmployees.reduce((total, emp) => total + emp.netSalary, 0)
      };

      console.log('Employee stats:', stats);

      // Update state with the fetched data
      setEmployeesData({
        stats,
        employees: validEmployees
      });

      setLoading(false);
      setError(null);

    } catch (error) {
      console.error('Error fetching employees:', error);
      
      let errorMessage = 'Failed to fetch employee data. ';
      
      if (!error.response) {
        errorMessage += 'Network error. Please check if the server is running.';
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorMessage += 'Authentication failed. Please log in again.';
        localStorage.removeItem('token');
      } else if (error.response.status === 404) {
        errorMessage += 'No employee data found.';
      } else if (error.response.status >= 500) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      setEmployeesData({
        stats: { totalEmployees: 0, activeEmployees: 0, totalSalaries: 0 },
        employees: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    const maxRetries = 3;
    const timeout = 5000;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: timeout
      };

      const endpoints = [
        `http://localhost:5000/api/admin/employees/${employeeId}/status`,
        `http://localhost:5000/api/employees/${employeeId}`,
        `http://localhost:5000/api/employee/${employeeId}`,
        `http://localhost:5000/api/staff/${employeeId}`
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              await delay(Math.pow(2, attempt) * 1000);
            }

            const response = await axios.patch(endpoint, { status: newStatus }, config);
            
            if (!response.data) {
              throw new Error('Empty response received');
            }

            // Validate the response
            const updatedEmployee = response.data;
            if (!updatedEmployee || typeof updatedEmployee !== 'object' || !updatedEmployee.id) {
              throw new Error('Invalid response format');
            }

            // Update local state
            setEmployeesData(prevData => ({
              ...prevData,
              employees: prevData.employees.map(emp =>
                emp.id === employeeId ? { ...emp, status: newStatus } : emp
              ),
              stats: {
                ...prevData.stats,
                activeEmployees: newStatus === 'active' 
                  ? prevData.stats.activeEmployees + 1 
                  : prevData.stats.activeEmployees - 1
              }
            }));

            toast.success(`Employee status updated to ${newStatus}`);
            return;

          } catch (error) {
            const isTimeout = error.code === 'ECONNABORTED';
            const isNetworkError = !error.response;
            const isServerError = error.response?.status >= 500;
            
            if (!isTimeout && !isNetworkError && !isServerError) {
              throw error;
            }

            console.log(`Attempt ${attempt + 1} failed for ${endpoint}:`, error.message);
            lastError = error;
            
            if (attempt === maxRetries - 1) {
              continue;
            }
          }
        }
      }

      throw lastError || new Error('Failed to update employee status on all endpoints');

    } catch (error) {
      console.error('Error updating employee status:', error);
      const errorMessage = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.response?.data?.message || 'Failed to update employee status';
      
      toast.error(errorMessage);
      
      // Revert any optimistic updates
      await fetchEmployeesData();
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        // Try primary endpoint
        try {
          await axios.delete(`http://localhost:5000/api/admin/employees/${employeeId}`, config);
        } catch (primaryError) {
          // Try fallback endpoint
          await axios.delete(`http://localhost:5000/api/employees/${employeeId}`, config);
        }

        toast.success('Employee deleted successfully');
        fetchEmployeesData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error(error.response?.data?.message || 'Failed to delete employee. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <AdminNavbar />
        <div className="admin-content">
          <div className="admin-employees">
            <div className="loading-container">
              <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
              <p>Loading employees data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <AdminNavbar />
        <div className="admin-content">
          <div className="admin-employees">
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={fetchEmployeesData}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, employees } = employeesData;

  const filteredEmployees = employees.filter(employee =>
    (employee.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (employee.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (employee.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-employees">
          <h1>Employee Management</h1>

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
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          margin-left: 250px;
        }

        .admin-employees {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 600;
        }

        .employee-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .icon {
          font-size: 2rem;
          margin-right: 1rem;
          color: #3498db;
          width: 40px;
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
          font-weight: 500;
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52,152,219,0.1);
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f9fa;
          color: #2c3e50;
          font-weight: 600;
        }

        tbody tr:hover {
          background-color: #f8f9fa;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          min-width: 120px;
        }

        .status-select.active {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-color: #2e7d32;
        }

        .status-select.on_leave {
          background-color: #fff3e0;
          color: #ef6c00;
          border-color: #ef6c00;
        }

        .status-select.inactive {
          background-color: #ffebee;
          color: #c62828;
          border-color: #c62828;
        }

        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
        }

        .action-btn.delete {
          color: #e74c3c;
        }

        .action-btn.delete:hover {
          background-color: #ffebee;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-icon {
          font-size: 3rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #e74c3c;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background-color: #2980b9;
        }

        @media (max-width: 1024px) {
          .admin-content {
            margin-left: 0;
            padding: 1rem;
          }

          .employee-stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .stat-card {
            padding: 1rem;
          }

          th, td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }

          .status-select {
            min-width: 100px;
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEmployees; 