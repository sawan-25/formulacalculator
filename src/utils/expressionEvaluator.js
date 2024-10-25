// Helper function to tokenize the input expression
const functions = ['sin', 'cos', 'tan', 'sqrt', 'nthroot', 'log'];
const operators = "+-*/^(),";
const precedence = {
    '^': 4,
    '*': 3,
    '/': 3,
    '+': 2,
    '-': 2,
    '(': 1,
    ')': 1,
    ',': 1  // Comma for function arguments
};
const associativity = {
    '^': 'right',
    '*': 'left',
    '/': 'left',
    '+': 'left',
    '-': 'left'
};

const tokenize = (exp) => {
    const tokens = [];
    let i = 0;
    while (i < exp.length) {
        const char = exp[i];

        if (/\s/.test(char)) {
            i++;
        } else if (char.match(/[0-9.]/)) {
            let num = '';
            while (i < exp.length && exp[i].match(/[0-9.]/)) {
                num += exp[i++];
            }
            tokens.push({ type: 'number', value: parseFloat(num) });

            if (i < exp.length && (exp[i] === '(' || /[a-zA-Z]/.test(exp[i]))) {
                tokens.push({ type: 'operator', value: '*' });
            }
        } else if (char.match(/[a-zA-Z]/)) {
            let identifier = '';
            while (i < exp.length && exp[i].match(/[a-zA-Z]/)) {
                identifier += exp[i++];
            }
            if (functions.includes(identifier)) {
                tokens.push({ type: 'function', name: identifier });
            } else {
                tokens.push({ type: 'variable', value: identifier });
            }
        } else if (operators.includes(char)) {
            tokens.push({ type: 'operator', value: char });
            i++;
        } else {
            throw new Error(`Invalid character '${char}' in expression.`);
        }
    }
    return tokens;
};

// Helper function to convert infix tokens to postfix using Shunting Yard Algorithm
const infixToPostfix = (tokens) => {
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach((token) => {
        const type = token.type;
        const value = token.value;

        if (type === 'number' || type === 'variable') {
            outputQueue.push(token);
        } else if (type === 'function') {
            operatorStack.push(token);
        } else if (value === ',') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
                outputQueue.push(operatorStack.pop());
            }
        } else if (type === 'operator') {
            if (value === '(') {
                operatorStack.push(token);
            } else if (value === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();  // Pop '('
                if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'function') {
                    outputQueue.push(operatorStack.pop());
                }
            } else {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'function' &&
                    operatorStack[operatorStack.length - 1].value !== '(' &&
                    ((associativity[value] === 'left' && precedence[value] <= precedence[operatorStack[operatorStack.length - 1].value]) ||
                        (associativity[value] === 'right' && precedence[value] < precedence[operatorStack[operatorStack.length - 1].value]))) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
};

// Helper function to evaluate the postfix expression
const evaluatePostfix = (postfix, vals) => {
    const stack = [];

    postfix.forEach(token => {
        if (token.type === 'number') {
            stack.push(token.value);
        } else if (token.type === 'variable') {
            if (vals[token.value] === undefined) {
                throw new Error(`Variable '${token.value}' is not defined.`);
            }
            stack.push(parseFloat(vals[token.value]));
        } else if (token.type === 'function') {
            if (['sin', 'cos', 'tan', 'sqrt'].includes(token.name) && stack.length >= 1) {
                const arg = stack.pop();
                switch (token.name) {
                    case 'sin':
                        stack.push(Math.sin(arg));
                        break;
                    case 'cos':
                        stack.push(Math.cos(arg));
                        break;
                    case 'tan':
                        stack.push(Math.tan(arg));
                        break;
                    case 'sqrt':
                        stack.push(Math.sqrt(arg));
                        break;
                }
            } else if (['nthroot', 'log'].includes(token.name) && stack.length >= 2) {
                const arg2 = stack.pop();
                const arg1 = stack.pop();
                switch (token.name) {
                    case 'nthroot':
                        stack.push(Math.pow(arg1, 1 / arg2));  // Note: arg1 is the value, arg2 is the degree
                        break;
                    case 'log':
                        stack.push(Math.log(arg1) / Math.log(arg2));  // Change of base formula
                        break;
                }
            } else {
                throw new Error(`Not enough arguments for function '${token.name}' or function is unknown.`);
            }
        } else if (token.type === 'operator') {
            const b = stack.pop();
            const a = stack.pop();
            switch (token.value) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
                default:
                    throw new Error(`Unknown operator '${token.value}'.`);
            }
        }
    });

    if (stack.length !== 1) {
        throw new Error("Invalid expression.");
    }

    return stack.pop();
};

// Main function to evaluate expressions
export const evaluateExpression = (exp, vals) => {
    if (!exp.trim()) return 'Enter a formula to see the result.';
  
    try {
      const tokens = tokenize(exp);
      const postfix = infixToPostfix(tokens);
      const result = evaluatePostfix(postfix, vals);
  
      return result.toString();
    } catch (error) {
      return "Invalid formula";
    }
};
