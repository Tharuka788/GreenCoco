const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Register a new supplier
router.post('/register', supplierController.registerSupplier);

// Get all suppliers
router.get('/', supplierController.getAllSuppliers);

// Update a supplier by ID
router.put('/:id', supplierController.updateSupplier);

// Delete a supplier by ID
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;