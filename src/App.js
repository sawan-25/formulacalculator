import React, { useEffect, useState } from 'react';
import FormulaInput from './components/FormulaInput';
import LatexDisplay from './components/LatexDisplay';
import VariableInputs from './components/VariableInputs';
import { evaluateExpression } from './utils/expressionEvaluator';
import Header from './components/Header';

function App() {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState({});
  const [result, setResult] = useState('Enter a formula to see the result.');


  useEffect(() => {
    if (formula) {  // Only calculate if there's a formula
      calculateResult();
    }
  }, [values, formula]);  // Add formula as a dependency to recalculate when it changes



  const calculateResult = () => {
    const res = evaluateExpression(formula, values);
    setResult(res);
  };

  return (
    <div className="app container mx-auto px-4 py-5">
      <Header/>
      <LatexDisplay formula={formula} />
      <FormulaInput formula={formula} setFormula={setFormula} setVariables={setVariables} />
      <VariableInputs variables={variables} values={values} setValues={setValues} />
      <div className="result text-lg font-semibold text-green-500 mt-4">
        Result: {result}
      </div>
    </div>
  );
}

export default App;
