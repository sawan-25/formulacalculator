import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

function LatexDisplay({ formula }) {
  const [error, setError] = React.useState(null);

  // Conversion logic
  const convertToLatex = (input) => {
    input = input.replace(
      /(\w+)\^(\([^)]+\)|\w+)/g,
      (match, base, exponent) => `${base}^{${exponent}}`
    );

    input = input
      .replace(/\*/g, " \\times ")
      .replace(/\//g, " \\div ")
      .replace(/\-(\d+)/g, "- $1") // Ensuring spacing around unary minus for clarity
      .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}");

    return input;
  };

  const latexFormula = convertToLatex(formula);

  return (
    <div className="latex-display bg-gray-100 p-4 rounded-lg shadow my-4">
      {error ? (
        <div className="error-message text-red-500">{error}</div>
      ) : (
        <BlockMath math={latexFormula} className="text-lg text-blue-500" />
      )}
    </div>
  );
}

export default LatexDisplay;
