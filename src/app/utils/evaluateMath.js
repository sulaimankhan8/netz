import { create, all } from 'mathjs';

const math = create(all, {});

/**
 * Sanitizes math expressions entered by users.
 * Replaces JS Math prefix and JS exponentiation `**` with mathjs `^`.
 */
function sanitizeMathString(expr) {
  if (!expr || typeof expr !== 'string') return '';
  return expr
    .replace(/Math\./g, '')
    .replace(/\*\*/g, '^')
    .trim();
}

/**
 * Safely evaluates a mathematical expression string for a given x value (or object of variables).
 * Accepts standard math syntax like x^3 - 4*x - 9, x**2 - 4, sin(x), e^x, etc.
 * 
 * @param {string} expr - The math expression entered by the user
 * @param {number|object} xVal - Value for x (or scope object like { x: 2, y: 3 })
 * @returns {number} Evaluated result
 */
export function evaluateMath(expr, xVal) {
  if (!expr || typeof expr !== 'string') {
    throw new Error('Invalid expression provided');
  }

  const sanitizedExpr = sanitizeMathString(expr);
  const compiled = math.compile(sanitizedExpr);
  const scope = typeof xVal === 'object' ? xVal : { x: xVal };
  const result = compiled.evaluate(scope);

  if (typeof result !== 'number' || isNaN(result)) {
    throw new Error(`Expression evaluated to invalid number (${result})`);
  }

  return result;
}

/**
 * Parses user function input and returns a JavaScript callable function `f(x)` or `f(x, y)`.
 * 
 * @param {string} expr - The input string (e.g. "x^2 - 4" or "x**2 - 4")
 * @param {Array<string>} [vars=['x']] - Array of variable names
 * @returns {(...args: number[]) => number} Function evaluating expression
 */
export function parseUserFunction(expr, vars = ['x']) {
  if (!expr || typeof expr !== 'string') {
    throw new Error('Please enter a valid mathematical function.');
  }

  const sanitized = sanitizeMathString(expr);
  const compiled = math.compile(sanitized);

  return (...args) => {
    const scope = {};
    vars.forEach((v, index) => {
      scope[v] = args[index];
    });
    const val = compiled.evaluate(scope);
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
      throw new Error(`Math domain or calculation error at x = ${args.join(', ')}`);
    }
    return val;
  };
}

export default evaluateMath;
