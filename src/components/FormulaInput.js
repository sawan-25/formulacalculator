import React, { useEffect } from 'react';

function FormulaInput({ formula, setFormula, setVariables }) {
  const handleChange = (e) => {
    setFormula(e.target.value);
  };

  useEffect(() => {
    // List of recognized functions
    const functions = ['sin', 'cos', 'tan', 'sqrt']; // Extend this list as needed

    // Regular expression to detect tokens (variables and functions)
    const tokens = formula.match(/[a-zA-Z]+/g) || [];
    const uniqueTokens = [...new Set(tokens)];

    // Filter out function names to get variables
    const variables = uniqueTokens.filter((token) => !functions.includes(token));

    setVariables(variables); // Update state with variables excluding functions
  }, [formula, setVariables]);

  return (
    <div className="formula-input my-4">
      <input
        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        type="text"
        value={formula}
        onChange={handleChange}
        placeholder="Enter your formula, e.g., sqrt(16), sin(90)"
      />
    </div>
  );
}

export default FormulaInput;
