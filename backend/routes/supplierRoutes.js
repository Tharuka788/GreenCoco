const express = require('express');
const router = express.Router();
const {
  registerSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierPerformanceOverview,
  getSupplierStats
} = require('../controllers/supplierController');

// @route   POST /api/suppliers/register
// @desc    Register a new supplier
// @access  Public
router.post('/', registerSupplier);

// @route   GET /api/suppliers
// @desc    Get all suppliers
// @access  Public
router.get('/', getSuppliers);

// @route   GET /api/suppliers/stats
// @desc    Get supplier statistics
// @access  Public
router.get('/stats', getSupplierStats);

// @route   GET /api/suppliers/performance
// @desc    Get supplier performance overview
// @access  Public
router.get('/performance', getSupplierPerformanceOverview);

// @route   GET /api/suppliers/:id
// @desc    Get supplier by ID
// @access  Public
router.get('/:id', getSupplierById);

// @route   PUT /api/suppliers/:id
// @desc    Update supplier
// @access  Public
router.put('/:id', updateSupplier);

// @route   DELETE /api/suppliers/:id
// @desc    Delete supplier
// @access  Public
router.delete('/:id', deleteSupplier);

module.exports = router;