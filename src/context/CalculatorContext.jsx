import { createContext, useContext, useState } from 'react';

const CalculatorContext = createContext();

export function CalculatorProvider({ children }) {
  const [currentCalculator, setCurrentCalculator] = useState('cd34');
  const [calculatorData, setCalculatorData] = useState({});
  const [results, setResults] = useState(null);

  const updateData = (calculator, data) => {
    setCalculatorData(prev => ({
      ...prev,
      [calculator]: { ...prev[calculator], ...data }
    }));
  };

  const clearData = (calculator) => {
    setCalculatorData(prev => ({
      ...prev,
      [calculator]: {}
    }));
    setResults(null);
  };

  const value = {
    currentCalculator,
    setCurrentCalculator,
    calculatorData,
    updateData,
    clearData,
    results,
    setResults
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator debe usarse dentro de CalculatorProvider');
  }
  return context;
}
