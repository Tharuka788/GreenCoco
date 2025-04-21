import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="employee-list">
      <style>
        {`
          /* Container for the employee list */
          .employee-list {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 20px;
            background: transparent;
            border-radius: 10px;
            box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .employee-list:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }

          /* Title styling */
          .employee-list h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 2rem;
            font-weight: 600;
          }

          /* Add Employee button */
          .add-button {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background-color: #48bb78;
            color: white;
            border-radius: 4px;
            text-decoration: none;
            margin-bottom: 1.5rem;
            transition: background-color 0.3s ease;
          }

          .add-button:hover {
            background-color: #3aa76d;
          }

          /* Table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }

          table th,
          table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }

          table th {
            background-color: #48bb78;
            color: white;
            font-weight: 600;
          }

          table tr:hover {
            background-color: #f1f1f1;
          }

          /* Button styling */
          .update-btn,
          .delete-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background-color 0.3s ease;
          }

          .update-btn {
            background-color: #4299e1;
            color: white;
            margin-right: 0.5rem;
          }

          .update-btn:hover {
            background-color: #3182ce;
          }

          .delete-btn {
            background-color: #e53e3e;
            color: white;
            margin-right: 0.5rem;
          }

          .delete-btn:hover {
            background-color: #c53030;
          }
        `}
      </style>
      <h1>Employee List</h1>
      <Link to="/add" className="add-button">Add Employee</Link>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Employee ID</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Job Role</th>
            <th>Basic Salary (Rs)</th>
            <th>Bonus (Rs)</th>
            <th>Overtime Payment (Rs)</th>
            <th>Net Salary (Rs)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(employees) && employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.EmployeeName}</td>
              <td>{employee.DepartmentName}</td>
              <td>{employee.EmployeeId}</td>
              <td>{employee.PhoneNumber}</td>
              <td>{employee.Email}</td>
              <td>{employee.JobRole}</td>
              <td>{employee.BasicSalary}</td>
              <td>{employee.Bonus}</td>
              <td>{employee.OverTimePayment}</td>
              <td>{employee.NetSalary}</td>
              <td>
                <button className="update-btn" onClick={() => navigate(`/edit/${employee._id}`)}>Update</button>
                <button className="delete-btn" onClick={() => deleteEmployee(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;