import React, { useEffect } from 'react';

function FormulaInput({ formula, setFormula, setVariables, onSave, onClear }) {
  const handleChange = (e) => {
    setFormula(e.target.value);
  };

  useEffect(() => {
    // List of recognized functions
    const functions = ['sin', 'cos', 'tan', 'sqrt', 'nthroot', 'log'];

    // Regular expression to detect tokens (variables and functions)
    const tokens = formula.match(/[a-zA-Z]+/g) || [];
    const uniqueTokens = [...new Set(tokens)];

    // Filter out function names to get variables
    const variables = uniqueTokens.filter((token) => !functions.includes(token));

    setVariables(variables); // Update state with variables excluding functions
  }, [formula, setVariables]);

  return (
    <div className="formula-input my-4">
      <div className="flex items-center space-x-2">
        <input
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
          value={formula}
          onChange={handleChange}
          placeholder="Enter your formula, e.g., sqrt(16), sin(90)"
        />
        <button
          onClick={onSave}
          className="mt-1 px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          Save
        </button>
        <button
          onClick={onClear}
          className="mt-1 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default FormulaInput;
