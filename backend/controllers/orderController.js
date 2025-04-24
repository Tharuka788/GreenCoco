const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { wasteType, quantity, amount, address, phoneNumber, email } = req.body;

    // Log the received data
    console.log('Received order data:', req.body);

    // Validate required fields
    const requiredFields = ['wasteType', 'quantity', 'amount', 'address', 'phoneNumber', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate waste type
    const validWasteTypes = ['CoconutHusk', 'CoconutShell', 'CoconutFiber', 'CoconutPith', 'CoconutLeaves', 'CoconutTrunk'];
    if (!validWasteTypes.includes(wasteType)) {
      return res.status(400).json({
        message: 'Invalid waste type',
        validWasteTypes
      });
    }

    const order = new Order({
      wasteType,
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
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Update an order by ID
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { wasteType, quantity, amount, address, phoneNumber, email, status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate waste type if provided
    if (wasteType) {
      const validWasteTypes = ['CoconutHusk', 'CoconutShell', 'CoconutFiber', 'CoconutPith', 'CoconutLeaves', 'CoconutTrunk'];
      if (!validWasteTypes.includes(wasteType)) {
        return res.status(400).json({
          message: 'Invalid waste type',
          validWasteTypes
        });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Pending', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status',
          validStatuses
        });
      }
    }

    // Validate quantity and amount if provided
    if (quantity && quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate email if provided
    if (email && !email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number if provided
    if (phoneNumber && !phoneNumber.match(/^\d{10}$/)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }

    // Update only the provided fields
    const updateData = {
      ...(wasteType && { wasteType }),
      ...(quantity && { quantity }),
      ...(amount && { amount }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(email && { email }),
      ...(status && { status })
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Order update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
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