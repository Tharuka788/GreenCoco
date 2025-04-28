const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({});
  res.json(invoices);
});

module.exports = { getInvoices }; 