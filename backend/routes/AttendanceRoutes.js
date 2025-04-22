const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Record check-in
router.post("/check-in", async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Create new attendance record
    const checkInTime = new Date();
    const status = checkInTime.getHours() >= 9 ? 'late' : 'present';

    const attendance = new Attendance({
      employeeId,
      date: today,
      checkIn: checkInTime,
      status
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record check-out
router.post("/check-out/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    attendance.checkOut = new Date();
    
    // Update status if working hours are less than 4 (half-day)
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    if (hours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records for an employee
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      employeeId: req.params.employeeId
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employeeId', 'EmployeeName EmployeeId');
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's attendance for all employees
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const records = await Attendance.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('employeeId', 'EmployeeName EmployeeId');
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attendance record (for admin)
router.put("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 