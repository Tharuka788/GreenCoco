import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [error, setError] = useState('');
  const [lowStockItems, setLowStockItems] = useState([]); // Track low stock items
  const navigate = useNavigate();

  const LOW_STOCK_THRESHOLD = 10; // Define low stock threshold (in kg)

  // Fetch all inventory items on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5000/inventory/', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }

        const data = await response.json();
        setInventoryItems(data);

        // Identify low stock items
        const lowStock = data.filter(item => item.totalWeight < LOW_STOCK_THRESHOLD);
        setLowStockItems(lowStock);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInventory();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        const response = await fetch(`http://localhost:5000/inventory/delete/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete inventory item');
        }

        setInventoryItems(inventoryItems.filter((item) => item._id !== id));
        setLowStockItems(lowStockItems.filter((item) => item._id !== id));
        alert('Inventory item deleted successfully!');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const styles = `
    .inventory-management-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: #f5f7fa;
      font-family: Arial, sans-serif;
    }

    .inventory-management {
      max-width: 1200px;
      margin: 0 auto;
    }

    .inventory-management h1 {
      text-align: center;
      color: #2a7458;
      margin-bottom: 20px;
    }

    .add-button {
      display: inline-block;
      background: #2a7458;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      text-decoration: none;
      margin-bottom: 20px;
      text-align: center;
    }

    .add-button:hover {
      background: #46b38a;
    }

    .error {
      color: red;
      text-align: center;
      margin-bottom: 10px;
    }

    .low-stock-alert {
      background: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
    }

    .inventory-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .inventory-table th,
    .inventory-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .inventory-table th {
      background: #2a7458;
      color: white;
    }

    .inventory-table tr:hover {
      background: #f9f9f9;
    }

    .low-stock {
      color: #721c24;
      font-weight: bold;
    }

    .action-buttons button,
    .action-buttons a {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      margin-right: 5px;
    }

    .view-btn {
      background: #328e6e;
      color: white;
    }

    .edit-btn {
      background: #46b38a;
      color: white;
    }

    .delete-btn {
      background: #d9534f;
      color: white;
    }

    .view-btn:hover,
    .edit-btn:hover,
    .delete-btn:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .inventory-management-container {
        margin-top: 120px;
        padding: 10px;
      }

      .inventory-table th,
      .inventory-table td {
        padding: 8px;
        font-size: 14px;
      }

      .action-buttons button,
      .action-buttons a {
        padding: 6px 8px;
        font-size: 12px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="inventory-management-container">
        <div className="inventory-management">
          <h1>Inventory Management</h1>
          
          {error && <div className="error">{error}</div>}

          {lowStockItems.length > 0 && (
            <div className="low-stock-alert">
              Warning: {lowStockItems.length} item(s) are low on stock (below {LOW_STOCK_THRESHOLD} kg)!
            </div>
          )}

          <Link to="/inventory/add" className="add-button">Add New Inventory</Link>

          {inventoryItems.length === 0 ? (
            <p>No inventory items found.</p>
          ) : (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Collection Date</th>
                  <th>Source Location</th>
                  <th>Total Weight (kg)</th>
                  <th>Waste Type</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.batchId}</td>
                    <td>{new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>{item.sourceLocation}</td>
                    <td>{item.totalWeight}</td>
                    <td>{item.wasteType}</td>
                    <td className={item.totalWeight < LOW_STOCK_THRESHOLD ? 'low-stock' : ''}>
                      {item.totalWeight < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                    </td>
                    <td className="action-buttons">
                      <Link to={`/inventory/details/${item._id}`} className="view-btn">View</Link>
                      <Link to={`/inventory/edit/${item._id}`} className="edit-btn">Edit</Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;