const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const financeRoutes = require('./routes/financeRoutes');
const inventorys = require('./routes/inventorys');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors'); // Ensure CORS is included

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/finance', financeRoutes);
app.use('/api/inventory', inventorys);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000; // Change port to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});