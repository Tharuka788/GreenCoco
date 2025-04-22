const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  EmployeeName: { type: String, required: true },
  DepartmentName: { type: String, required: true },
  EmployeeId: { type: String, required: true, unique: true },
  PhoneNumber: { type: Number, required: true },
  Email: { type: String, required: true },
  JobRole: { type: String, required: true },
  BasicSalary: { type: Number, required: true },
  Bonus: { type: Number, default: 0 },
  OverTimeHours: { type: Number, default: 0 },
  OverTimePayment: { type: Number, default: 0 },
  EPF_ETF: { type: Number, default: 0 },
  NetSalary: { type: Number, default: 0 },
});

module.exports = mongoose.model('Employee', EmployeeSchema);