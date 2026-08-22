/**
 * Equation-to-Graph Generator & Multi-Curve Dataset Appender
 * Evaluates LaTeX math equations to continuous (x, y) plot datasets.
 * Supports multi-curve drag-and-drop linking onto existing GraphBlocks.
 */

import { evaluateMath } from '../../../utils/evaluateMath';
import { scopeManager } from './scopeManager';

const CURVE_COLORS = [
  '#3B82F6', // Electric Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

/**
 * Normalizes LaTeX equation string into standard math expression (e.g., "y = x^2 - 4" -> "x^2 - 4").
 */
export function extractExpressionFromLatex(latexStr) {
  if (!latexStr || typeof latexStr !== 'string') return '';

  let clean = latexStr.replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)');
  clean = clean.replace(/\\cdot/g, '*');
  clean = clean.replace(/\\times/g, '*');

  // Strip "y =" or "f(x) =" prefix
  if (clean.includes('=')) {
    const parts = clean.split('=');
    // If left side is y or f(x), take right side
    if (parts[0].trim().match(/^(y|f\(x\)|g\(x\)|z)$/i)) {
      clean = parts[1].trim();
    } else {
      clean = parts[0].trim();
    }
  }

  return clean;
}

/**
 * Generates continuous (x, y) dataset for a LaTeX equation.
 */
export function generateGraphDatasetFromLatex(latexStr, label = 'f(x)', domain = [-10, 10], colorIndex = 0) {
  const expr = extractExpressionFromLatex(latexStr);
  if (!expr) return null;

  const points = [];
  const labels = [];
  const step = (domain[1] - domain[0]) / 200;
  const currentScope = scopeManager.getScopeObject();

  for (let x = domain[0]; x <= domain[1]; x += step) {
    labels.push(Number(x.toFixed(2)));

    try {
      // Evaluate expression with current x and global CAS scope
      const evalScope = { ...currentScope, x };
      const yVal = evaluateMath(expr, evalScope);

      if (typeof yVal === 'number' && !isNaN(yVal) && isFinite(yVal)) {
        points.push({ x: Number(x.toFixed(2)), y: Number(yVal.toFixed(3)) });
      } else {
        points.push({ x: Number(x.toFixed(2)), y: null });
      }
    } catch (e) {
      points.push({ x: Number(x.toFixed(2)), y: null });
    }
  }

  const strokeColor = CURVE_COLORS[colorIndex % CURVE_COLORS.length];

  return {
    label: label || expr,
    data: points,
    borderColor: strokeColor,
    backgroundColor: strokeColor + '20',
    borderWidth: 2.5,
    tension: 0.3,
    pointRadius: 0,
    pointHoverRadius: 5,
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
