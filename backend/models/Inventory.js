const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
  collectionDate: {
    type: Date,
    required: true,
  },
  sourceLocation: {
    type: String,
    required: true,
  },
  totalWeight: {
    type: Number,
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
    required: true,
  },
  processingMethod: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  lowStockNotified: { // New field to track if notification was sent
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);