const express = require('express');
const router = express.Router();
const {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  addSalary,
  getSalary,
  updateSalary,
  deleteSalary,
  getTransactionHistory,
  getProfitLoss,
} = require('../controllers/financeController');

// Income Routes
router.post('/income', addIncome);
router.get('/income', getIncome);          // Get all income
router.get('/income/:incomeId', getIncome); // Get specific income
router.put('/income/:incomeId', updateIncome);
router.delete('/income/:incomeId', deleteIncome);

// Expense Routes
router.post('/expense', addExpense);
router.get('/expense', getExpense);          // Get all expenses
router.get('/expense/:expenseId', getExpense); // Get specific expense
router.put('/expense/:expenseId', updateExpense);
router.delete('/expense/:expenseId', deleteExpense);

// Salary Routes
router.post('/salary', addSalary);
router.get('/salary', getSalary);          // Get all salaries
router.get('/salary/:salaryId', getSalary); // Get specific salary
router.put('/salary/:salaryId', updateSalary);
router.delete('/salary/:salaryId', deleteSalary);

// Other Routes
router.get('/transactions', getTransactionHistory);
router.get('/profit-loss', getProfitLoss);

module.exports = router;