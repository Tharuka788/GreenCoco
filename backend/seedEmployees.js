const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

const employees = [
  {
    EmployeeName: "John Smith",
    DepartmentName: "IT",
    EmployeeId: "EMP001",
    PhoneNumber: 1234567890,
    Email: "john.smith@greencoco.com",
    JobRole: "Software Engineer",
    BasicSalary: 75000,
    Bonus: 5000,
    OverTimeHours: 10
  },
  {
    EmployeeName: "Sarah Johnson",
    DepartmentName: "HR",
    EmployeeId: "EMP002",
    PhoneNumber: 2345678901,
    Email: "sarah.johnson@greencoco.com",
    JobRole: "HR Manager",
    BasicSalary: 65000,
    Bonus: 3000,
    OverTimeHours: 5
  },
  {
    EmployeeName: "Michael Chen",
    DepartmentName: "Finance",
    EmployeeId: "EMP003",
    PhoneNumber: 3456789012,
    Email: "michael.chen@greencoco.com",
    JobRole: "Financial Analyst",
    BasicSalary: 70000,
    Bonus: 4000,
    OverTimeHours: 8
  },
  {
    EmployeeName: "Emily Davis",
    DepartmentName: "Marketing",
    EmployeeId: "EMP004",
    PhoneNumber: 4567890123,
    Email: "emily.davis@greencoco.com",
    JobRole: "Marketing Manager",
    BasicSalary: 68000,
    Bonus: 3500,
    OverTimeHours: 6
  },
  {
    EmployeeName: "David Wilson",
    DepartmentName: "Operations",
    EmployeeId: "EMP005",
    PhoneNumber: 5678901234,
    Email: "david.wilson@greencoco.com",
    JobRole: "Operations Manager",
    BasicSalary: 72000,
    Bonus: 4500,
    OverTimeHours: 12
  }
];

const seedEmployees = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencoco');
    console.log('Connected to MongoDB');

    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Insert new employees
    const createdEmployees = await Employee.insertMany(employees);
    console.log(`Successfully added ${createdEmployees.length} employees`);

    // Fetch and display the added employees
    const fetchedEmployees = await Employee.find({});
    console.log('\nAdded Employees:');
    fetchedEmployees.forEach(emp => {
      console.log(`- ${emp.EmployeeName} (${emp.EmployeeId}): ${emp.JobRole}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding employees:', error);
    process.exit(1);
  }
};

seedEmployees(); 