const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  income: [
    {
      source: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  expenses: [
    {
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
  salaries: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  transactions: [
    {
      type: { type: String, enum: ['income', 'expense', 'salary'], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Finance', financeSchema);