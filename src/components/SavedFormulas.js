import React from 'react';


function SavedFormulas({ savedFormulas , onSelectFormula , onDeleteFormula}) {
  if (savedFormulas.length === 0) return null;

  return (
    <div className="saved-formulas mt-8">
      <h2 className="text-2xl font-semibold mb-4">Saved Formulas</h2>
      <div className="space-y-2">
        {savedFormulas.map((formula, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 rounded-md shadow-sm flex items-center justify-between"
            onClick={() => onSelectFormula(formula)}
          >
            <span className="text-lg font-medium">{formula}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onDeleteFormula(index);
              }}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <span className="h-6 w-6">X</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedFormulas;
