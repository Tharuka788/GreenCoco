import React from 'react';

const PaymentsCard = ({ upcomingIncome = [], upcomingExpenses = [] }) => {
  const totalUpcomingIncome = upcomingIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalUpcomingExpenses = upcomingExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h3>Upcoming Payments</h3>
      <p>
        Total Upcoming Income: <strong>LKR {totalUpcomingIncome.toFixed(2)}</strong>
      </p>
      <p>
        Total Upcoming Expenses: <strong>LKR {totalUpcomingExpenses.toFixed(2)}</strong>
      </p>

      <h4>Upcoming Income</h4>
      {upcomingIncome.length > 0 ? (
        <ul>
          {upcomingIncome.map((income) => (
            <li key={income._id}>
              {income.source} - LKR {income.amount.toFixed(2)} on {new Date(income.date).toLocaleDateString()} ({income.category})
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming income entries.</p>
      )}

      <h4>Upcoming Expenses</h4>
      {upcomingExpenses.length > 0 ? (
        <ul>
          {upcomingExpenses.map((expense) => (
            <li key={expense._id}>
              {expense.category} - LKR {expense.amount.toFixed(2)} on {new Date(expense.date).toLocaleDateString()} ({expense.expenseCategory})
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming expense entries.</p>
      )}
    </div>
  );
};

export default PaymentsCard;