const mongoose = require('mongoose');


const vehicleSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
    enum: ['truck', 'van', 'pickup', 'other'],
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'under-maintenance'],
    default: 'available',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  jobHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportJob',
    },
  ],
  lastMaintenanceDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);