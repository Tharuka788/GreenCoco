import React from 'react';

const Transactions = ({ transactions }) => {
  return (
    <div className="card transactions">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.slice(0, 5).map((trans) => (
          <li key={trans._id}>
            {trans.type} - LKR {trans.amount} - {new Date(trans.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;