const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const Driver = require('../models/driver');

// Create a new vehicle
router.post('/', async (req, res) => {
  try {
    // Manual validation for license plate (example: must be alphanumeric)
    const licensePlate = req.body.licensePlate;
    if (!licensePlate || !/^[a-zA-Z0-9-]+$/.test(licensePlate)) {
      return res.status(400).json({ message: 'Invalid license plate format' });
    }

    // Manual validation for capacity (must be a positive number)
    const capacity = req.body.capacity;
    if (!capacity || isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be a positive number' });
    }

    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver', 'name');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver', 'name');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vehicle
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedDriver', 'name');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // If the vehicle is assigned to a driver, unassign it
    if (vehicle.assignedDriver) {
      await Driver.findByIdAndUpdate(vehicle.assignedDriver, { vehicleAssigned: null });
    }

    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign a vehicle to a driver
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverId } = req.body;

    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Check if the driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    // Unassign the vehicle from the previous driver (if any)
    if (vehicle.assignedDriver) {
      await Driver.findByIdAndUpdate(vehicle.assignedDriver, { vehicleAssigned: null });
    }

    // Assign the vehicle to the new driver
    vehicle.assignedDriver = driverId;
    vehicle.status = 'in-use';
    await vehicle.save();

    // Update the driver's vehicleAssigned field
    driver.vehicleAssigned = vehicle._id;
    driver.status = 'on-duty';
    await driver.save();

    res.json({ message: 'Vehicle assigned to driver', vehicle, driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Unassign a vehicle from a driver
router.put('/:id/unassign-driver', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (!vehicle.assignedDriver) return res.status(400).json({ message: 'No driver assigned to this vehicle' });

    // Unassign the vehicle from the driver
    const driver = await Driver.findById(vehicle.assignedDriver);
    if (driver) {
      driver.vehicleAssigned = null;
      driver.status = 'available';
      await driver.save();
    }

    // Update the vehicle
    vehicle.assignedDriver = null;
    vehicle.status = 'available';
    await vehicle.save();

    res.json({ message: 'Vehicle unassigned from driver', vehicle });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get vehicles by status
router.get('/status/:status', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: req.params.status }).populate('assignedDriver', 'name');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;