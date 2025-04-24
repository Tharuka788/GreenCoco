const mongoose = require('mongoose');

const transportJobSchema = new mongoose.Schema({
    jobType: {
      type: String,
      required: true,
      enum: ['collect-waste', 'transport-products'],
    },
    startPoint: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    endPoint: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    wasteType: {
      type: String,
      required: true,
      enum: ['coconut-shells', 'coconut-husk', 'coconut-water', 'other'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    specialRequirements: {
      type: String,
      default: '',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    distance: {
      type: Number, // Distance in meters
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  });
  
module.exports = mongoose.model('TransportJob', transportJobSchema);