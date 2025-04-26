const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Coconut Waste Backend is running');
});

// Import routes (we'll create these next)
const inventoryRoutes = require('./routes/inventory');
const driverRoutes = require('./routes/drivers');
const vehicleRoutes = require('./routes/vehicles');
const transportJobRoutes = require('./routes/transportJobs');

app.use('/api/inventory', inventoryRoutes);


// Import driver routes

app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transport-jobs', transportJobRoutes);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
