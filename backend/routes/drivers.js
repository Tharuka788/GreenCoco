const express = require('express');
const router = express.Router();
const Driver = require('../models/driver');
const validator = require('validator');

// Create a new driver
router.post('/', async (req, res) => {
    try {
      // Validate email
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      // Validate phone (example: must be 10 digits)
      if (!validator.isMobilePhone(req.body.phone, 'any')) {
        return res.status(400).json({ message: 'Invalid phone number' });
      }
  
      const driver = new Driver(req.body);
      await driver.save();
      res.status(201).json(driver);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().populate('vehicleAssigned', 'licensePlate'); // Populate licensePlate field
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a single driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get drivers by status
router.get('/status/:status', async (req, res) => {
    try {
      const drivers = await Driver.find({ status: req.params.status });
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;