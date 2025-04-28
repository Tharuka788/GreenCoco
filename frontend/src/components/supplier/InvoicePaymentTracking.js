import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faDownload,
  faSearch,
  faFilter,
  faSort,
  faCheckCircle,
  faClock,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const InvoicePaymentTracking = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to load invoices. Please try again.');
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon paid" />;
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      case 'overdue':
        return <FontAwesomeIcon icon={faExclamationCircle} className="status-icon overdue" />;
      default:
        return null;
    }
  };

  const filteredAndSortedInvoices = React.useMemo(() => {
    return [...invoices]
      .filter(invoice => {
        const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter;
        const matchesSearch = 
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.amount.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [invoices, searchTerm, sortConfig, statusFilter]);

  const handleDownloadReceipt = async (invoiceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setError('Failed to download receipt. Please try again.');
    }
  };

  const styles = `
    .invoice-tracking {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px 12px;
      width: 300px;
    }

    .search-box input {
      border: none;
      outline: none;
      margin-left: 8px;
      width: 100%;
    }

    .status-filter {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .status-filter button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    .status-filter button.active {
      background: #00796b;
      color: white;
      border-color: #00796b;
    }

    .invoices-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .invoices-table th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      cursor: pointer;
      user-select: none;
    }

    .invoices-table th:hover {
      background: #e0e0e0;
    }

    .invoices-table td {
      padding: 12px;
      border-top: 1px solid #eee;
    }

    .status-icon {
      margin-right: 8px;
    }

    .status-icon.paid {
      color: #4caf50;
    }

    .status-icon.pending {
      color: #ff9800;
    }

    .status-icon.overdue {
      color: #f44336;
    }

    .download-button {
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.3s;
    }

    .download-button:hover {
      background: #1976d2;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="invoice-tracking">
        <div className="header">
          <h2>Invoice and Payment Tracking</h2>
        </div>

        <div className="filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <button
              className={statusFilter === 'all' ? 'active' : ''}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={statusFilter === 'paid' ? 'active' : ''}
              onClick={() => setStatusFilter('paid')}
            >
              Paid
            </button>
            <button
              className={statusFilter === 'pending' ? 'active' : ''}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button
              className={statusFilter === 'overdue' ? 'active' : ''}
              onClick={() => setStatusFilter('overdue')}
            >
              Overdue
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading invoices...</div>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('invoiceNumber')}>
                  <FontAwesomeIcon icon={faSort} /> Invoice #
                </th>
                <th onClick={() => handleSort('date')}>
                  <FontAwesomeIcon icon={faSort} /> Date
                </th>
                <th onClick={() => handleSort('clientName')}>
                  <FontAwesomeIcon icon={faSort} /> Client
                </th>
                <th onClick={() => handleSort('amount')}>
                  <FontAwesomeIcon icon={faSort} /> Amount
                </th>
                <th onClick={() => handleSort('status')}>
                  <FontAwesomeIcon icon={faSort} /> Status
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.clientName}</td>
                  <td>Rs. {invoice.amount.toLocaleString()}</td>
                  <td>
                    {getStatusIcon(invoice.status)}
                    {invoice.status}
                  </td>
                  <td>
                    <button
                      className="download-button"
                      onClick={() => handleDownloadReceipt(invoice._id)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default InvoicePaymentTracking; 