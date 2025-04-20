const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['shell', 'husk', 'water', 'meat', 'other']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'liters', 'pieces']
  },
  storageLocation: {
    type: String,
    required: [true, 'Storage location is required']
  },
  picture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files' // Reference to GridFS files collection
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['available', 'processing', 'disposed'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);