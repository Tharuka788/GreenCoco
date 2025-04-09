const Finance = require('../models/financeModel');

// Add Income
exports.addIncome = async (req, res, next) => {
  try {
    const { source, amount, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) {
      const newFinance = new Finance({ income: [{ source, amount, description }] });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }
    finance.income.push({ source, amount, description });
    finance.transactions.push({ type: 'income', amount, description });
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    next(error);
  }
};

// Get Income (All or Specific)
exports.getIncome = async (req, res, next) => {
  try {
    const { incomeId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    if (incomeId) {
      const income = finance.income.id(incomeId);
      if (!income) return res.status(404).json({ message: 'Income not found' });
      return res.status(200).json(income);
    }

    res.status(200).json(finance.income);
  } catch (error) {
    next(error);
  }
};

// Update Income
exports.updateIncome = async (req, res, next) => {
  try {
    const { incomeId } = req.params;
    const { source, amount, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const income = finance.income.id(incomeId);
    if (!income) return res.status(404).json({ message: 'Income not found' });

    income.source = source || income.source;
    income.amount = amount || income.amount;
    income.description = description || income.description;

    const transaction = finance.transactions.find(t => t.type === 'income' && t.amount === income.amount);
    if (transaction) {
      transaction.amount = income.amount;
      transaction.description = income.description;
    }

    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Delete Income
exports.deleteIncome = async (req, res, next) => {
  try {
    const { incomeId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const income = finance.income.id(incomeId);
    if (!income) return res.status(404).json({ message: 'Income not found' });

    finance.income.pull(incomeId);
    finance.transactions = finance.transactions.filter(t => !(t.type === 'income' && t.amount === income.amount));
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Add Expense
exports.addExpense = async (req, res, next) => {
  try {
    const { category, amount, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) {
      const newFinance = new Finance({ expenses: [{ category, amount, description }] });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }
    finance.expenses.push({ category, amount, description });
    finance.transactions.push({ type: 'expense', amount, description });
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    next(error);
  }
};

// Get Expense (All or Specific)
exports.getExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    if (expenseId) {
      const expense = finance.expenses.id(expenseId);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });
      return res.status(200).json(expense);
    }

    res.status(200).json(finance.expenses);
  } catch (error) {
    next(error);
  }
};

// Update Expense
exports.updateExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const { category, amount, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const expense = finance.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;

    const transaction = finance.transactions.find(t => t.type === 'expense' && t.amount === expense.amount);
    if (transaction) {
      transaction.amount = expense.amount;
      transaction.description = expense.description;
    }

    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Delete Expense
exports.deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const expense = finance.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    finance.expenses.pull(expenseId);
    finance.transactions = finance.transactions.filter(t => !(t.type === 'expense' && t.amount === expense.amount));
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Add Salary
exports.addSalary = async (req, res, next) => {
  try {
    const { employeeId, amount } = req.body;
    const finance = await Finance.findOne();
    if (!finance) {
      const newFinance = new Finance({ salaries: [{ employeeId, amount }] });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }
    finance.salaries.push({ employeeId, amount });
    finance.transactions.push({ type: 'salary', amount });
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    next(error);
  }
};

// Get Salary (All or Specific)
exports.getSalary = async (req, res, next) => {
  try {
    const { salaryId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    if (salaryId) {
      const salary = finance.salaries.id(salaryId);
      if (!salary) return res.status(404).json({ message: 'Salary not found' });
      return res.status(200).json(salary);
    }

    res.status(200).json(finance.salaries);
  } catch (error) {
    next(error);
  }
};

// Update Salary
exports.updateSalary = async (req, res, next) => {
  try {
    const { salaryId } = req.params;
    const { employeeId, amount } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const salary = finance.salaries.id(salaryId);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    salary.employeeId = employeeId || salary.employeeId;
    salary.amount = amount || salary.amount;

    const transaction = finance.transactions.find(t => t.type === 'salary' && t.amount === salary.amount);
    if (transaction) {
      transaction.amount = salary.amount;
    }

    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Delete Salary
exports.deleteSalary = async (req, res, next) => {
  try {
    const { salaryId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const salary = finance.salaries.id(salaryId);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    finance.salaries.pull(salaryId);
    finance.transactions = finance.transactions.filter(t => !(t.type === 'salary' && t.amount === salary.amount));
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Get Transaction History
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No transactions found' });
    res.status(200).json(finance.transactions);
  } catch (error) {
    next(error);
  }
};

// Calculate Profit & Loss
exports.getProfitLoss = async (req, res, next) => {
  try {
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No financial data found' });

    const totalIncome = finance.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = finance.expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSalaries = finance.salaries.reduce((sum, item) => sum + item.amount, 0);
    const profitLoss = totalIncome - (totalExpenses + totalSalaries);

    res.status(200).json({
      totalIncome,
      totalExpenses,
      totalSalaries,
      profitLoss,
    });
  } catch (error) {
    next(error);
  }
};