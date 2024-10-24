import React, { useEffect, useState } from 'react';
import FormulaInput from './components/FormulaInput';
import LatexDisplay from './components/LatexDisplay';
import VariableInputs from './components/VariableInputs';
import SavedFormulas from './components/SavedFormulas'; // New component
import { evaluateExpression } from './utils/expressionEvaluator';
import Header from './components/Header';

function App() {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState({});
  const [result, setResult] = useState('Enter a formula to see the result.');
  const [savedFormulas, setSavedFormulas] = useState([]);

  // Load saved formulas from localStorage on initial render
  useEffect(() => {
    const storedFormulas = JSON.parse(localStorage.getItem('savedFormulas')) || [];
    setSavedFormulas(storedFormulas);
  }, []);

  useEffect(() => {
    if (formula) {
      calculateResult();
    } else {
      setResult('Enter a formula to see the result.');
    }
  }, [values, formula]);

  const calculateResult = () => {
    const res = evaluateExpression(formula, values);
    setResult(res);
  };

  const handleSave = () => {
    if (formula.trim() !== '') {
      const newSavedFormulas = [...savedFormulas, formula];
      setSavedFormulas(newSavedFormulas);
      localStorage.setItem('savedFormulas', JSON.stringify(newSavedFormulas));
    }
  };

  const handleClear = () => {
    setFormula('');
    setVariables([]);
    setValues({});
    setResult('Enter a formula to see the result.');
  };

  const handleSelectFormula = (selectedFormula) => {
    setFormula(selectedFormula);
    setValues({});
    setVariables([]);
  };

  const handleDeleteFormula = (index) => {
    const newSavedFormulas = [...savedFormulas];
    newSavedFormulas.splice(index, 1);
    setSavedFormulas(newSavedFormulas);
    localStorage.setItem('savedFormulas', JSON.stringify(newSavedFormulas));
  };

  return (
    <div className="app">
      <Header />
      <div className="container mx-auto px-4 py-5">
        <LatexDisplay formula={formula} />
        <FormulaInput
          formula={formula}
          setFormula={setFormula}
          setVariables={setVariables}
          onSave={handleSave}
          onClear={handleClear}
        />
        <VariableInputs variables={variables} values={values} setValues={setValues} />
        <div className="result text-lg font-semibold text-green-500 mt-4">
          Result: {result}
        </div>
        <SavedFormulas savedFormulas={savedFormulas} onSelectFormula={handleSelectFormula}
        onDeleteFormula={handleDeleteFormula}/>
      </div>
    </div>
  );
}

export default App;
