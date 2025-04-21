import React from 'react';

const ExpenseCard = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h3>Total Expenses</h3>
      <p>LKR{totalExpenses.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseCard;