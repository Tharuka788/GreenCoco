const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  income: [
    {
      source: { type: String, required: true },
      amount: { type: Number, required: true },
      category: { type: String },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  expenses: [
    {
      category: { type: String, required: true }, // Maps to "title" from frontend
      amount: { type: Number, required: true },
      expenseCategory: { type: String }, // New field for category
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  salaries: [
    {
      employeeId: { type: String, required: true }, // Maps to "title" from frontend
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  transactions: [
    {
      type: { type: String, enum: ['income', 'expense', 'salary'], required: true },
      amount: { type: Number, required: true },
      category: { type: String }, // Keep category for income and expenses
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  scheduledPayments: [
    {
      utilityType: {
        type: String,
        required: true,
        enum: ['Electricity', 'Water', 'Internet', 'Gas', 'Other'],
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      dueDate: {
        type: String, // Storing as string (e.g., "2025-05-01") to match frontend format
        required: true,
      },
      frequency: {
        type: String,
        required: true,
        enum: ['monthly', 'quarterly', 'annually', 'one-time'],
      },
      status: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

// Middleware to update `updatedAt` for scheduled payments on save
financeSchema.pre('save', function (next) {
  this.scheduledPayments.forEach((payment) => {
    if (payment.isModified()) {
      payment.updatedAt = Date.now();
    }
  });
  next();
});

module.exports = mongoose.model('Finance', financeSchema);