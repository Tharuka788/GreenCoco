import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';

const LowStockReport = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalWeight', direction: 'asc' });
  const LOW_STOCK_THRESHOLD = 10;

  // Fetch all inventory items and filter for low stock
  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/inventory/', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }

        const data = await response.json();
        const filteredItems = data.filter(item => item.totalWeight < LOW_STOCK_THRESHOLD);
        setLowStockItems(filteredItems);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLowStockItems();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });

    setLowStockItems((prevItems) => {
      const sortedItems = [...prevItems];
      sortedItems.sort((a, b) => {
        if (key === 'totalWeight') {
          return sortConfig.direction === 'asc'
            ? a[key] - b[key]
            : b[key] - a[key];
        }
        return sortConfig.direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });
      return sortedItems;
    });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .low-stock-report-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      font-family: 'Poppins', sans-serif;
    }

    .low-stock-report {
      max-width: 1200px;
      margin: 0 auto;
    }

    .low-stock-report h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 20px;
      font-size: 2rem;
      font-weight: 600;
    }

    .error {
      color: #721c24;
      text-align: center;
      margin-bottom: 10px;
      font-size: 1rem;
    }

    .low-stock-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .low-stock-table th,
    .low-stock-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 0.95rem;
    }

    .low-stock-table th {
      background: #2a7458;
      color: #e6f0ea;
      font-weight: 600;
      cursor: pointer;
    }

    .low-stock-table th:hover {
      background: #46b38a;
    }

    .low-stock-table tr:hover {
      background: #f9f9f9;
    }

    .low-stock {
      color: #721c24;
      font-weight: 600;
    }

    .action-buttons a {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
      margin-right: 5px;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .view-btn {
      background: #328e6e;
      color: #e6f0ea;
    }

    .edit-btn {
      background: #46b38a;
      color: #e6f0ea;
    }

    .view-btn:hover,
    .edit-btn:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .low-stock-report-container {
        margin-top: 120px;
        padding: 10px;
      }

      .low-stock-table th,
      .low-stock-table td {
        padding: 8px;
        font-size: 0.85rem;
      }

      .action-buttons a {
        padding: 6px 8px;
        font-size: 0.8rem;
      }

      .low-stock-report h1 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="low-stock-report-container">
        <div className="low-stock-report">
          <h1>Low Stock Report</h1>
          
          {error && <div className="error">{error}</div>}

          {lowStockItems.length === 0 ? (
            <p>No low stock items found.</p>
          ) : (
            <table className="low-stock-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('batchId')}>
                    Batch ID {sortConfig.key === 'batchId' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Collection Date</th>
                  <th>Source Location</th>
                  <th onClick={() => handleSort('totalWeight')}>
                    Total Weight (kg) {sortConfig.key === 'totalWeight' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Waste Type</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.batchId}</td>
                    <td>{new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>{item.sourceLocation}</td>
                    <td>{item.totalWeight}</td>
                    <td>{item.wasteType}</td>
                    <td className="low-stock">Low Stock</td>
                    <td className="action-buttons">
                      <Link to={`/inventory/details/${item._id}`} className="view-btn">View</Link>
                      <Link to={`/inventory/edit/${item._id}`} className="edit-btn">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link
              to="/inventory"
              style={{
                padding: '10px 20px',
                background: '#328e6e',
                color: '#e6f0ea',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '1rem',
                transition: 'background 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = '#46b38a')}
              onMouseOut={(e) => (e.target.style.background = '#328e6e')}
            >
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowStockReport;