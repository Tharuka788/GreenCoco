import React from 'react';

const ProfitCard = ({ profitLoss }) => {
  return (
    <div className="card">
      <h3>Monthly Profits</h3>
      <p>Profit/Loss: LKR{profitLoss.profitLoss?.toFixed(2) || '0.00'}</p>
    </div>
  );
};

export default ProfitCard;