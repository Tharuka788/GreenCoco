const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  EmployeeName: { type: String, required: true },
  DepartmentName: { type: String, required: true },
  EmployeeId: { type: String, required: true, unique: true },
  PhoneNumber: { type: Number, required: true, },
  Email: { type: String, required: true, unique: true },
  JobRole: { type: String, required: true },
  BasicSalary: { type: Number, required: true },
  EPF_ETF: { type: Number }, // Removed required: true
  Bonus: { type: Number, default: 0 },
  OverTimeHours: { type: Number, default: 0 }, // New field for overtime hours
  OverTimePayment: { type: Number, default: 0 }, // Overtime payment calculated based on hours
  NetSalary: { type: Number }, // Removed required: true
});

// Pre-save hook to calculate EPF_ETF, OverTimePayment, and NetSalary
EmployeeSchema.pre("save", function (next) {
  const epfRate = 0.08; // 8% EPF
  const etfRate = 0.03; // 3% ETF
  const overtimeRate = 500; // Overtime payment rate per hour

  // Calculate EPF and ETF contributions
  const epf = this.BasicSalary * epfRate;
  const etf = this.BasicSalary * etfRate;

  // Update EPF_ETF field
  this.EPF_ETF = epf + etf;

  // Calculate Overtime Payment (Overtime Hours * Overtime Rate)
  this.OverTimePayment = this.OverTimeHours * overtimeRate;

  // Calculate NetSalary (BasicSalary + Bonus + OverTimePayment - EPF_ETF)
  this.NetSalary = this.BasicSalary + this.Bonus + this.OverTimePayment - this.EPF_ETF;

  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);