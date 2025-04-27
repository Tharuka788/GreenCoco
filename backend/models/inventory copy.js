const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  sourceLocation: {
    type: String,
    required: true,
  },
  wasteType: {
    type: String,
    required: true,
  },
  qualityGrade: {
    type: String,
    required: true,
  },
  processingStatus: {
    type: String,
    default: 'Pending',
  },
  processingMethod: {
    type: String,
  },
  notes: {
    type: String,
  },
  batchId: {
    type: String,
    required: true,
  },
  totalWeight: {
    type: Number,
    required: true,
  },
  collectionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inventory', inventorySchema);