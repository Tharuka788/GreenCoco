const Inventory = require('../models/Inventory');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

// Initialize GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public
const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().populate('picture');
  res.status(200).json(inventory);
});

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Public
const createInventory = asyncHandler(async (req, res) => {
  const { itemName, type, quantity, unit, storageLocation, status } = req.body;
  let pictureId = null;

  if (!itemName || !type || !quantity || !unit || !storageLocation) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (req.file) {
    pictureId = req.file.id;
  }

  const inventory = await Inventory.create({
    itemName,
    type,
    quantity,
    unit,
    storageLocation,
    picture: pictureId,
    status
  });

  res.status(201).json(inventory);
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Public
const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  let pictureId = inventory.picture;
  if (req.file) {
    // Delete old picture if exists
    if (inventory.picture) {
      await gfs.delete(new mongoose.Types.ObjectId(inventory.picture));
    }
    pictureId = req.file.id;
  }

  const updatedInventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    { ...req.body, picture: pictureId },
    { new: true }
  );

  res.status(200).json(updatedInventory);
});

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Public
const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  // Delete associated picture if exists
  if (inventory.picture) {
    await gfs.delete(new mongoose.Types.ObjectId(inventory.picture));
  }

  await inventory.remove();
  res.status(200).json({ id: req.params.id });
});

// @desc    Get inventory picture
// @route   GET /api/inventory/picture/:id
// @access  Public
const getPicture = asyncHandler(async (req, res) => {
  const fileId = new mongoose.Types.ObjectId(req.params.id);
  
  const file = await gfs.find(fileId).toArray();
  if (!file || file.length === 0) {
    res.status(404);
    throw new Error('Picture not found');
  }

  const readStream = gfs.openDownloadStream(fileId);
  readStream.pipe(res);
});

// @desc    Get low stock inventory items
// @route   GET /api/inventory/low-stock
// @access  Public
const getLowStockInventory = asyncHandler(async (req, res) => {
  const threshold = 10; // You can adjust this threshold as needed
  const lowStockItems = await Inventory.find({ totalWeight: { $lt: threshold } });
  res.status(200).json(lowStockItems);
});

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getPicture,
  getLowStockInventory
};