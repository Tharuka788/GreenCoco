import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const LowStockReport = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalWeight', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
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
        setFilteredItems(filteredItems);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLowStockItems();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = lowStockItems.filter(item =>
      item.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wasteType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, lowStockItems]);

  // Sorting function
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    setFilteredItems((prevItems) => {
      const sortedItems = [...prevItems];
      sortedItems.sort((a, b) => {
        if (key === 'totalWeight') {
          return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
        }
        return direction === 'asc'
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
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Poppins', sans-serif;
    }

    .low-stock-report {
      max-width: 1200px;
      margin: 0 auto;
    }

    .low-stock-report h1 {
      text-align: center;
      color: #00695c;
      margin-bottom: 25px;
      font-size: 2.2rem;
      font-weight: 600;
    }

    .search-bar {
      display: flex;
      align-items: center;
      max-width: 400px;
      margin: 0 auto 20px;
      background: white;
      border-radius: 6px;
      padding: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .search-bar input {
      flex: 1;
      border: none;
      padding: 8px;
      font-size: 14px;
      outline: none;
    }

    .search-bar svg {
      color: #26a69a;
      margin-right: 10px;
    }

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }

    .low-stock-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 10px;
      background: transparent;
    }

    .low-stock-table th,
    .low-stock-table td {
      padding: 15px;
      text-align: left;
      font-size: 0.95rem;
    }

    .low-stock-table th {
      background: #00796b;
      color: #e6f0ea;
      font-weight: 600;
      cursor: pointer;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .low-stock-table th:hover {
      background: #009688;
    }

    .low-stock-table tr {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      animation: fadeIn 0.5s ease-in;
    }

    .low-stock-table tr:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sort-icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .sort-icon.asc {
      transform: rotate(0deg);
    }

    .sort-icon.desc {
      transform: rotate(180deg);
    }

    .low-stock-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #d32f2f;
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .action-buttons a {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
      margin-right: 8px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .view-btn {
      background: #00796b;
      color: #e6f0ea;
    }

    .edit-btn {
      background: #26a69a;
      color: #e6f0ea;
    }

    .view-btn:hover,
    .edit-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-top: 20px;
    }

    .empty-state svg {
      font-size: 3rem;
      color: #26a69a;
      margin-bottom: 15px;
    }

    .empty-state p {
      color: #37474f;
      font-size: 1.1rem;
      margin-bottom: 10px;
    }

    .back-to-inventory {
      display: inline-block;
      padding: 12px 24px;
      background: #00796b;
      color: #e6f0ea;
      text-decoration: none;
      border-radius: 6px;
      font-size: 1rem;
      margin-top: 20px;
      transition: all 0.3s ease;
    }

    .back-to-inventory:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .low-stock-report-container {
        margin-top: 120px;
        padding: 10px;
      }

      .low-stock-table th,
      .low-stock-table td {
        padding: 10px;
        font-size: 0.85rem;
      }

      .action-buttons a {
        padding: 6px 8px;
        font-size: 0.8rem;
      }

      .low-stock-report h1 {
        font-size: 1.8rem;
      }

      .search-bar {
        max-width: 100%;
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

          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search by Batch ID or Waste Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faBoxOpen} />
              <p>No low stock items found.</p>
              <p>Check back later or add new inventory.</p>
            </div>
          ) : (
            <table className="low-stock-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('batchId')}>
                    Batch ID{' '}
                    {sortConfig.key === 'batchId' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
                        className={`sort-icon ${sortConfig.direction}`}
                      />
                    )}
                  </th>
                  <th>Collection Date</th>
                  <th>Source Location</th>
                  <th onClick={() => handleSort('totalWeight')}>
                    Total Weight (kg){' '}
                    {sortConfig.key === 'totalWeight' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
                        className={`sort-icon ${sortConfig.direction}`}
                      />
                    )}
                  </th>
                  <th>Waste Type</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.batchId}</td>
                    <td>{new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>{item.sourceLocation}</td>
                    <td>{item.totalWeight}</td>
                    <td>{item.wasteType}</td>
                    <td>
                      <span className="low-stock-badge">Low Stock</span>
                    </td>
                    <td className="action-buttons">
                      <Link to={`/inventory/details/${item._id}`} className="view-btn">View</Link>
                      <Link to={`/inventory/edit/${item._id}`} className="edit-btn">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/inventory" className="back-to-inventory">
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowStockReport;