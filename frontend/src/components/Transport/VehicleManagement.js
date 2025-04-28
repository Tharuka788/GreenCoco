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
  Divider
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import BuildIcon from '@mui/icons-material/Build';
import VehicleForm from './VehicleForm';
import { useSnackbar } from 'notistack';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch vehicles from the backend
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        console.log('Fetched vehicles:', response.data);
        setVehicles(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        enqueueSnackbar('Failed to fetch vehicles', { variant: 'error' });
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [enqueueSnackbar]);

  // Handle delete vehicle
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
        enqueueSnackbar('Vehicle deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        enqueueSnackbar('Failed to delete vehicle', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit vehicle
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDialog(true);
  };

  // Handle add/edit vehicle submission
  const handleFormSubmit = async (vehicleData) => {
    setLoading(true);
    try {
      if (selectedVehicle) {
        // Update vehicle
        const response = await axios.put(`http://localhost:5000/api/vehicles/${selectedVehicle._id}`, vehicleData);
        setVehicles(vehicles.map((vehicle) => (vehicle._id === selectedVehicle._id ? response.data : vehicle)));
        enqueueSnackbar('Vehicle updated successfully', { variant: 'success' });
      } else {
        // Add new vehicle
        const response = await axios.post('http://localhost:5000/api/vehicles', vehicleData);
        setVehicles([...vehicles, response.data]);
        enqueueSnackbar('Vehicle added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save vehicle', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Status chip colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'success';
      case 'in-use': return 'primary';
      case 'maintenance': return 'warning';
      case 'out-of-service': return 'error';
      default: return 'default';
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { 
      field: 'vehicleType', 
      headerName: 'Vehicle Type', 
      width: 150, 
      filterable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ color: '#2e7d32', mr: 1 }} />
          <div>{params.value}</div>
        </Box>
      )
    },
    { field: 'licensePlate', headerName: 'License Plate', width: 150 },
    { field: 'capacity', headerName: 'Capacity (tons)', width: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
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
      field: 'assignedDriver',
      headerName: 'Assigned Driver',
      width: 180,
      renderCell: (params) => {
        if (!params.row) return 'N/A';
        
        const driver = params.row.assignedDriver;
        if (!driver) {
          return <Chip label="Not Assigned" variant="outlined" size="small" />;
        }
        
        const driverName = typeof driver === 'object' && driver.name ? driver.name : driver.toString();
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BadgeIcon sx={{ color: '#2e7d32', mr: 1 }} />
            <div>{driverName}</div>
          </Box>
        );
      },
    },
    {
      field: 'lastMaintenanceDate',
      headerName: 'Last Maintenance',
      width: 180,
      renderCell: (params) => {
        if (!params.value) return <Chip label="No Record" variant="outlined" size="small" />;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BuildIcon sx={{ color: '#2e7d32', mr: 1 }} />
            <div>{new Date(params.value).toLocaleDateString()}</div>
          </Box>
        );
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Added On', 
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

  // Map vehicles to rows for DataGrid
  const rows = vehicles
    .filter((vehicle) => vehicle && vehicle._id)
    .map((vehicle) => ({
      id: vehicle._id,
      _id: vehicle._id,
      ...vehicle,
    }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: '600', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ mr: 1, fontSize: 32 }} />
            Vehicle Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedVehicle(null);
              setOpenDialog(true);
            }}
            disabled={loading}
            sx={{ borderRadius: 28, px: 3, py: 1 }}
          >
            Add Vehicle
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

      {/* Vehicle Form Dialog */}
      <VehicleForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
      />
    </Container>
  );
};

export default VehicleManagement;
