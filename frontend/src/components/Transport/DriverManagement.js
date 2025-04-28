import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import DriverForm from './DriverForm';
import { useSnackbar } from 'notistack';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Fetch drivers from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/drivers');
        console.log('Fetched drivers:', response.data);
        setDrivers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        enqueueSnackbar('Failed to fetch drivers', { variant: 'error' });
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [enqueueSnackbar]);

  // Handle delete driver
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/drivers/${id}`);
        setDrivers(drivers.filter((driver) => driver._id !== id));
        enqueueSnackbar('Driver deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting driver:', error);
        enqueueSnackbar('Failed to delete driver', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit driver
  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  // Handle add/edit driver submission
  const handleFormSubmit = async (driverData) => {
    setLoading(true);
    try {
      if (selectedDriver) {
        // Update driver
        const response = await axios.put(`http://localhost:5000/api/drivers/${selectedDriver._id}`, driverData);
        setDrivers(drivers.map((driver) => (driver._id === selectedDriver._id ? response.data : driver)));
        enqueueSnackbar('Driver updated successfully', { variant: 'success' });
      } else {
        // Add new driver
        const response = await axios.post('http://localhost:5000/api/drivers', driverData);
        setDrivers([...drivers, response.data]);
        enqueueSnackbar('Driver added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
      setSelectedDriver(null);
    } catch (error) {
      console.error('Error saving driver:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save driver', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Status chip colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'success';
      case 'on-duty': return 'primary';
      case 'off-duty': return 'warning';
      default: return 'default';
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { 
      field: 'name', 
      headerName: 'Driver Name', 
      width: 180,
      filterable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BadgeIcon sx={{ color: '#2e7d32', mr: 1 }} />
          <div>{params.value}</div>
        </Box>
      )
    },
    { field: 'phone', headerName: 'Contact Number', width: 150 },
    { field: 'email', headerName: 'Email Address', width: 220 },
    { field: 'licenseNumber', headerName: 'License ID', width: 150 },
    {
      field: 'vehicleAssigned',
      headerName: 'Vehicle',
      width: 150,
      renderCell: (params) => {
        if (!params || !params.row) return 'N/A';
        
        if (!params.row.vehicleAssigned) {
          return <Chip label="Not Assigned" variant="outlined" size="small" />;
        }
        
        const licensePlate = params.row.vehicleAssigned.licensePlate ? 
          params.row.vehicleAssigned.licensePlate : 'Assigned';
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ color: '#2e7d32', mr: 1 }} />
            <div>{licensePlate}</div>
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
      )
    },
    { 
      field: 'dateOfJoining', 
      headerName: 'Joined On', 
      width: 150, 
      renderCell: (params) => {
        if (!params.value) return <div>N/A</div>;
        
        try {
          const date = new Date(params.value);
          return <div>{isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()}</div>;
        } catch (error) {
          return <div>N/A</div>;
        }
      }
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

  // Map drivers to rows for DataGrid
  const rows = drivers
    .filter((driver) => driver && driver._id)
    .map((driver) => ({
      id: driver._id,
      _id: driver._id,
      ...driver,
    }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: '600', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
            <BadgeIcon sx={{ mr: 1, fontSize: 32 }} />
            Driver Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedDriver(null);
              setOpenDialog(true);
            }}
            disabled={loading}
            sx={{ borderRadius: 28, px: 3, py: 1 }}
          >
            Add Driver
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

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

      {/* Driver Form Dialog */}
      <DriverForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleFormSubmit}
        driver={selectedDriver}
      />
    </Container>
  );
};

export default DriverManagement;