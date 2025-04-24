import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapWrapper from './MapWrapper'; // Import the wrapper
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TransportJobForm = ({ open, onClose, onSubmit, job }) => {
  const [formData, setFormData] = useState({
    jobType: 'collect-waste',
    startPoint: { latitude: 6.9271, longitude: 79.8612 },
    endPoint: { latitude: 6.9214, longitude: 79.8562 },
    wasteType: 'coconut-shells',
    quantity: '',
    specialRequirements: '',
    assignedDriver: '',
    assignedVehicle: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDriversAndVehicles = async () => {
      try {
        const driversResponse = await axios.get('http://localhost:5000/api/drivers');
        const vehiclesResponse = await axios.get('http://localhost:5000/api/vehicles');
        setDrivers(driversResponse.data.filter((driver) => driver.status === 'available'));
        setVehicles(vehiclesResponse.data.filter((vehicle) => vehicle.status === 'available'));
      } catch (error) {
        console.error('Error fetching drivers and vehicles:', error);
        enqueueSnackbar('Failed to fetch drivers and vehicles', { variant: 'error' });
      }
    };
    fetchDriversAndVehicles();
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (job) {
      setFormData({
        jobType: job.jobType || 'collect-waste',
        startPoint: job.startPoint || { latitude: 6.9271, longitude: 79.8612 },
        endPoint: job.endPoint || { latitude: 6.9214, longitude: 79.8562 },
        wasteType: job.wasteType || 'coconut-shells',
        quantity: job.quantity || '',
        specialRequirements: job.specialRequirements || '',
        assignedDriver: job.assignedDriver?._id || '',
        assignedVehicle: job.assignedVehicle?._id || '',
        status: job.status || 'pending',
      });
      setStartMarker([job.startPoint.latitude, job.startPoint.longitude]);
      setEndMarker([job.endPoint.latitude, job.endPoint.longitude]);
    } else {
      setFormData({
        jobType: 'collect-waste',
        startPoint: { latitude: 6.9271, longitude: 79.8612 },
        endPoint: { latitude: 6.9214, longitude: 79.8562 },
        wasteType: 'coconut-shells',
        quantity: '',
        specialRequirements: '',
        assignedDriver: '',
        assignedVehicle: '',
        status: 'pending',
      });
      setStartMarker([6.9271, 79.8612]);
      setEndMarker([6.9214, 79.8562]);
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobType) newErrors.jobType = 'Job Type is required';
    if (!formData.wasteType) newErrors.wasteType = 'Waste Type is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (isNaN(formData.quantity) || formData.quantity <= 0) newErrors.quantity = 'Quantity must be a positive number';
    if (!formData.assignedDriver) newErrors.assignedDriver = 'Driver is required';
    if (!formData.assignedVehicle) newErrors.assignedVehicle = 'Vehicle is required';
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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (selectingStart) {
          setFormData({ ...formData, startPoint: { latitude: lat, longitude: lng } });
          setStartMarker([lat, lng]);
          setSelectingStart(false);
        } else {
          setFormData({ ...formData, endPoint: { latitude: lat, longitude: lng } });
          setEndMarker([lat, lng]);
          setSelectingStart(true);
        }
      },
    });
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{job ? 'Edit Transport Job' : 'Add Transport Job'}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Job Type"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.jobType}
          helperText={errors.jobType}
        >
          <MenuItem value="collect-waste">Collect Waste</MenuItem>
          <MenuItem value="transport-products">Transport Products</MenuItem>
        </TextField>

        <TextField
          select
          label="Waste Type"
          name="wasteType"
          value={formData.wasteType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.wasteType}
          helperText={errors.wasteType}
        >
          <MenuItem value="coconut-shells">Coconut Shells</MenuItem>
          <MenuItem value="coconut-husk">Coconut Husk</MenuItem>
          <MenuItem value="coconut-water">Coconut Water</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Quantity (tons)"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.quantity}
          helperText={errors.quantity}
        />

        <TextField
          label="Special Requirements"
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />

        <TextField
          select
          label="Assigned Driver"
          name="assignedDriver"
          value={formData.assignedDriver}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.assignedDriver}
          helperText={errors.assignedDriver}
        >
          {drivers.map((driver) => (
            <MenuItem key={driver._id} value={driver._id}>
              {driver.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Assigned Vehicle"
          name="assignedVehicle"
          value={formData.assignedVehicle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.assignedVehicle}
          helperText={errors.assignedVehicle}
        >
          {vehicles.map((vehicle) => (
            <MenuItem key={vehicle._id} value={vehicle._id}>
              {vehicle.licensePlate} ({vehicle.vehicleType})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Select Route on Map
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {selectingStart ? 'Click on the map to set the Start Point' : 'Click on the map to set the End Point'}
        </Typography>
        <Box sx={{ height: 300, width: '100%', mt: 2 }}>
          <MapWrapper
            center={[6.9271, 79.8612]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {startMarker && <Marker position={startMarker} />}
            {endMarker && <Marker position={endMarker} />}
            <MapClickHandler />
          </MapWrapper>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Start Point: Lat: {formData.startPoint.latitude}, Lng: {formData.startPoint.longitude}
          </Typography>
          <Typography>
            End Point: Lat: {formData.endPoint.latitude}, Lng: {formData.endPoint.longitude}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {job ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransportJobForm;