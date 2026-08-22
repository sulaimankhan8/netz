/**
 * Browser-Native Computer Algebra System (CAS) Engine
 * Leverages Math.js & Nerdamer for zero-API-cost symbolic math operations:
 * Differentiation, Integration, Simplification, and Root Finding.
 */

import { getSymbolicDerivative, sanitizeMathString } from '../../../utils/evaluateMath';
import nerdamer from 'nerdamer';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

/**
 * Computes symbolic derivative d/dx of a LaTeX string.
 */
export function differentiateExpression(latexStr, variable = 'x') {
  if (!latexStr) return '';
  try {
    const cleanExpr = sanitizeMathString(latexStr.replace(/^[yf]\(x\)\s*=\s*/i, ''));
    const derivative = getSymbolicDerivative(cleanExpr, variable);
    return `f'(${variable}) = ${derivative}`;
  } catch (err) {
    return `f'(${variable}) = \\frac{d}{d${variable}}(${latexStr})`;
  }
}

/**
 * Computes symbolic indefinite integral \int f(x) dx of a LaTeX string using Nerdamer.
 */
export function integrateExpression(latexStr, variable = 'x') {
  if (!latexStr) return '';
  try {
    const cleanExpr = sanitizeMathString(latexStr.replace(/^[yf]\(x\)\s*=\s*/i, ''));
    const integral = nerdamer(`integrate(${cleanExpr}, ${variable})`).text('latex');
    return `\\int f(${variable}) d${variable} = ${integral} + C`;
  } catch (err) {
    return `\\int (${latexStr}) d${variable} + C`;
  }
}

/**
 * Simplifies a mathematical expression string using Nerdamer / MathJS.
 */
export function simplifyExpression(latexStr) {
  if (!latexStr) return '';
  try {
    const cleanExpr = sanitizeMathString(latexStr.replace(/^[yf]\(x\)\s*=\s*/i, ''));
    const simplified = nerdamer(`simplify(${cleanExpr})`).text('latex');
    return simplified;
  } catch (err) {
    return latexStr;
  }
}

/**
 * Solves f(x) = 0 for roots using Nerdamer solver.
 */
export function solveRootsExpression(latexStr, variable = 'x') {
  if (!latexStr) return [];
  try {
    const cleanExpr = sanitizeMathString(latexStr.replace(/^[yf]\(x\)\s*=\s*/i, ''));
    const solutions = nerdamer.solve(cleanExpr, variable);
    const textSolutions = solutions.text();
    // Parse array string e.g. "[2, -2]"
    return textSolutions.replace(/^\[|\]$/g, '').split(',').map((s) => s.trim());
  } catch (err) {
    return [];
  }
}
