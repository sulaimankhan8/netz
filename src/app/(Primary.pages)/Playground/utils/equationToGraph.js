/**
 * Equation-to-Graph Generator & Multi-Curve Dataset Appender
 * Evaluates LaTeX math equations to continuous high-resolution (x, y) plot datasets.
 * Uses mathjs compiler for robust support of polynomials, trig, log, exp, & rational functions.
 */

import { create, all } from 'mathjs';
import { scopeManager } from './scopeManager';

const math = create(all);

export const CURVE_COLORS = [
  '#3B82F6', // Electric Blue
  '#10B981', // Emerald
  '#8B5CF6', // Vivid Purple
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

/**
 * Normalizes LaTeX equation string into standard mathjs expression string.
 */
export function extractExpressionFromLatex(latexStr) {
  if (!latexStr || typeof latexStr !== 'string') return '';

  let str = latexStr.trim();

  // Strip leading variable assignment: "y =", "f(x) =", "g(x) =", "z ="
  if (str.includes('=')) {
    const parts = str.split('=');
    const left = parts[0].trim();
    if (/^(y|f\(x\)|g\(x\)|z)$/i.test(left)) {
      str = parts.slice(1).join('=').trim();
    } else {
      str = parts[0].trim();
    }
  }

  // Convert LaTeX fractions \frac{a}{b} -> ((a)/(b))
  while (/\\frac\{([^{}]+)\}\{([^{}]+)\}/.test(str)) {
    str = str.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  }

  // Convert LaTeX square roots \sqrt{x} -> sqrt(x)
  str = str.replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)');
  str = str.replace(/\\sqrt/g, 'sqrt');

  // Convert LaTeX trig & function symbols
  str = str.replace(/\\sin/g, 'sin');
  str = str.replace(/\\cos/g, 'cos');
  str = str.replace(/\\tan/g, 'tan');
  str = str.replace(/\\log/g, 'log10');
  str = str.replace(/\\ln/g, 'log');
  str = str.replace(/\\abs\{([^{}]+)\}/g, 'abs($1)');
  str = str.replace(/\\cdot/g, '*');
  str = str.replace(/\\times/g, '*');
  str = str.replace(/\\pi/gi, 'pi');

  // Convert exponent notation x^{2} -> x^(2)
  str = str.replace(/\^\{([^}]+)\}/g, '^($1)');

  // Fix implicit multiplication: 2x -> 2*x, 3.5x -> 3.5*x, 4(x) -> 4*(x), x(x) -> x*(x)
  str = str.replace(/(\d+)([a-zA-Z])/g, '$1*$2');
  str = str.replace(/(\d+)\(/g, '$1*(');
  str = str.replace(/([a-zA-Z0-9])(sin|cos|tan|log|ln|sqrt|abs)\b/g, '$1*$2');
  str = str.replace(/\)([\(a-zA-Z0-9])/g, ')*$1');

  return str;
}

/**
 * Generates continuous high-resolution (x, y) plot dataset using mathjs.
 */
export function generateGraphDatasetFromLatex(latexStr, label = '', domain = [-10, 10], colorIndex = 0) {
  const expr = extractExpressionFromLatex(latexStr);
  if (!expr) return null;

  const points = [];
  const labels = [];
  const numSteps = 400; // High resolution sampling for smooth curves
  const minX = domain[0];
  const maxX = domain[1];
  const step = (maxX - minX) / numSteps;

  let compiled = null;
  try {
    compiled = math.compile(expr);
  } catch (err) {
    console.warn('[equationToGraph] Failed to compile math expression:', expr, err);
    return null;
  }

  const currentScope = scopeManager.getScopeObject();
  let prevY = null;

  for (let i = 0; i <= numSteps; i++) {
    const x = Number((minX + i * step).toFixed(3));
    labels.push(x);

    try {
      let yVal = compiled.evaluate({ ...currentScope, x, e: Math.E, pi: Math.PI });

      // Handle Complex numbers or object outputs from mathjs
      if (yVal && typeof yVal === 'object' && 're' in yVal) {
        yVal = Math.abs(yVal.im) < 1e-9 ? yVal.re : NaN;
      }

      if (typeof yVal === 'number' && !isNaN(yVal) && isFinite(yVal) && Math.abs(yVal) <= 1000) {
        // Asymptote / Singularity Detection (e.g. tan(x) or 1/x jumping from +1000 to -1000)
        if (prevY !== null && Math.abs(yVal - prevY) > 80) {
          points.push({ x, y: null });
        } else {
          points.push({ x, y: Number(yVal.toFixed(4)) });
        }
        prevY = yVal;
      } else {
        points.push({ x, y: null });
        prevY = null;
      }
    } catch (e) {
      points.push({ x, y: null });
      prevY = null;
    }
  }

  const strokeColor = CURVE_COLORS[colorIndex % CURVE_COLORS.length];
  const displayLabel = label || latexStr || expr;

  return {
    label: displayLabel,
    rawExpr: expr,
    latex: latexStr,
    data: points,
    borderColor: strokeColor,
    backgroundColor: strokeColor + '15',
    borderWidth: 3,
    tension: 0.2,
    pointRadius: 0,
    pointHoverRadius: 6,
  };
}

/**
 * Appends a new curve dataset to an existing GraphBlock content payload.
 */
export function appendCurveToGraphBlock(existingGraphData, newLatexStr, label) {
  const currentDatasets = existingGraphData?.datasets || [];
  const colorIndex = currentDatasets.length;
  const newDataset = generateGraphDatasetFromLatex(newLatexStr, label, [-10, 10], colorIndex);

  if (!newDataset) return existingGraphData;

  return {
    ...existingGraphData,
    datasets: [...currentDatasets, newDataset],
  };
}
