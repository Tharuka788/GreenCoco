import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalWaste: 0,
    totalEarnings: 0,
    lastDelivery: '',
    pendingPayments: 0,
  });
  const [schedule, setSchedule] = useState({ date: '', quantity: '' });
  const [profile, setProfile] = useState({
    supplierName: '',
    phone: '',
    email: '',
    address: '',
    bankDetails: '',
    password: '',
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch supplier data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch supplier metrics
        const metricsResponse = await axios.get('http://localhost:5000/api/suppliers');
        const mockMetrics = {
          totalWaste: metricsResponse.data.reduce((sum, supplier) => sum + supplier.quantity, 0),
          totalEarnings: 45000, // Replace with actual earnings calculation
          lastDelivery: metricsResponse.data.length > 0 ? metricsResponse.data[0].createdAt : 'N/A',
          pendingPayments: 5000, // Replace with actual pending payments calculation
        };

        // Fetch notifications (you might need a separate endpoint for this)
        const notificationsResponse = await axios.get('http://localhost:5000/api/notifications');
        setMetrics(mockMetrics);
        setNotifications(notificationsResponse.data || ['Payment released for March 2025', 'Pickup routes updated']);
        setProfile({
          supplierName: 'John Doe',
          phone: '123-456-7890',
          email: 'john.doe@example.com',
          address: '123 Green St, Eco City',
          bankDetails: 'Bank: ABC, Account: 123456789',
          password: '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/suppliers', schedule);
      alert('Pickup scheduled successfully!');
      setSchedule({ date: '', quantity: '' });
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      alert('Failed to schedule pickup.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call to update profile
      console.log('Profile updated:', profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const dashboardStyles = `
    .supplier-dashboard {
      font-family: 'Poppins', sans-serif;
      padding: 80px 20px 20px;
      background: #f4f7f6;
      min-height: 100vh;
    }

    .dashboard-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .dashboard-section h2 {
      color: #1a4d38;
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background: #46b38a;
      color: #ffffff;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .metric-card h3 {
      font-size: 1rem;
      margin-bottom: 5px;
    }

    .metric-card p {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .schedule-form, .profile-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .schedule-form label, .profile-form label {
      display: flex;
      flex-direction: column;
      color: #2a7458;
      font-size: 0.95rem;
    }

    .schedule-form input, .profile-form input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      margin-top: 5px;
    }

    .schedule-form input:focus, .profile-form input:focus {
      outline: none;
      border-color: #46b38a;
      box-shadow: 0 0 5px rgba(70, 179, 138, 0.3);
    }

    .schedule-form button, .profile-form button {
      padding: 10px;
      background: linear-gradient(90deg, #328e6e, #46b38a);
      color: #ffffff;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease, transform 0.1s ease;
    }

    .schedule-form button:hover, .profile-form button:hover {
      background: linear-gradient(90deg, #46b38a, #328e6e);
      transform: scale(1.02);
    }

    .notifications-list {
      list-style: none;
      padding: 0;
    }

    .notifications-list li {
      background: #f0f0f0;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
      color: #2a7458;
    }

    @media (max-width: 768px) {
      .dashboard-section {
        padding: 15px;
      }

      .dashboard-section h2 {
        font-size: 1.3rem;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .schedule-form input, .profile-form input {
        font-size: 0.9rem;
      }

      .schedule-form button, .profile-form button {
        font-size: 0.9rem;
      }
    }
  `;

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dashboardStyles }} />
      <div className="supplier-dashboard">
        {/* Supplier Overview */}
        <div className="dashboard-section">
          <h2>Supplier Overview</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Waste Supplied</h3>
              <p>{metrics.totalWaste} kg</p>
            </div>
            <div className="metric-card">
              <h3>Total Earnings</h3>
              <p>Rs. {metrics.totalEarnings}</p>
            </div>
            <div className="metric-card">
              <h3>Last Delivery Date</h3>
              <p>{metrics.lastDelivery}</p>
            </div>
            <div className="metric-card">
              <h3>Pending Payments</h3>
              <p>Rs. {metrics.pendingPayments}</p>
            </div>
          </div>
        </div>

        {/* Supply Schedule / Book a Pickup */}
        <div className="dashboard-section">
          <h2>Book a Pickup</h2>
          <form className="schedule-form" onSubmit={handleScheduleSubmit}>
            <label>
              Date & Time:
              <input
                type="datetime-local"
                name="date"
                value={schedule.date}
                onChange={(e) => handleInputChange(e, setSchedule, schedule)}
                required
              />
            </label>
            <label>
              Estimated Quantity (kg):
              <input
                type="number"
                name="quantity"
                value={schedule.quantity}
                onChange={(e) => handleInputChange(e, setSchedule, schedule)}
                required
              />
            </label>
            <button type="submit">Schedule Pickup</button>
          </form>
        </div>

        {/* Profile Management */}
        <div className="dashboard-section">
          <h2>Profile Management</h2>
          <form className="profile-form" onSubmit={handleProfileUpdate}>
            <label>
              Supplier Name:
              <input
                type="text"
                name="supplierName"
                value={profile.supplierName}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
                required
              />
            </label>
            <label>
              Bank Details (Optional):
              <input
                type="text"
                name="bankDetails"
                value={profile.bankDetails}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
              />
            </label>
            <label>
              Change Password (Leave blank to keep unchanged):
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
              />
            </label>
            <button type="submit">Update Profile</button>
          </form>
        </div>

        {/* Notifications / Announcements */}
        <div className="dashboard-section">
          <h2>Notifications</h2>
          <ul className="notifications-list">
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SupplierDashboard;