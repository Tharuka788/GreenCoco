const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');
const Order = require('../models/order');

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

// @desc    Supplier Performance Overview
// @route   GET /api/suppliers/performance
// @access  Public
const getSupplierPerformanceOverview = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({});
  const orders = await Order.find({});

  const performance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(order => order.email === supplier.email);
    const totalOrders = supplierOrders.length;
    const deliveredOrders = supplierOrders.filter(order => order.status === 'Delivered');
    const cancelledOrders = supplierOrders.filter(order => order.status === 'Cancelled');
    // If you have deliveryDate and expectedDeliveryDate, calculate on-time delivery
    let onTimeDeliveries = 0;
    deliveredOrders.forEach(order => {
      if (order.deliveryDate && order.expectedDeliveryDate && order.deliveryDate <= order.expectedDeliveryDate) {
        onTimeDeliveries++;
      }
    });
    return {
      _id: supplier._id,
      supplierName: supplier.supplierName,
      supplierProduct: supplier.supplierProduct,
      email: supplier.email,
      status: supplier.status,
      totalDelivered: deliveredOrders.length,
      deliverySuccessRate: totalOrders ? ((deliveredOrders.length / totalOrders) * 100).toFixed(2) : '0.00',
      onTimeDeliveryPercent: deliveredOrders.length ? ((onTimeDeliveries / deliveredOrders.length) * 100).toFixed(2) : 'N/A',
      canceledOrders: cancelledOrders.length,
      totalOrders: totalOrders
    };
  });

  res.json(performance);
});

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats
// @access  Public
const getSupplierStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  const completedOrders = await Order.countDocuments({ status: 'Delivered' });
  const totalRevenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = totalRevenueAgg[0]?.total || 0;

  res.json({
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue
  });
});

module.exports = {
  registerSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierPerformanceOverview,
  getSupplierStats
};
