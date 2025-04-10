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
router.get('/income', getIncome);
router.get('/income/:incomeId', getIncome);
router.put('/income/:incomeId', updateIncome);
router.delete('/income/:incomeId', deleteIncome);

// Expense Routes
router.post('/expense', addExpense);
router.get('/expense', getExpense);
router.get('/expense/:expenseId', getExpense);
router.put('/expense/:expenseId', updateExpense);
router.delete('/expense/:expenseId', deleteExpense);

// Salary Routes
router.post('/salary', addSalary);
router.get('/salary', getSalary);
router.get('/salary/:salaryId', getSalary);
router.put('/salary/:salaryId', updateSalary);
router.delete('/salary/:salaryId', deleteSalary);

// Other Routes
router.get('/transactions', getTransactionHistory);
router.get('/profit-loss', getProfitLoss);

module.exports = router;