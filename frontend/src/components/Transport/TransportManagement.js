import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useSnackbar } from 'notistack';
import TransportJobForm from './TransportJobForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Explicitly import autoTable

const TransportManagement = () => {
  const [transportJobs, setTransportJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  // Fetch transport jobs from the backend
  useEffect(() => {
    const fetchTransportJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/transport-jobs');
        console.log('Fetched transport jobs:', response.data);
        setTransportJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching transport jobs:', error);
        enqueueSnackbar('Failed to fetch transport jobs', { variant: 'error' });
        setTransportJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransportJobs();
  }, [enqueueSnackbar]);

  // Handle delete transport job
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport job?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/transport-jobs/${id}`);
        setTransportJobs(transportJobs.filter((job) => job._id !== id));
        enqueueSnackbar('Transport job deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting transport job:', error);
        enqueueSnackbar('Failed to delete transport job', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit transport job
  const handleEdit = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  // Handle add/edit transport job submission
  const handleFormSubmit = async (jobData) => {
    setLoading(true);
    try {
      if (selectedJob) {
        // Update transport job
        const response = await axios.put(`http://localhost:5000/api/transport-jobs/${selectedJob._id}`, jobData);
        setTransportJobs(transportJobs.map((job) => (job._id === selectedJob._id ? response.data : job)));
        enqueueSnackbar('Transport job updated successfully', { variant: 'success' });
      } else {
        // Add new transport job
        const response = await axios.post('http://localhost:5000/api/transport-jobs', jobData);
        setTransportJobs([...transportJobs, response.data]);
        enqueueSnackbar('Transport job added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error saving transport job:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save transport job', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Status chip colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filter transport jobs based on report criteria
  const filteredJobs = transportJobs.filter((job) => {
    const jobDate = new Date(job.createdAt);
    const startDate = reportFilter.startDate ? new Date(reportFilter.startDate) : null;
    const endDate = reportFilter.endDate ? new Date(reportFilter.endDate) : null;

    const matchesStatus = reportFilter.status ? job.status === reportFilter.status : true;
    const matchesStartDate = startDate ? jobDate >= startDate : true;
    const matchesEndDate = endDate ? jobDate <= endDate : true;

    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  // Generate PDF report
  const generatePDF = () => {
    // Create jsPDF instance in landscape for more modern look
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: 'GreenCoco Waste Management Report',
      subject: 'Transport Management System',
      author: 'GreenCoco',
      creator: 'GreenCoco Transport Management System'
    });
    
    // Add company logo (you'll need to replace with actual logo path/base64)
    // This is a placeholder - you would need to add your actual logo
    const logoX = 20;
    const logoY = 15;
    const logoWidth = 40;
    // doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoWidth * 0.6);
    
    // Add company name and address in place of logo until you have the actual logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210); // Brand blue color
    doc.text('GreenCoco', logoX, logoY + 8);
    
    // Add company address
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color for address
    doc.text([
      'No. 668, Kanubichchiya,', 
      'Dummalasuriya, Sri Lanka 60260',
      'Tel: +94 322241161 | Mobile: +94 716550681',
      'Email: info@greencocoexpo.lk'
    ], logoX, logoY + 15, { lineHeightFactor: 1.5 });
    
    // Add decorative header bar
    doc.setFillColor(25, 118, 210); // Brand blue color
    doc.rect(0, 40, 210, 10, 'F');
    
    // Add report title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(25, 118, 210);
    doc.text('Coconut Waste Management Report', 105, 65, { align: 'center' });
    
    // Add report subtitle with date
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 75, { align: 'center' });
    
    // Add filter information in a styled box
    doc.setDrawColor(220, 220, 220); // Light gray border
    doc.setFillColor(245, 245, 245); // Very light gray background
    doc.roundedRect(20, 85, 170, 30, 3, 3, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Report Filters:', 25, 95);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Status: ${reportFilter.status || 'All'}`, 25, 103);
    doc.text(`Date Range: ${reportFilter.startDate || 'N/A'} to ${reportFilter.endDate || 'N/A'}`, 25, 110);
    
    // Prepare table data
    const tableData = filteredJobs.map((job) => [
      job.jobType ? job.jobType.replace('-', ' ').toUpperCase() : 'N/A',
      job.wasteType ? job.wasteType.replace('-', ' ').toUpperCase() : 'N/A',
      job.quantity || 'N/A',
      job.assignedDriver?.name || 'Not Assigned',
      job.assignedVehicle?.licensePlate || 'Not Assigned',
      job.status || 'Unknown',
      job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A',
    ]);
    
    // Add table using autoTable
    autoTable(doc, {
      startY: 125,
      head: [
        [
          'Job Type',
          'Waste Type',
          'Quantity (tons)',
          'Assigned Driver',
          'Assigned Vehicle',
          'Status',
          'Created At',
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        5: { 
          fontStyle: 'bold',
          halign: 'center'
        }
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 4,
        lineColor: [200, 200, 200]
      },
      margin: { top: 125 }
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFillColor(25, 118, 210, 0.1); // Light blue background
    doc.roundedRect(20, finalY, 170, 40, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text('Summary', 25, finalY + 10);
    
    // Calculate summary statistics
    const totalJobs = filteredJobs.length;
    const totalQuantity = filteredJobs.reduce((sum, job) => sum + (parseFloat(job.quantity) || 0), 0).toFixed(2);
    const completedJobs = filteredJobs.filter(job => job.status === 'completed').length;
    const pendingJobs = filteredJobs.filter(job => job.status === 'pending').length;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Transport Jobs: ${totalJobs}`, 25, finalY + 20);
    doc.text(`Total Waste Quantity: ${totalQuantity} tons`, 25, finalY + 28);
    doc.text(`Completed Jobs: ${completedJobs}`, 25, finalY + 36);
    doc.text(`Pending Jobs: ${pendingJobs}`, 105, finalY + 36);
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        'GreenCoco - Committed to sustainable coconut waste management',
        105,
        285,
        { align: 'center' }
      );
      doc.text(`Page ${i} of ${pageCount}`, 190, 285);
    }
    
    // Save the PDF
    doc.save(`GreenCoco_Waste_Management_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    setReportFilter({ ...reportFilter, [e.target.name]: e.target.value });
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: 'jobType',
      headerName: 'Job Type',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalShippingIcon sx={{ color: '#2e7d32', mr: 1 }} />
          <div>{params.value ? params.value.replace('-', ' ').toUpperCase() : 'N/A'}</div>
        </Box>
      ),
    },
    {
      field: 'wasteType',
      headerName: 'Waste Type',
      width: 150,
      renderCell: (params) => (
        <div>{params.value ? params.value.replace('-', ' ').toUpperCase() : 'N/A'}</div>
      ),
    },
    { field: 'quantity', headerName: 'Quantity (tons)', width: 120 },
    {
      field: 'assignedDriver',
      headerName: 'Assigned Driver',
      width: 180,
      renderCell: (params) => {
        if (!params.row.assignedDriver) {
          return <Chip label="Not Assigned" variant="outlined" size="small" />;
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BadgeIcon sx={{ color: '#2e7d32', mr: 1 }} />
            <div>{params.row.assignedDriver.name}</div>
          </Box>
        );
      },
    },
    {
      field: 'assignedVehicle',
      headerName: 'Assigned Vehicle',
      width: 180,
      renderCell: (params) => {
        if (!params.row.assignedVehicle) {
          return <Chip label="Not Assigned" variant="outlined" size="small" />;
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: '#2e7d32', mr: 1 }} />
            <div>{params.row.assignedVehicle.licensePlate}</div>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Unknown'}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => {
        if (!params.value) return <div>N/A</div>;

        try {
          const date = new Date(params.value);
          return <div>{isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()}</div>;
        } catch (error) {
          return <div>N/A</div>;
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (!params || !params.row) return null;

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEdit(params.row)}
                color="primary"
                size="small"
                disabled={loading}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(params.row._id)}
                color="error"
                size="small"
                disabled={loading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Map transport jobs to rows for DataGrid
  const rows = filteredJobs
    .filter((job) => job && job._id)
    .map((job) => ({
      id: job._id,
      _id: job._id,
      ...job,
    }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: '600', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
            <LocalShippingIcon sx={{ mr: 1, fontSize: 32 }} />
            Transport Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedJob(null);
                setOpenDialog(true);
              }}
              disabled={loading}
              sx={{ borderRadius: 28, px: 3, py: 1 }}
            >
              Add Transport Job
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={generatePDF}
              disabled={loading || filteredJobs.length === 0}
              sx={{ borderRadius: 28, px: 3, py: 1 }}
            >
              Generate PDF Report
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Report Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            select
            label="Status"
            name="status"
            value={reportFilter.status}
            onChange={handleFilterChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={reportFilter.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={reportFilter.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows.length > 0 ? rows : []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              components={{
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                boxShadow: 1,
                borderRadius: 2,
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9f9f9',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: '#fafafa',
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Transport Job Form Dialog */}
      <TransportJobForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleFormSubmit}
        job={selectedJob}
      />
    </Container>
  );
};

export default TransportManagement;