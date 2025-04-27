import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUserClock, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchTodayAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/attendance/today');
      setAttendanceRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeAttendance = async () => {
    if (!selectedEmployee || !startDate || !endDate) return;

    try {
      setLoading(true);
      const response = await axios.get(`/attendance/employee/${selectedEmployee}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setAttendanceRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await axios.post('/attendance/check-in', { employeeId });
      toast.success('Check-in recorded successfully');
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record check-in');
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await axios.post(`/attendance/check-out/${attendanceId}`);
      toast.success('Check-out recorded successfully');
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record check-out');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const styles = `
    .attendance-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .attendance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .select-employee {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 200px;
    }

    .date-picker {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .attendance-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .attendance-table th,
    .attendance-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .attendance-table th {
      background: #2a7458;
      color: white;
      font-weight: 500;
    }

    .attendance-table tr:hover {
      background: #f5f5f5;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-present {
      background: #e3fcef;
      color: #0d6832;
    }

    .status-late {
      background: #fff3cd;
      color: #856404;
    }

    .status-absent {
      background: #f8d7da;
      color: #721c24;
    }

    .status-half-day {
      background: #cce5ff;
      color: #004085;
    }

    .action-button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.3s;
    }

    .check-in-button {
      background: #2a7458;
      color: white;
    }

    .check-in-button:hover {
      background: #3b9c73;
    }

    .check-out-button {
      background: #e74c3c;
      color: white;
    }

    .check-out-button:hover {
      background: #c0392b;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .attendance-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
      }

      .select-employee,
      .date-picker {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="attendance-container">
        <div className="attendance-header">
          <h2>
            <FontAwesomeIcon icon={faUserClock} /> Attendance Management
          </h2>
          <div className="filters">
            <select
              className="select-employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.EmployeeName} ({employee.EmployeeId})
                </option>
              ))}
            </select>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="date-picker"
              placeholderText="Select date range"
              minDate={new Date()}
            />
            <button
              className="action-button check-in-button"
              onClick={fetchEmployeeAttendance}
              disabled={!selectedEmployee || !startDate || !endDate}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> View Records
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading attendance records...</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td>
                      {record.employeeId.EmployeeName}
                      <br />
                      <small>{record.employeeId.EmployeeId}</small>
                    </td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{formatTime(record.checkIn)}</td>
                    <td>
                      {record.checkOut ? formatTime(record.checkOut) : '-'}
                    </td>
                    <td>{record.workHours.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {!record.checkIn ? (
                        <button
                          className="action-button check-in-button"
                          onClick={() => handleCheckIn(record.employeeId._id)}
                        >
                          <FontAwesomeIcon icon={faCheck} /> Check In
                        </button>
                      ) : !record.checkOut ? (
                        <button
                          className="action-button check-out-button"
                          onClick={() => handleCheckOut(record._id)}
                        >
                          <FontAwesomeIcon icon={faTimes} /> Check Out
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AttendanceManagement; 