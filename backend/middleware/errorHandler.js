const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      details: err.message
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({
      message: 'Database Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
  }

  // Default error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    details: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};

module.exports = errorHandler;