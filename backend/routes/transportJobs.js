const express = require('express');
const router = express.Router();
const TransportJob = require('../models/transportJob');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const geolib = require('geolib');

// Create a new transport job
router.post('/', async (req, res) => {
    try {
      const {
        jobType,
        startPoint,
        endPoint,
        wasteType,
        quantity,
        specialRequirements,
        assignedDriver,
        assignedVehicle,
      } = req.body;
  
      // Validate required fields
      if (!jobType || !startPoint || !endPoint || !wasteType || !quantity || !assignedDriver || !assignedVehicle) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }
  
      // Validate startPoint and endPoint
      if (
        !startPoint.latitude ||
        !startPoint.longitude ||
        !endPoint.latitude ||
        !endPoint.longitude ||
        isNaN(startPoint.latitude) ||
        isNaN(startPoint.longitude) ||
        isNaN(endPoint.latitude) ||
        isNaN(endPoint.longitude)
      ) {
        return res.status(400).json({ message: 'Invalid coordinates for start or end point' });
      }
  
      // Validate quantity
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
      }
  
      // Check if the driver exists and is available
      const driver = await Driver.findById(assignedDriver);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      if (driver.status !== 'available') {
        return res.status(400).json({ message: 'Driver is not available' });
      }
  
      // Check if the vehicle exists and is available
      const vehicle = await Vehicle.findById(assignedVehicle);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      if (vehicle.status !== 'available') {
        return res.status(400).json({ message: 'Vehicle is not available' });
      }
  
      // Check if the vehicle has sufficient capacity
      if (vehicle.capacity < quantity) {
        return res.status(400).json({ message: 'Vehicle capacity is insufficient for the quantity' });
      }
  
      // Create the transport job
      const transportJob = new TransportJob({
        jobType,
        startPoint,
        endPoint,
        wasteType,
        quantity,
        specialRequirements,
        assignedDriver,
        assignedVehicle,
      });
  
      // Update driver and vehicle status
      driver.status = 'on-duty';
      driver.vehicleAssigned = vehicle._id;
      driver.jobHistory.push(transportJob._id);
      await driver.save();
  
      vehicle.status = 'in-use';
      vehicle.assignedDriver = driver._id;
      vehicle.jobHistory.push(transportJob._id);
      await vehicle.save();
  
      // Save the transport job
      await transportJob.save();
  
      // Populate driver and vehicle details in the response
      const populatedJob = await TransportJob.findById(transportJob._id)
        .populate('assignedDriver', 'name')
        .populate('assignedVehicle', 'licensePlate');
  
      res.status(201).json(populatedJob);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Get all transport jobs
router.get('/', async (req, res) => {
  try {
    const transportJobs = await TransportJob.find()
      .populate('assignedDriver', 'name')
      .populate('assignedVehicle', 'licensePlate');
    res.json(transportJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single transport job by ID
router.get('/:id', async (req, res) => {
  try {
    const transportJob = await TransportJob.findById(req.params.id)
      .populate('assignedDriver', 'name')
      .populate('assignedVehicle', 'licensePlate');
    if (!transportJob) return res.status(404).json({ message: 'Transport job not found' });
    res.json(transportJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a transport job (e.g., change status, update details)
router.put('/:id', async (req, res) => {
  try {
    const { status, completedAt } = req.body;

    const transportJob = await TransportJob.findById(req.params.id);
    if (!transportJob) return res.status(404).json({ message: 'Transport job not found' });

    // If updating status to completed, set completedAt and free up driver/vehicle
    if (status === 'completed') {
      const driver = await Driver.findById(transportJob.assignedDriver);
      const vehicle = await Vehicle.findById(transportJob.assignedVehicle);

      if (driver) {
        driver.status = 'available';
        driver.vehicleAssigned = null;
        await driver.save();
      }

      if (vehicle) {
        vehicle.status = 'available';
        vehicle.assignedDriver = null;
        await vehicle.save();
      }

      transportJob.completedAt = completedAt || Date.now();
    }

    // Update other fields
    Object.assign(transportJob, req.body);
    await transportJob.save();

    // Populate driver and vehicle details in the response
    const populatedJob = await TransportJob.findById(transportJob._id)
      .populate('assignedDriver', 'name')
      .populate('assignedVehicle', 'licensePlate');

    res.json(populatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a transport job
router.delete('/:id', async (req, res) => {
  try {
    const transportJob = await TransportJob.findById(req.params.id);
    if (!transportJob) return res.status(404).json({ message: 'Transport job not found' });

    // If the job is not completed or cancelled, free up the driver and vehicle
    if (transportJob.status !== 'completed' && transportJob.status !== 'cancelled') {
      const driver = await Driver.findById(transportJob.assignedDriver);
      const vehicle = await Vehicle.findById(transportJob.assignedVehicle);

      if (driver) {
        driver.status = 'available';
        driver.vehicleAssigned = null;
        await driver.save();
      }

      if (vehicle) {
        vehicle.status = 'available';
        vehicle.assignedDriver = null;
        await vehicle.save();
      }
    }

    await TransportJob.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transport job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transport jobs by status
router.get('/status/:status', async (req, res) => {
  try {
    const transportJobs = await TransportJob.find({ status: req.params.status })
      .populate('assignedDriver', 'name')
      .populate('assignedVehicle', 'licensePlate');
    res.json(transportJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;