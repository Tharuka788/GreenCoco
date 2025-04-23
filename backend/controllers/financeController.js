const Finance = require('../models/financeModel');

// Add Income
exports.addIncome = async (req, res, next) => {
  try {
    const { source, amount, category, date, description } = req.body;

    if (!source || !amount) {
      return res.status(400).json({ message: 'Source and amount are required' });
    }

    const finance = await Finance.findOne();
    const incomeEntry = {
      source,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : Date.now(),
      description,
    };

    if (!finance) {
      const newFinance = new Finance({ income: [incomeEntry] });
      newFinance.transactions.push({
        type: 'income',
        amount: incomeEntry.amount,
        category: incomeEntry.category,
        date: incomeEntry.date,
        description: incomeEntry.description,
      });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }

    finance.income.push(incomeEntry);
    finance.transactions.push({
      type: 'income',
      amount: incomeEntry.amount,
      category: incomeEntry.category,
      date: incomeEntry.date,
      description: incomeEntry.description,
    });
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
    const { source, amount, category, date, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const income = finance.income.id(incomeId);
    if (!income) return res.status(404).json({ message: 'Income not found' });

    income.source = source || income.source;
    income.amount = amount ? parseFloat(amount) : income.amount;
    income.category = category || income.category;
    income.date = date ? new Date(date) : income.date;
    income.description = description || income.description;

    const transaction = finance.transactions.find(
      (t) => t.type === 'income' && t.date.toISOString() === income.date.toISOString()
    );
    if (transaction) {
      transaction.amount = income.amount;
      transaction.category = income.category;
      transaction.date = income.date;
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
    finance.transactions = finance.transactions.filter(
      (t) => !(t.type === 'income' && t.date.toISOString() === income.date.toISOString())
    );
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Add Expense
exports.addExpense = async (req, res, next) => {
  try {
    const { category, amount, expenseCategory, date, description } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    const finance = await Finance.findOne();
    const expenseEntry = {
      category,
      amount: parseFloat(amount),
      expenseCategory,
      date: date ? new Date(date) : Date.now(),
      description,
    };

    if (!finance) {
      const newFinance = new Finance({ expenses: [expenseEntry] });
      newFinance.transactions.push({
        type: 'expense',
        amount: expenseEntry.amount,
        category: expenseEntry.expenseCategory,
        date: expenseEntry.date,
        description: expenseEntry.description,
      });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }

    finance.expenses.push(expenseEntry);
    finance.transactions.push({
      type: 'expense',
      amount: expenseEntry.amount,
      category: expenseEntry.expenseCategory,
      date: expenseEntry.date,
      description: expenseEntry.description,
    });
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
    const { category, amount, expenseCategory, date, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const expense = finance.expenses.id(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.category = category || expense.category;
    expense.amount = amount ? parseFloat(amount) : expense.amount;
    expense.expenseCategory = expenseCategory || expense.expenseCategory;
    expense.date = date ? new Date(date) : expense.date;
    expense.description = description || expense.description;

    const transaction = finance.transactions.find(
      (t) => t.type === 'expense' && t.date.toISOString() === expense.date.toISOString()
    );
    if (transaction) {
      transaction.amount = expense.amount;
      transaction.category = expense.expenseCategory;
      transaction.date = expense.date;
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
    finance.transactions = finance.transactions.filter(
      (t) => !(t.type === 'expense' && t.date.toISOString() === expense.date.toISOString())
    );
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Add Salary
exports.addSalary = async (req, res, next) => {
  try {
    const { employeeId, amount, date, description } = req.body;

    if (!employeeId || !amount) {
      return res.status(400).json({ message: 'Employee ID and amount are required' });
    }

    const finance = await Finance.findOne();
    const salaryEntry = {
      employeeId,
      amount: parseFloat(amount),
      date: date ? new Date(date) : Date.now(),
      description,
    };

    if (!finance) {
      const newFinance = new Finance({ salaries: [salaryEntry] });
      newFinance.transactions.push({
        type: 'salary',
        amount: salaryEntry.amount,
        date: salaryEntry.date,
        description: salaryEntry.description,
      });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }

    finance.salaries.push(salaryEntry);
    finance.transactions.push({
      type: 'salary',
      amount: salaryEntry.amount,
      date: salaryEntry.date,
      description: salaryEntry.description,
    });
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
    const { employeeId, amount, date, description } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const salary = finance.salaries.id(salaryId);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    salary.employeeId = employeeId || salary.employeeId;
    salary.amount = amount ? parseFloat(amount) : salary.amount;
    salary.date = date ? new Date(date) : salary.date;
    salary.description = description || salary.description;

    const transaction = finance.transactions.find(
      (t) => t.type === 'salary' && t.date.toISOString() === salary.date.toISOString()
    );
    if (transaction) {
      transaction.amount = salary.amount;
      transaction.date = salary.date;
      transaction.description = salary.description;
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
    finance.transactions = finance.transactions.filter(
      (t) => !(t.type === 'salary' && t.date.toISOString() === salary.date.toISOString())
    );
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

// Add Scheduled Payment
exports.addScheduledPayment = async (req, res, next) => {
  try {
    const { utilityType, amount, dueDate, frequency, status } = req.body;

    if (!utilityType || !amount || !dueDate || !frequency || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const finance = await Finance.findOne();
    const scheduledPaymentEntry = {
      utilityType,
      amount: parseFloat(amount),
      dueDate,
      frequency,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (!finance) {
      const newFinance = new Finance({ scheduledPayments: [scheduledPaymentEntry] });
      await newFinance.save();
      return res.status(201).json(newFinance);
    }

    finance.scheduledPayments.push(scheduledPaymentEntry);
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    next(error);
  }
};

// Get Scheduled Payments (All or Specific)
exports.getScheduledPayments = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    if (paymentId) {
      const payment = finance.scheduledPayments.id(paymentId);
      if (!payment) return res.status(404).json({ message: 'Scheduled payment not found' });
      return res.status(200).json(payment);
    }

    res.status(200).json(finance.scheduledPayments);
  } catch (error) {
    next(error);
  }
};

// Update Scheduled Payment
exports.updateScheduledPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { utilityType, amount, dueDate, frequency, status } = req.body;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const payment = finance.scheduledPayments.id(paymentId);
    if (!payment) return res.status(404).json({ message: 'Scheduled payment not found' });

    payment.utilityType = utilityType || payment.utilityType;
    payment.amount = amount ? parseFloat(amount) : payment.amount;
    payment.dueDate = dueDate || payment.dueDate;
    payment.frequency = frequency || payment.frequency;
    payment.status = status || payment.status;
    payment.updatedAt = Date.now();

    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Delete Scheduled Payment
exports.deleteScheduledPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const payment = finance.scheduledPayments.id(paymentId);
    if (!payment) return res.status(404).json({ message: 'Scheduled payment not found' });

    finance.scheduledPayments.pull(paymentId);
    await finance.save();
    res.status(200).json(finance);
  } catch (error) {
    next(error);
  }
};

// Process Salary Data from Employee Dashboard
exports.processSalaryData = async (req, res, next) => {
  try {
    const salaryData = req.body;
    
    if (!Array.isArray(salaryData) || salaryData.length === 0) {
      return res.status(400).json({ message: 'Invalid salary data format' });
    }

    const finance = await Finance.findOne() || new Finance();
    
    // Process each salary entry
    for (const entry of salaryData) {
      const { employeeId, employeeName, department, salary, date } = entry;
      
      if (!employeeId || !salary) {
        continue; // Skip invalid entries
      }

      const salaryEntry = {
        employeeId,
        amount: parseFloat(salary),
        date: new Date(date),
        description: `Salary for ${employeeName} (${department})`
      };

      // Add to salaries array
      finance.salaries.push(salaryEntry);

      // Add to transactions
      finance.transactions.push({
        type: 'salary',
        amount: salaryEntry.amount,
        category: 'Employee Salary',
        date: salaryEntry.date,
        description: salaryEntry.description
      });
    }

    await finance.save();
    res.status(201).json({
      message: 'Salary data processed successfully',
      count: salaryData.length
    });
  } catch (error) {
    next(error);
  }
};

// Update Transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { type, amount, category, date, description } = req.body;
    
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const transaction = finance.transactions.id(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Update transaction fields
    transaction.type = type || transaction.type;
    transaction.amount = amount ? parseFloat(amount) : transaction.amount;
    transaction.category = category || transaction.category;
    transaction.date = date ? new Date(date) : transaction.date;
    transaction.description = description || transaction.description;

    // Update corresponding entry in income, expense, or salary arrays
    const oldDate = transaction.date.toISOString();
    if (transaction.type === 'income') {
      const income = finance.income.find(i => i.date.toISOString() === oldDate);
      if (income) {
        income.amount = transaction.amount;
        income.category = transaction.category;
        income.date = transaction.date;
        income.description = transaction.description;
      }
    } else if (transaction.type === 'expense') {
      const expense = finance.expenses.find(e => e.date.toISOString() === oldDate);
      if (expense) {
        expense.amount = transaction.amount;
        expense.category = transaction.category;
        expense.date = transaction.date;
        expense.description = transaction.description;
      }
    } else if (transaction.type === 'salary') {
      const salary = finance.salaries.find(s => s.date.toISOString() === oldDate);
      if (salary) {
        salary.amount = transaction.amount;
        salary.date = transaction.date;
        salary.description = transaction.description;
      }
    }

    await finance.save();
    res.status(200).json(finance.transactions);
  } catch (error) {
    next(error);
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    
    const finance = await Finance.findOne();
    if (!finance) return res.status(404).json({ message: 'No finance data found' });

    const transaction = finance.transactions.id(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Remove from transactions array
    finance.transactions.pull(transactionId);

    // Remove corresponding entry from income, expense, or salary arrays
    const transactionDate = transaction.date.toISOString();
    if (transaction.type === 'income') {
      finance.income = finance.income.filter(i => i.date.toISOString() !== transactionDate);
    } else if (transaction.type === 'expense') {
      finance.expenses = finance.expenses.filter(e => e.date.toISOString() !== transactionDate);
    } else if (transaction.type === 'salary') {
      finance.salaries = finance.salaries.filter(s => s.date.toISOString() !== transactionDate);
    }

    await finance.save();
    res.status(200).json(finance.transactions);
  } catch (error) {
    next(error);
  }
};