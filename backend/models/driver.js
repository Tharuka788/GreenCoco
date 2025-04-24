const mongoose = require('mongoose');

// In models/driver.js
const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null,
  },
  status: {
    type: String,
    enum: ['available', 'on-duty', 'off-duty'],
    default: 'available',
  },
  jobHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportJob',
    },
  ],
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model('Driver', driverSchema);