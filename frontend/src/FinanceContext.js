import React, { createContext, useState, useContext } from 'react';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <FinanceContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);