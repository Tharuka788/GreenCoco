const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

// @desc    Register a new supplier
// @route   POST /api/suppliers
// @access  Public
const registerSupplier = asyncHandler(async (req, res) => {
  const { supplierName, email, supplierProduct, quantity, amount } = req.body;

  // Check if supplier exists
  const supplierExists = await Supplier.findOne({ email });
  if (supplierExists) {
    res.status(400);
    throw new Error('Supplier already exists');
  }

  // Create supplier
  const supplier = await Supplier.create({
    supplierName,
    email,
    supplierProduct,
    quantity,
    amount
  });

  if (supplier) {
    res.status(201).json(supplier);
  } else {
    res.status(400);
    throw new Error('Invalid supplier data');
  }
});

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({});
  res.json(suppliers);
});

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  
  if (supplier) {
    res.json(supplier);
  } else {
    res.status(404);
    throw new Error('Supplier not found');
  }
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Public
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  const updatedSupplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedSupplier);
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Public
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  await supplier.deleteOne();
  res.json({ message: 'Supplier removed' });
});

module.exports = {
  registerSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};