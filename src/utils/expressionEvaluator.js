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

            // Handle implicit multiplication after a number
            if (i < exp.length) {
                const nextChar = exp[i];
                if (nextChar === '(' || /[a-zA-Z]/.test(nextChar)) {
                    tokens.push({ type: 'operator', value: '*' });
                }
            }
        } else if (char.match(/[a-zA-Z]/)) {
            let identifier = '';
            while (i < exp.length && exp[i].match(/[a-zA-Z]/)) {
                identifier += exp[i++];
            }

            let isFunction = functions.includes(identifier);
            // Check for exponent after variable or function name
            if (i < exp.length && exp[i] === '^') {
                i++; // Skip '^'
                let exponent = '';
                while (i < exp.length && exp[i].match(/[0-9.]/)) {
                    exponent += exp[i++];
                }
                if (isFunction) {
                    tokens.push({ type: 'function_power', name: identifier, power: parseFloat(exponent) });
                } else {
                    tokens.push({ type: 'variable_power', name: identifier, power: parseFloat(exponent) });
                }
            } else {
                if (isFunction) {
                    tokens.push({ type: 'function', name: identifier });
                } else {
                    tokens.push({ type: 'variable', value: identifier });
                }
            }

            if (i < exp.length) {
                const nextChar = exp[i];
                if (nextChar === '(') {
                    // Do not insert '*' between a function and '('
                    if (!isFunction) {
                        // Insert '*' between variable and '('
                        tokens.push({ type: 'operator', value: '*' });
                    }
                } else if (/[0-9a-zA-Z]/.test(nextChar)) {
                    // Insert '*' between variable/function and next number/variable
                    tokens.push({ type: 'operator', value: '*' });
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

        if (type === 'number' || type === 'variable' || type === 'variable_power') {
            outputQueue.push(token);
        } else if (type === 'function' || type === 'function_power') {
            operatorStack.push(token);
        } else if (value === ',') {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1].value !== '('
            ) {
                outputQueue.push(operatorStack.pop());
            }
        } else if (type === 'operator') {
            if (value === '(') {
                operatorStack.push(token);
            } else if (value === ')') {
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1].value !== '('
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop(); // Pop '('

                if (
                    operatorStack.length > 0 &&
                    (operatorStack[operatorStack.length - 1].type === 'function' ||
                        operatorStack[operatorStack.length - 1].type === 'function_power')
                ) {
                    outputQueue.push(operatorStack.pop());
                }
            } else {
                while (
                    operatorStack.length > 0 &&
                    ((operatorStack[operatorStack.length - 1].type === 'operator' &&
                        ((associativity[value] === 'left' &&
                            precedence[value] <= precedence[operatorStack[operatorStack.length - 1].value]) ||
                        (associativity[value] === 'right' &&
                            precedence[value] < precedence[operatorStack[operatorStack.length - 1].value]))) ||
                        operatorStack[operatorStack.length - 1].type === 'function' ||
                        operatorStack[operatorStack.length - 1].type === 'function_power')
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        }
    });

    while (operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1].value === '(' || operatorStack[operatorStack.length - 1].value === ')') {
            throw new Error('Mismatched parentheses');
        }
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
};


const evaluatePostfix = (postfix, vals) => {
    const stack = [];

    postfix.forEach((token) => {
        if (token.type === 'number') {
            stack.push(token.value);
        } else if (token.type === 'variable') {
            if (vals[token.value] === undefined) {
                throw new Error(`Variable '${token.value}' is not defined.`);
            }
            stack.push(parseFloat(vals[token.value]));
        } else if (token.type === 'variable_power') {
            if (vals[token.name] === undefined) {
                throw new Error(`Variable '${token.name}' is not defined.`);
            }
            const base = parseFloat(vals[token.name]);
            const result = Math.pow(base, token.power);
            stack.push(result);
        } else if (token.type === 'function' || token.type === 'function_power') {
            let args = [];
            let numArgs = 1; // Default to 1 argument
            if (token.name === 'log' || token.name === 'nthroot') {
                numArgs = 2;
            }
            for (let i = 0; i < numArgs; i++) {
                if (stack.length === 0) {
                    throw new Error(`Not enough arguments for function '${token.name}'.`);
                }
                args.unshift(stack.pop());
            }

            let result;
            if (token.type === 'function_power') {
                let funcResult;
                switch (token.name) {
                    case 'sin':
                        funcResult = Math.sin(args[0]);
                        break;
                    case 'cos':
                        funcResult = Math.cos(args[0]);
                        break;
                    case 'tan':
                        funcResult = Math.tan(args[0]);
                        break;
                    default:
                        throw new Error(`Unknown function '${token.name}'.`);
                }
                result = Math.pow(funcResult, token.power);
            } else {
                switch (token.name) {
                    case 'sin':
                        result = Math.sin(args[0]);
                        break;
                    case 'cos':
                        result = Math.cos(args[0]);
                        break;
                    case 'tan':
                        result = Math.tan(args[0]);
                        break;
                    case 'sqrt':
                        result = Math.sqrt(args[0]);
                        break;
                    case 'log':
                        result = Math.log(args[0]) / Math.log(args[1]);
                        break;
                    case 'nthroot':
                        result = Math.pow(args[0], 1 / args[1]);
                        break;
                    default:
                        throw new Error(`Unknown function '${token.name}'.`);
                }
            }
            stack.push(result);
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
        throw new Error('Invalid expression.');
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
