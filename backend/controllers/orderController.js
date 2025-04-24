const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { productName, quantity, amount, address, phoneNumber, email } = req.body;

    // Log the received data
    console.log('Received order data:', req.body);

    // Validate required fields
    const requiredFields = ['productName', 'quantity', 'amount', 'address', 'phoneNumber', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    const order = new Order({
      productName,
      quantity,
      amount,
      address,
      phoneNumber,
      email,
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Order creation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Update an order by ID
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    await order.save();
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    next(error);
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};