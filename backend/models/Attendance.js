const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    required: true
  },
  workHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate work hours when checking out
AttendanceSchema.pre('save', function(next) {
  if (this.checkOut && this.checkIn) {
    const hours = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.workHours = parseFloat(hours.toFixed(2));
  }
  next();
});

module.exports = mongoose.model("Attendance", AttendanceSchema); 