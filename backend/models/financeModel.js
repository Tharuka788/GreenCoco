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
}, { timestamps: true });

module.exports = mongoose.model('Finance', financeSchema);