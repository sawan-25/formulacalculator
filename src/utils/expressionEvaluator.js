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
            // Check for exponent after function name
            if (i < exp.length && exp[i] === '^') {
                i++; // Skip '^'
                let exponent = '';
                while (i < exp.length && exp[i].match(/[0-9.]/)) {
                    exponent += exp[i++];
                }
                tokens.push({ type: 'function_power', name: identifier, power: parseFloat(exponent) });
            } else {
                if (functions.includes(identifier)) {
                    tokens.push({ type: 'function', name: identifier });
                } else {
                    tokens.push({ type: 'variable', value: identifier });
                }
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

const infixToPostfix = (tokens) => {
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach((token) => {
        const type = token.type;
        const value = token.value;

        if (type === 'number' || type === 'variable') {
            outputQueue.push(token);
        } else if (type === 'function' || type === 'function_power') {
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
                if (operatorStack.length > 0 && (operatorStack[operatorStack.length - 1].type === 'function' || operatorStack[operatorStack.length - 1].type === 'function_power')) {
                    outputQueue.push(operatorStack.pop());
                }
            } else {
                while (operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1].type !== 'function' &&
                    operatorStack[operatorStack.length - 1].type !== 'function_power' &&
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
            if (stack.length >= 1) {
                const arg = stack.pop();
                let result;
                switch (token.name) {
                    case 'sin':
                        result = Math.sin(arg);
                        break;
                    case 'cos':
                        result = Math.cos(arg);
                        break;
                    case 'tan':
                        result = Math.tan(arg);
                        break;
                    case 'sqrt':
                        result = Math.sqrt(arg);
                        break;
                    default:
                        throw new Error(`Unknown function '${token.name}'.`);
                }
                stack.push(result);
            } else {
                throw new Error(`Not enough arguments for function '${token.name}'.`);
            }
        } else if (token.type === 'function_power') {
            if (stack.length >= 1) {
                const arg = stack.pop();
                let funcResult;
                switch (token.name) {
                    case 'sin':
                        funcResult = Math.sin(arg);
                        break;
                    case 'cos':
                        funcResult = Math.cos(arg);
                        break;
                    case 'tan':
                        funcResult = Math.tan(arg);
                        break;
                    default:
                        throw new Error(`Unknown function '${token.name}'.`);
                }
                const result = Math.pow(funcResult, token.power);
                stack.push(result);
            } else {
                throw new Error(`Not enough arguments for function '${token.name}' with power.`);
            }
        } else if (token.type === 'operator') {
            if (stack.length < 2) {
                throw new Error(`Not enough operands for operator '${token.value}'.`);
            }
            const b = stack.pop();
            const a = stack.pop();
            let result;
            switch (token.value) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    result = a / b;
                    break;
                case '^':
                    result = Math.pow(a, b);
                    break;
                default:
                    throw new Error(`Unknown operator '${token.value}'.`);
            }
            stack.push(result);
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
