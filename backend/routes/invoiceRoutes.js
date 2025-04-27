const express = require('express');
const router = express.Router();
const { getInvoices } = require('../controllers/invoiceController');

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Public
router.get('/', getInvoices);

module.exports = router; 