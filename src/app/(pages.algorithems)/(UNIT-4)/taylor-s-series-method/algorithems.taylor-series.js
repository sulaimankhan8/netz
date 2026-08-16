'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';

const TaylorSeriesSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('x + y');
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [targetX, setTargetX] = useState(0.2);

  const [result, setResult] = useState(null);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateTaylor = (fExpr, xStartVal, yStartVal, targetVal) => {
    setError('');
    const xStart = parseFloat(xStartVal);
    const yStart = parseFloat(yStartVal);
    const xTarget = parseFloat(targetVal);

    if (isNaN(xStart) || isNaN(yStart) || isNaN(xTarget)) {
      setError('Please enter valid numeric values for x0, y0, and target x.');
      return;
    }

    const h = xTarget - xStart;
    const log = [];
    log.push(`Initial Point (x0, y0) = (${xStart}, ${yStart})`);
    log.push(`Evaluation Point x = ${xTarget}, Step Size h = x - x0 = ${h.toFixed(6)}`);

    let f;
    try {
      f = parseUserFunction(fExpr, ['x', 'y']);
      f(xStart, yStart);
    } catch (err) {
      setError('Invalid function input. Please enter a valid function like x + y.');
      return;
    }

    const y1_val = f(xStart, yStart);
    const eps = 1e-4;
    const y2_val = (f(xStart + eps, yStart + eps * y1_val) - f(xStart - eps, yStart - eps * y1_val)) / (2 * eps);
    const y3_val = (f(xStart + eps, yStart + eps * y1_val) - 2 * y1_val + f(xStart - eps, yStart - eps * y1_val)) / (eps * eps);

    const t1 = yStart;
    const t2 = h * y1_val;
    const t3 = (Math.pow(h, 2) / 2) * y2_val;
    const t4 = (Math.pow(h, 3) / 6) * y3_val;

    const approxY = t1 + t2 + t3 + t4;

    setResult({
      h,
      y1_val,
      y2_val,
      y3_val,
      t1,
      t2,
      t3,
      t4,
      approxY
    });
    setGridLog(log);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTaylor(functionInput, x0, y0, targetX);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('x + y');
    setX0(0);
    setY0(1);
    setTargetX(0.2);
    calculateTaylor('x + y', 0, 1, 0.2);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setX0(0);
    setY0(1);
    setTargetX(0.2);
    setResult(null);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Taylor&apos;s Series ODE Solver</h1>
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
          <label htmlFor="function" className="block text-sm font-semibold mb-1">
            Slope Function <InlineMath math="y' = f(x, y)" />:
          </label>
          <input
            type="text"
            id="function"
            value={functionInput}
            onChange={(e) => setFunctionInput(e.target.value)}
            placeholder="e.g. x + y"
            required
            className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="x0" className="block text-sm font-semibold mb-1">Initial <InlineMath math="x_0" />:</label>
            <input
              type="number"
              id="x0"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="y0" className="block text-sm font-semibold mb-1">Initial <InlineMath math="y_0" />:</label>
            <input
              type="number"
              id="y0"
              step="any"
              value={y0}
              onChange={(e) => setY0(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="targetX" className="block text-sm font-semibold mb-1">Target Point <InlineMath math="x" />:</label>
            <input
              type="number"
              id="targetX"
              step="any"
              value={targetX}
              onChange={(e) => setTargetX(e.target.value)}
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
            Calculate Taylor Approximation
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
          <strong>Taylor Expansion Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg flex items-center gap-2">
          Final Taylor Approximation: <InlineMath math={`y(${targetX}) \\approx ${result.approxY.toFixed(6)}`} />
        </div>
      )}

      {result && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Taylor Series Terms Breakdown:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="taylor_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Order Term</th>
                <th className="border p-3">Formula</th>
                <th className="border p-3">Derivative Value</th>
                <th className="border p-3">Term Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-mono">Order 0 (y_0)</td>
                <td className="border p-3 font-mono">y_0</td>
                <td className="border p-3 font-mono">{y0}</td>
                <td className="border p-3 font-mono">{result.t1.toFixed(6)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Order 1 (y&apos;)</td>
                <td className="border p-3 font-mono">h * y&apos;(x_0)</td>
                <td className="border p-3 font-mono">{result.y1_val.toFixed(6)}</td>
                <td className="border p-3 font-mono">{result.t2.toFixed(6)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Order 2 (y&apos;&apos;)</td>
                <td className="border p-3 font-mono">(h^2 / 2!) * y&apos;&apos;(x_0)</td>
                <td className="border p-3 font-mono">{result.y2_val.toFixed(6)}</td>
                <td className="border p-3 font-mono">{result.t3.toFixed(6)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Order 3 (y&apos;&apos;&apos;)</td>
                <td className="border p-3 font-mono">(h^3 / 3!) * y&apos;&apos;&apos;(x_0)</td>
                <td className="border p-3 font-mono">{result.y3_val.toFixed(6)}</td>
                <td className="border p-3 font-mono">{result.t4.toFixed(6)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Expansion Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="taylor_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-indigo-50 dark:bg-neutral-900 rounded-xl border border-indigo-300 dark:border-indigo-700">
              <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">Taylor Series Expansion Formula</h3>
              <BlockMath math={`y(x_0 + h) = y(x_0) + h \\cdot y'(x_0) + \\frac{h^2}{2!} y''(x_0) + \\frac{h^3}{3!} y'''(x_0)`} />
              <BlockMath math={`y(${targetX}) = ${result.t1.toFixed(6)} + ${result.t2.toFixed(6)} + ${result.t3.toFixed(6)} + ${result.t4.toFixed(6)}`} />
              <BlockMath math={`y(${targetX}) \\approx ${result.approxY.toFixed(6)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaylorSeriesSolver;
