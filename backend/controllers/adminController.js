const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Register a new admin
const registerAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validation
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if admin already exists
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin
  const admin = await Admin.create({
    email,
    password: hashedPassword,
    role: 'admin',
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

// Login an admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please add email and password' });
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({
    _id: admin._id,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id),
  });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { 
      id,
      role: 'admin'  // Add the role to the token payload
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d',
    }
  );
};

// Get admin overview data
const getAdminOverview = async (req, res) => {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    const overviewData = {
      totalRevenue: 100000,
      lowStockItems: 5,
      pendingOrders: 10,
      activeSuppliers: 15,
      employeeCount: 20,
      pendingDeliveries: 3,
    };

    res.status(200).json(overviewData);
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ message: 'Error fetching admin overview' });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdminOverview };