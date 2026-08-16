'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';

const NumericalDifferentiationSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('x^3 - 2*x + 5');
  const [evalX, setEvalX] = useState(2);
  const [stepH, setStepH] = useState(0.01);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateDifferentiation = (fExpr, xVal, hVal) => {
    setError('');
    const x0 = parseFloat(xVal);
    const h = parseFloat(hVal);

    if (isNaN(x0) || isNaN(h) || h <= 0) {
      setError('Please enter valid numeric values for x and a positive step size (h > 0).');
      return;
    }

    let f;
    try {
      f = parseUserFunction(fExpr);
      f(x0);
    } catch (err) {
      setError('Invalid function input. Please enter a valid mathematical expression like x^3 - 2*x + 5.');
      return;
    }

    const log = [];
    log.push(`Evaluation Point x = ${x0}, Step Size h = ${h}`);

    const fx0 = f(x0);
    const fx_plus_h = f(x0 + h);
    const fx_minus_h = f(x0 - h);
    const fx_plus_2h = f(x0 + 2 * h);
    const fx_minus_2h = f(x0 - 2 * h);

    // First derivative central difference: (f(x+h) - f(x-h)) / (2h)
    const firstDerivCentral = (fx_plus_h - fx_minus_h) / (2 * h);

    // Second derivative central difference: (f(x+h) - 2f(x) + f(x-h)) / (h^2)
    const secondDerivCentral = (fx_plus_h - 2 * fx0 + fx_minus_h) / (h * h);

    const pointsTable = [
      { label: 'f(x - 2h)', xVal: x0 - 2 * h, fVal: fx_minus_2h },
      { label: 'f(x - h)', xVal: x0 - h, fVal: fx_minus_h },
      { label: 'f(x)', xVal: x0, fVal: fx0 },
      { label: 'f(x + h)', xVal: x0 + h, fVal: fx_plus_h },
      { label: 'f(x + 2h)', xVal: x0 + 2 * h, fVal: fx_plus_2h },
    ];

    setResult({
      x0,
      h,
      fx0,
      fx_plus_h,
      fx_minus_h,
      firstDerivCentral,
      secondDerivCentral
    });
    setGridLog(log);
    setStepsData(pointsTable);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDifferentiation(functionInput, evalX, stepH);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('x^3 - 2*x + 5');
    setEvalX(2);
    setStepH(0.01);
    calculateDifferentiation('x^3 - 2*x + 5', 2, 0.01);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setEvalX(0);
    setStepH(0.01);
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Numerical Differentiation Solver</h1>
        <TButton
          tooltipText="Demo"
          onClick={handleDemo}
          className={`bg-purple-700 ${demoInProgress ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-purple-600`}
          color="violet"
          altText="Demo"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="function" className="block text-sm font-semibold mb-1">Enter Function <InlineMath math="f(x)" />:</label>
          <input
            type="text"
            id="function"
            value={functionInput}
            onChange={(e) => setFunctionInput(e.target.value)}
            placeholder="e.g. x^3 - 2*x + 5"
            required
            className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="evalX" className="block text-sm font-semibold mb-1">Evaluation Point <InlineMath math="x" />:</label>
            <input
              type="number"
              id="evalX"
              step="any"
              value={evalX}
              onChange={(e) => setEvalX(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="stepH" className="block text-sm font-semibold mb-1">Step Size <InlineMath math="h" />:</label>
            <input
              type="number"
              id="stepH"
              step="any"
              value={stepH}
              onChange={(e) => setStepH(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            id="Calculate"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Calculate
          </button>

          <TButton
            tooltipText="Reset"
            onClick={handleReset}
            imgSrc="/reset.svg"
            altText="Reset"
            color="red"
            float="float-right"
          />
        </div>
      </form>

      {gridLog.length > 0 && (
        <div className="my-6 p-4 bg-yellow-100 text-yellow-800 dark:bg-neutral-700 dark:text-yellow-200 rounded-xl space-y-1">
          <strong>Grid Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-neutral-900 rounded-xl border border-blue-200 dark:border-neutral-700 text-center">
            <span className="text-xs uppercase font-bold text-gray-500">First Derivative f&apos;(x)</span>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{result.firstDerivCentral.toFixed(6)}</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-neutral-900 rounded-xl border border-purple-200 dark:border-neutral-700 text-center">
            <span className="text-xs uppercase font-bold text-gray-500">Second Derivative f&apos;&apos;(x)</span>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{result.secondDerivCentral.toFixed(6)}</p>
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Grid Function Values:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="differentiation_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Symbol</th>
                <th className="border p-3">Grid Point x</th>
                <th className="border p-3">f(x) Value</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row, idx) => (
                <tr key={idx} className={row.label === 'f(x)' ? 'bg-blue-50 dark:bg-neutral-900 font-bold' : ''}>
                  <td className="border p-3 font-mono">{row.label}</td>
                  <td className="border p-3 font-mono">{row.xVal.toFixed(6)}</td>
                  <td className="border p-3 font-mono">{row.fVal.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Central Difference Formulas:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="differentiation_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-blue-50 dark:bg-neutral-800 rounded-xl border border-blue-300 dark:border-blue-700">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">First Derivative Central Difference</h3>
              <BlockMath math={`f'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}`} />
              <BlockMath math={`f'(${result.x0}) \\approx \\frac{${result.fx_plus_h.toFixed(6)} - ${result.fx_minus_h.toFixed(6)}}{2 \\times ${result.h}} = ${result.firstDerivCentral.toFixed(6)}`} />
            </div>

            <div className="p-4 bg-purple-50 dark:bg-neutral-800 rounded-xl border border-purple-300 dark:border-purple-700">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">Second Derivative Central Difference</h3>
              <BlockMath math={`f''(x) \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}`} />
              <BlockMath math={`f''(${result.x0}) \\approx \\frac{${result.fx_plus_h.toFixed(6)} - 2(${result.fx0.toFixed(6)}) + ${result.fx_minus_h.toFixed(6)}}{${result.h}^2} = ${result.secondDerivCentral.toFixed(6)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumericalDifferentiationSolver;
