import React from 'react';

function VariableInputs({ variables, values, setValues }) {
  const handleValueChange = (varName) => (e) => {
    setValues({ ...values, [varName]: e.target.value });
  };

  return (
    <div className="variable-inputs space-y-2 my-4">
      {variables.map((variable) => (
        <div key={variable} className="flex items-center space-x-2">
          <label className="block text-sm font-medium text-gray-700">{variable}: </label>
          <input
            type="text"
            value={values[variable] || ''}
            onChange={handleValueChange(variable)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      ))}
    </div>
  );
}

export default VariableInputs;
