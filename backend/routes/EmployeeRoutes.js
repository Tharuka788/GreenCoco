const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Create a new employee
router.post("/", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an employee by ID
router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    //validation
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Calculate EPF and ETF for a given salary
router.get("/calculate-epf-etf", async (req, res) => {
  try {
    const { salary } = req.query;

    //validation
    if (!salary || isNaN(salary)) {
      return res.status(400).send({ message: "Invalid salary provided" });
    }

    const epfRate = 0.08; // 8% EPF
    const etfRate = 0.03; // 3% ETF

    const epf = salary * epfRate;
    const etf = salary * etfRate;

    res.status(200).send({
      epf,
      etf,
      totalContribution: epf + etf,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;