import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavbar from '../Home/MainNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendar, faMapMarkerAlt, faWeight, faRecycle, faExclamationTriangle, faSearch, faPlus, faArrowUp, faArrowDown, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import Poppins font (optional, for better styling - requires font file or manual addition to jsPDF)

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'totalWeight', direction: 'asc' });
  const [weightBreakdown, setWeightBreakdown] = useState({});
  const [inventoryValue, setInventoryValue] = useState(0);
  const [turnoverRate, setTurnoverRate] = useState(0);
  const [batchTracking, setBatchTracking] = useState({});
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  const LOW_STOCK_THRESHOLD = 10;

  // Calculate inventory value (mock prices per waste type)
  const calculateInventoryValue = (items) => {
    const pricePerKg = {
      'Organic': 2.5,
      'Plastic': 1.8,
      'Paper': 1.2,
      'Metal': 3.5,
      'Glass': 1.0,
      'Electronic': 5.0
    };

    return items.reduce((total, item) => {
      const price = pricePerKg[item.wasteType] || 1.0;
      return total + (item.totalWeight * price);
    }, 0);
  };

  // Calculate inventory turnover rate (mock data for demonstration)
  const calculateTurnoverRate = (items) => {
    const totalInventory = items.reduce((sum, item) => sum + item.totalWeight, 0);
    const annualSales = totalInventory * 1.5;
    return totalInventory > 0 ? (annualSales / totalInventory) : 0;
  };

  // Track batches and their movement
  const trackBatches = (items) => {
    return items.reduce((tracking, item) => {
      if (!tracking[item.batchId]) {
        tracking[item.batchId] = {
          totalWeight: item.totalWeight,
          lastUpdated: item.collectionDate,
          location: item.sourceLocation,
          status: item.totalWeight < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'
        };
      }
      return tracking;
    }, {});
  };

  // Generate inventory alerts
  const generateAlerts = (items) => {
    const alerts = [];
    const today = new Date();
    
    items.forEach(item => {
      const collectionDate = new Date(item.collectionDate);
      const daysSinceCollection = Math.floor((today - collectionDate) / (1000 * 60 * 60 * 24));
      
      if (item.totalWeight < LOW_STOCK_THRESHOLD) {
        alerts.push({
          type: 'low_stock',
          message: `Low stock alert for batch ${item.batchId} (${item.totalWeight} kg)`,
          severity: 'high'
        });
      }
      
      if (daysSinceCollection > 30) {
        alerts.push({
          type: 'aging_inventory',
          message: `Batch ${item.batchId} has been in inventory for ${daysSinceCollection} days`,
          severity: 'medium'
        });
      }
    });
    
    return alerts;
  };

  // Fetch inventory items and calculate weights
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
        setFilteredItems(data);

        // Identify low stock items
        const lowStock = data.filter(item => item.totalWeight < LOW_STOCK_THRESHOLD);
        setLowStockItems(lowStock);

        // Calculate weight breakdown by waste type
        const breakdown = data.reduce((acc, item) => {
          acc[item.wasteType] = (acc[item.wasteType] || 0) + item.totalWeight;
          return acc;
        }, {});
        setWeightBreakdown(breakdown);

        // Calculate inventory value
        const value = calculateInventoryValue(data);
        setInventoryValue(value);

        // Calculate turnover rate
        const turnover = calculateTurnoverRate(data);
        setTurnoverRate(turnover);

        // Track batches
        const batchData = trackBatches(data);
        setBatchTracking(batchData);

        // Generate alerts
        const inventoryAlerts = generateAlerts(data);
        setAlerts(inventoryAlerts);
      } catch (err) {
        setError(`Error: ${err.message}. Please try again later.`);
      }
    };

    fetchInventory();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = inventoryItems.filter(item =>
      item.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wasteType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, inventoryItems]);

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

        const updatedItems = inventoryItems.filter((item) => item._id !== id);
        setInventoryItems(updatedItems);
        setFilteredItems(updatedItems.filter(item =>
          item.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.wasteType.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        setLowStockItems(lowStockItems.filter((item) => item._id !== id));

        // Update weight breakdown
        const breakdown = updatedItems.reduce((acc, item) => {
          acc[item.wasteType] = (acc[item.wasteType] || 0) + item.totalWeight;
          return acc;
        }, {});
        setWeightBreakdown(breakdown);

        alert('Inventory item deleted successfully!');
      } catch (err) {
        setError(`Error: ${err.message}. Please try again.`);
      }
    }
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Company Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 105, 92);
    doc.text('GreenCoco', 15, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text([
      'No. 668, Kanubichchiya, Dummalasuriya, Sri Lanka 60260',
      'Tel: +94 322241161 | Mobile: +94 716550681',
      'Email: info@greencocoexpo.lk'
    ], 15, 24);

    // Decorative header bar
    doc.setFillColor(0, 105, 92);
    doc.rect(0, 32, 210, 8, 'F');

    // Report Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 105, 92);
    doc.text('Inventory Management Report', 105, 48, { align: 'center' });

    // Date
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 56, { align: 'center' });

    // Summary Section
    let y = 65;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 77, 64);
    doc.text('Summary', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    y += 7;
    doc.text(`Total Inventory Weight: ${totalWeight.toFixed(2)} kg`, 15, y);
    y += 6;
    doc.text(`Inventory Value: $${inventoryValue.toFixed(2)}`, 15, y);
    y += 6;
    doc.text(`Turnover Rate: ${turnoverRate.toFixed(2)}x per year`, 15, y);

    // Weight Breakdown
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 77, 64);
    doc.text('Weight Breakdown by Waste Type:', 15, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    Object.entries(weightBreakdown).forEach(([type, weight]) => {
      doc.text(`${type}: ${weight.toFixed(2)} kg`, 18, y);
      y += 5;
    });

    // Low Stock Alert
    if (lowStockItems.length > 0) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(211, 47, 47);
      doc.text('Low Stock Alert:', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(
        `Warning: ${lowStockItems.length} item(s) are low on stock (below ${LOW_STOCK_THRESHOLD} kg)!`,
        18, y
      );
      y += 5;
      doc.text(`Total Low Stock Weight: ${lowStockTotalWeight.toFixed(2)} kg`, 18, y);
      y += 5;
    }

    // Inventory Alerts
    if (alerts.length > 0) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 77, 64);
      doc.text('Inventory Alerts:', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      alerts.forEach((alert) => {
        if (alert.severity === 'high') {
          doc.setTextColor(211, 47, 47); // Red
        } else {
          doc.setTextColor(239, 108, 0); // Orange
        }
        doc.text(
          `${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}: ${alert.message}`,
          18, y
        );
        y += 5;
      });
    }

    // Inventory Table
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 77, 64);
    doc.text('Inventory Items', 15, y);

    const tableColumns = [
      'Batch ID', 'Collection Date', 'Source Location', 'Weight (kg)', 'Waste Type', 'Status'
    ];
    const tableRows = filteredItems.map((item) => [
      item.batchId,
      new Date(item.collectionDate).toLocaleDateString(),
      item.sourceLocation,
      item.totalWeight.toString(),
      item.wasteType,
      item.totalWeight < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'
    ]);

    // Use the imported autoTable function
    autoTable(doc, {
      startY: y + 3,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [0, 121, 107], textColor: [230, 240, 234] },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 3: { halign: 'right' } }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        'GreenCoco - Committed to sustainable coconut waste management',
        105,
        290,
        { align: 'center' }
      );
      doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: 'right' });
    }

    // Save the PDF
    doc.save(`GreenCoco_Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Calculate total weights
  const totalWeight = inventoryItems.reduce((sum, item) => sum + item.totalWeight, 0);
  const lowStockTotalWeight = lowStockItems.reduce((sum, item) => sum + item.totalWeight, 0);
  const referenceThreshold = LOW_STOCK_THRESHOLD * inventoryItems.length;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .inventory-management-container {
      margin-top: 80px;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      font-family: 'Poppins', sans-serif;
    }

    .inventory-management {
      max-width: 1200px;
      margin: 0 auto;
    }

    .inventory-management h1 {
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

    .add-button, .report-button {
      display: inline-block;
      background: #00796b;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      margin-bottom: 20px;
      margin-right: 10px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .add-button:hover, .report-button:hover {
      background: #009688;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
    }

    .error {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 15px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
      position: relative;
    }

    .error button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #d32f2f;
      cursor: pointer;
      font-size: 14px;
    }

    .low-stock-alert {
      background: #ffebee;
      color: #d32f2f;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 500;
    }

    .weight-section {
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .weight-section h3 {
      color: #004d40;
      margin-bottom: 10px;
      font-size: 18px;
    }

   F    .weight-breakdown {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
    }

    .weight-item {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 6px;
      text-align: center;
    }

    .weight-progress {
      height: 8px;
      background: #eceff1;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }

    .weight-progress-fill {
      height: 100%;
      background: #26a69a;
      transition: width 0.3s ease;
    }

    .inventory-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 10px;
      background: transparent;
    }

    .inventory-table th,
    .inventory-table td {
      padding: 15px;
      text-align: left;
      font-size: 0.95rem;
    }

    .inventory-table th {
      background: #00796b;
      color: #e6f0ea;
      font-weight: 600;
      cursor: pointer;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .inventory-table th:hover {
      background: #009688;
    }

    .inventory-table tr {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      animation: fadeIn 0.5s ease-in;
    }

    .inventory-table tr:hover {
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

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.low-stock {
      background: #d32f2f;
      color: white;
    }

    .status-badge.in-stock {
      background: #2e7d32;
      color: white;
    }

    .status-badge.waste-type {
      background: #26a69a;
      color: white;
    }

    .action-buttons button,
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

    .delete-btn {
      background: #d32f2f;
      color: #e6f0ea;
    }

    .view-btn:hover,
    .edit-btn:hover,
    .delete-btn:hover {
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

    .alerts-section {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .alerts-section h3 {
      color: #004d40;
      margin-bottom: 15px;
      font-size: 18px;
    }

    .alert {
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      font-size: 14px;
      animation: slideIn 0.3s ease;
    }

    .alert-high {
      background: #ffebee;
      color: #d32f2f;
      border-left: 4px solid #d32f2f;
    }

    .alert-medium {
      background: #fff3e0;
      color: #ef6c00;
      border-left: 4px solid #ef6c00;
    }

    .inventory-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .metric-card h3 {
      color: #004d40;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 600;
      color: #00796b;
    }

    .batch-tracking {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .batch-tracking h3 {
      color: #004d40;
      margin-bottom: 15px;
      font-size: 18px;
    }

    .batch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .batch-card {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .batch-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .batch-card h4 {
      color: #00695c;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .batch-card p {
      margin: 5px 0;
      color: #37474f;
      font-size: 14px;
    }

    .status-badge.low-stock {
      background: #d32f2f;
      color: white;
    }

    .status-badge.in-stock {
      background: #2e7d32;
      color: white;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .inventory-management-container {
        margin-top: 120px;
        padding: 10px;
      }

      .inventory-table th,
      .inventory-table td {
        padding: 10px;
        font-size: 0.85rem;
      }

      .action-buttons button,
      .action-buttons a {
        padding: 6px 8px;
        font-size: 0.8rem;
      }

      .inventory-management h1 {
        font-size: 1.8rem;
      }

      .search-bar {
        max-width: 100%;
      }

      .weight-breakdown {
        grid-template-columns: 1fr;
      }

      .inventory-metrics {
        grid-template-columns: 1fr;
      }

      .batch-grid {
        grid-template-columns: 1fr;
      }

      .metric-card {
        padding: 15px;
      }

      .metric-value {
        font-size: 20px;
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

          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search by Batch ID or Waste Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error && (
            <div className="error">
              {error}
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="low-stock-alert">
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
              Warning: {lowStockItems.length} item(s) are low on stock (below {LOW_STOCK_THRESHOLD} kg)!
            </div>
          )}

          <div className="weight-section">
            <h3>Weight Summary</h3>
            <div className="weight-item">
              <strong>Total Inventory Weight:</strong> {totalWeight.toFixed(2)} kg
              <div className="weight-progress">
                <div
                  className="weight-progress-fill"
                  style={{ width: `${(totalWeight / referenceThreshold) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="weight-item">
              <strong>Low Stock Total Weight:</strong> {lowStockTotalWeight.toFixed(2)} kg
            </div>
            <h3 style={{ marginTop: '15px' }}>Weight Breakdown by Waste Type</h3>
            <div className="weight-breakdown">
              {Object.entries(weightBreakdown).map(([type, weight]) => (
                <div key={type} className="weight-item">
                  <strong>{type}:</strong> {weight.toFixed(2)} kg
                </div>
              ))}
            </div>
          </div>

          <div>
            <Link to="/inventory/add" className="add-button">
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
              Add New Inventory
            </Link>
            <button onClick={generateReport} className="report-button">
              <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px' }} />
              Generate Report
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faBox} />
              <p>No inventory items found.</p>
              <p>Add new items to get started.</p>
            </div>
          ) : (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('batchId')}>
                    <FontAwesomeIcon icon={faBox} /> Batch ID{' '}
                    {sortConfig.key === 'batchId' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
                        className={`sort-icon ${sortConfig.direction}`}
                      />
                    )}
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faCalendar} /> Collection Date
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Source Location
                  </th>
                  <th onClick={() => handleSort('totalWeight')}>
                    <FontAwesomeIcon icon={faWeight} /> Total Weight (kg){' '}
                    {sortConfig.key === 'totalWeight' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
                        className={`sort-icon ${sortConfig.direction}`}
                      />
                    )}
                  </th>
                  <th onClick={() => handleSort('wasteType')}>
                    <FontAwesomeIcon icon={faRecycle} /> Waste Type{' '}
                    {sortConfig.key === 'wasteType' && (
                      <FontAwesomeIcon
                        icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
                        className={`sort-icon ${sortConfig.direction}`}
                      />
                    )}
                  </th>
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
                    <td>
                      <span className="status-badge waste-type">{item.wasteType}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.totalWeight < LOW_STOCK_THRESHOLD ? 'low-stock' : 'in-stock'
                        }`}
                      >
                        {item.totalWeight < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                      </span>
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

          {alerts.length > 0 && (
            <div className="alerts-section">
              <h3>Inventory Alerts</h3>
              {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.severity}`}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          <div className="inventory-metrics">
            <div className="metric-card">
              <h3>Inventory Value</h3>
              <p className="metric-value">${inventoryValue.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3>Turnover Rate</h3>
              <p className="metric-value">{turnoverRate.toFixed(2)}x per year</p>
            </div>
          </div>

          <div className="batch-tracking">
            <h3>Batch Tracking</h3>
            <div className="batch-grid">
              {Object.entries(batchTracking).map(([batchId, data]) => (
                <div key={batchId} className="batch-card">
                  <h4>Batch: {batchId}</h4>
                  <p>Weight: {data.totalWeight} kg</p>
                  <p>Location: {data.location}</p>
                  <p>Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>
                  <span className={`status-badge ${data.status.toLowerCase().replace(' ', '-')}`}>
                    {data.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;