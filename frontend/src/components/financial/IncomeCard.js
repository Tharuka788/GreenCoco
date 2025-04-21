import React from 'react';

const IncomeCard = ({ income }) => {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h3>Total Income</h3>
      <p>LKR{totalIncome.toFixed(2)}</p>
    </div>
  );
};

export default IncomeCard;