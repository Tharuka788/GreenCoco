import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';

const VehicleForm = ({ open, onClose, onSubmit, vehicle }) => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    licensePlate: '',
    capacity: '',
    status: 'available',
    lastMaintenanceDate: '',
  });
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleType: vehicle.vehicleType || '',
        licensePlate: vehicle.licensePlate || '',
        capacity: vehicle.capacity || '',
        status: vehicle.status || 'available',
        lastMaintenanceDate: vehicle.lastMaintenanceDate ? vehicle.lastMaintenanceDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        vehicleType: '',
        licensePlate: '',
        capacity: '',
        status: 'available',
        lastMaintenanceDate: '',
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle Type is required';
    if (!formData.licensePlate) newErrors.licensePlate = 'License Plate is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (isNaN(formData.capacity) || formData.capacity <= 0) newErrors.capacity = 'Capacity must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Vehicle Type"
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.vehicleType}
          helperText={errors.vehicleType}
        >
          <MenuItem value="truck">Truck</MenuItem>
          <MenuItem value="van">Van</MenuItem>
          <MenuItem value="pickup">Pickup</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
        <TextField
          label="License Plate"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.licensePlate}
          helperText={errors.licensePlate}
        />
        <TextField
          label="Capacity (tons)"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.capacity}
          helperText={errors.capacity}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="in-use">In Use</MenuItem>
          <MenuItem value="under-maintenance">Under Maintenance</MenuItem>
        </TextField>
        <TextField
          label="Last Maintenance Date"
          name="lastMaintenanceDate"
          type="date"
          value={formData.lastMaintenanceDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {vehicle ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;