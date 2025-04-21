import React from 'react';

const SalaryCard = ({ salaries }) => {
  const totalSalaries = salaries.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h3>Total Salaries</h3>
      <p>LKR{totalSalaries.toFixed(2)}</p>
    </div>
  );
};

export default SalaryCard;