const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const financeRoutes = require('./routes/financeRoutes');
const inventorys = require('./routes/inventorys');
const userRoutes = require('./routes/userRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const attendanceRoutes = require('./routes/AttendanceRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add admin routes
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/finance', financeRoutes);
app.use('/inventory', inventorys);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/api/admins', adminRoutes); // Add admin routes


// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});