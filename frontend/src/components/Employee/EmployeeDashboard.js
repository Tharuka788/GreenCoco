import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployeeForm from './AddEmployeeForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus, faEdit, faTrash, faFileExport, faUserClock, faMoneyBillTransfer, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

// Set axios base URL and default headers
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch employees. Please try again later.');
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const toastId = toast.loading('Deleting employee...');
  
      try {
        await axios.delete(`/employees/${id}`);
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee._id !== id)
        );
        toast.update(toastId, {
          render: 'Employee deleted successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        });
      } catch (err) {
        console.error('Delete error:', err);
        toast.update(toastId, {
          render: err.response?.data?.message || 'Failed to delete employee',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        });
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowAddForm(true);
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    if (updatedEmployee) {
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp._id === updatedEmployee._id ? updatedEmployee : emp
        )
      );
      toast.success('Employee updated successfully!');
    }
    setEditingEmployee(null);
    setShowAddForm(false);
  };

  const handleAddSuccess = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setShowAddForm(false);
    toast.success('Employee added successfully!');
  };

  const toggleAddForm = () => {
    if (showAddForm) {
      setEditingEmployee(null);
    }
    setShowAddForm(!showAddForm);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentFilter = (e) => {
    setFilterDepartment(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Job Role', 'Net Salary'];
    const data = filteredEmployees.map(emp => [
      emp.EmployeeName,
      emp.EmployeeId,
      emp.DepartmentName,
      emp.JobRole,
      emp.NetSalary.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendToFinancialDashboard = async () => {
    const toastId = toast.loading('Sending data to financial dashboard...');
    
    try {
      const salaryData = employees.map(emp => ({
        employeeId: emp.EmployeeId,
        employeeName: emp.EmployeeName,
        department: emp.DepartmentName,
        salary: emp.NetSalary,
        date: new Date().toISOString()
      }));

      await axios.post('/api/finance/salary-data', salaryData);
      
      toast.update(toastId, {
        render: 'Data sent to financial dashboard successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
      });
    } catch (err) {
      console.error('Error sending data to financial dashboard:', err);
      toast.update(toastId, {
        render: err.response?.data?.message || 'Failed to send data to financial dashboard',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
      });
    }
  };

  const downloadSalaryPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Employee Salary Information', 20, 20);
    
    // Add current date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add table headers
    const headers = ['Name', 'ID', 'Department', 'Job Role', 'Basic Salary', 'Net Salary'];
    let yPos = 40;
    const xPos = [20, 70, 100, 130, 160, 190];
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, xPos[i], yPos);
    });
    
    // Add table content
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    
    filteredEmployees.forEach((emp) => {
      // Check if we need a new page
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      
      const row = [
        emp.EmployeeName.substring(0, 15),
        emp.EmployeeId,
        emp.DepartmentName.substring(0, 12),
        emp.JobRole.substring(0, 12),
        emp.BasicSalary.toFixed(2),
        emp.NetSalary.toFixed(2)
      ];
      
      row.forEach((text, i) => {
        doc.text(String(text), xPos[i], yPos);
      });
      
      yPos += 10;
    });
    
    // Save the PDF
    doc.save('employee_salary_information.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.EmployeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.JobRole.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === '' || employee.DepartmentName === filterDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      if (sortConfig.key === 'NetSalary') {
        return (a[sortConfig.key] - b[sortConfig.key]) * direction;
      }
      return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
    });

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

    .employee-dashboard {
      max-width: 1200px;
      margin: 100px auto 20px;
      padding: 30px;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(42, 116, 88, 0.1);
    }

    .dashboard-header h1 {
      color: #2c3e50;
      font-size: 2.2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .dashboard-header h1 svg {
      color: #2a7458;
      font-size: 2rem;
    }

    .header-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .add-button, .export-button, .pdf-button, .finance-button {
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 500;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      border: none;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .add-button {
      background: linear-gradient(145deg, #2a7458, #3b9c73);
    }

    .add-button:hover {
      background: linear-gradient(145deg, #3b9c73, #2a7458);
      transform: translateY(-2px);
    }

    .export-button {
      background: linear-gradient(145deg, #3498db, #2980b9);
    }

    .export-button:hover {
      background: linear-gradient(145deg, #2980b9, #3498db);
      transform: translateY(-2px);
    }

    .pdf-button {
      background: linear-gradient(145deg, #e74c3c, #c0392b);
    }

    .pdf-button:hover {
      background: linear-gradient(145deg, #c0392b, #e74c3c);
      transform: translateY(-2px);
    }

    .finance-button {
      background: linear-gradient(145deg, #f39c12, #d35400);
    }

    .finance-button:hover {
      background: linear-gradient(145deg, #d35400, #f39c12);
      transform: translateY(-2px);
    }

    .search-filter-container {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      padding: 20px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .search-input,
    .filter-select {
      padding: 12px 20px;
      border: 2px solid #eef2f7;
      border-radius: 12px;
      font-size: 0.95rem;
      min-width: 250px;
      transition: all 0.3s ease;
      background: white;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #2a7458;
      box-shadow: 0 0 0 3px rgba(42, 116, 88, 0.1);
    }

    .employee-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .employee-table th,
    .employee-table td {
      padding: 18px;
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .employee-table th {
      background: linear-gradient(145deg, #2a7458, #3b9c73);
      color: white;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.9rem;
    }

    .employee-table tr:last-child td {
      border-bottom: none;
    }

    .employee-table tbody tr {
      transition: all 0.3s ease;
    }

    .employee-table tbody tr:hover {
      background: rgba(42, 116, 88, 0.05);
      transform: translateY(-1px);
    }

    .action-buttons button {
      background: none;
      border: none;
      cursor: pointer;
      margin-right: 15px;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 8px;
    }

    .action-buttons .edit {
      color: #3498db;
    }

    .action-buttons .edit:hover {
      background: rgba(52, 152, 219, 0.1);
    }

    .action-buttons .delete {
      color: #e74c3c;
    }

    .action-buttons .delete:hover {
      background: rgba(231, 76, 60, 0.1);
    }

    .loading,
    .error {
      text-align: center;
      color: #2c3e50;
      font-size: 1.2rem;
      margin: 30px 0;
      padding: 20px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .error {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      transition: all 0.3s ease;
    }

    .sortable:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .sort-indicator {
      display: inline-block;
      margin-left: 8px;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .employee-dashboard {
        margin: 80px auto 20px;
        padding: 20px;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }

      .header-buttons {
        flex-wrap: wrap;
        width: 100%;
      }

      .add-button, .export-button, .pdf-button, .finance-button {
        padding: 10px 16px;
        font-size: 0.85rem;
      }

      .search-input,
      .filter-select {
        width: 100%;
        min-width: unset;
      }

      .employee-table th,
      .employee-table td {
        padding: 12px;
        font-size: 0.85rem;
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
          <div className="header-buttons">
            <button
              className="add-button"
              onClick={() => setShowAddForm(true)}
              title="Add New Employee"
            >
              <FontAwesomeIcon icon={faPlus} /> Add Employee
            </button>
            <button
              className="export-button"
              onClick={exportToCSV}
              title="Export to CSV"
            >
              <FontAwesomeIcon icon={faFileExport} /> Export CSV
            </button>
            <button
              className="pdf-button"
              onClick={downloadSalaryPDF}
              title="Download Salary PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} /> Download PDF
            </button>
            <button
              className="finance-button"
              onClick={sendToFinancialDashboard}
              title="Send to Financial Dashboard"
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} /> Send to Finance
            </button>
          </div>
        </div>

        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search employees..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="filter-select"
            value={filterDepartment}
            onChange={handleDepartmentFilter}
          >
            <option value="">All Departments</option>
            <option value="HR">Human Resources</option>
            <option value="IT">Information Technology</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        {showAddForm && (
          <AddEmployeeForm 
            onSuccess={handleAddSuccess}
            editingEmployee={editingEmployee}
            onUpdate={handleEmployeeUpdate}
          />
        )}

        {loading && <div className="loading">Loading employees...</div>}
        {error && <div className="error">{error}</div>}

        <table className="employee-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('EmployeeName')}>
                Name
                {sortConfig.key === 'EmployeeName' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('EmployeeId')}>
                Employee ID
                {sortConfig.key === 'EmployeeId' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('DepartmentName')}>
                Department
                {sortConfig.key === 'DepartmentName' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('JobRole')}>
                Job Role
                {sortConfig.key === 'JobRole' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('NetSalary')}>
                Net Salary (LKR)
                {sortConfig.key === 'NetSalary' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.EmployeeId}</td>
                  <td>{employee.DepartmentName}</td>
                  <td>{employee.JobRole}</td>
                  <td>{employee.NetSalary?.toFixed(2) || '0.00'}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit" 
                      title="Edit Employee"
                      onClick={() => handleEdit(employee)}
                    >
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
      </div>
    </>
  );
};

export default EmployeeDashboard;