'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';
import Plot from './Plot';

const RungeKuttaSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('x + y');
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [stepH, setStepH] = useState(0.1);
  const [targetX, setTargetX] = useState(0.2);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateRK4 = (fExpr, xStartVal, yStartVal, hVal, targetVal) => {
    setError('');
    const xStart = parseFloat(xStartVal);
    const yStart = parseFloat(yStartVal);
    const h = parseFloat(hVal);
    const xTarget = parseFloat(targetVal);

    if (isNaN(xStart) || isNaN(yStart) || isNaN(h) || isNaN(xTarget) || h <= 0) {
      setError('Please enter valid numerical inputs and a positive step size (h > 0).');
      return;
    }
    if (xTarget <= xStart) {
      setError('Target evaluation point (x) must be strictly greater than initial x0.');
      return;
    }

    let f;
    try {
      f = parseUserFunction(fExpr, ['x', 'y']);
      f(xStart, yStart);
    } catch (err) {
      setError('Invalid function input. Please enter a valid function of x and y, like x + y.');
      return;
    }

    const stepsCount = Math.round((xTarget - xStart) / h);
    const log = [];
    log.push(`Initial Point (x0, y0) = (${xStart}, ${yStart})`);
    log.push(`Step Size h = ${h}, Target x = ${xTarget}`);
    log.push(`RK4 Order 4 Total Steps = ${stepsCount}`);

    let currX = xStart;
    let currY = yStart;
    const table = [];

    for (let i = 0; i < stepsCount; i++) {
      const k1 = h * f(currX, currY);
      const k2 = h * f(currX + h / 2, currY + k1 / 2);
      const k3 = h * f(currX + h / 2, currY + k2 / 2);
      const k4 = h * f(currX + h, currY + k3);

      const nextY = currY + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      const nextX = currX + h;

      table.push({
        step: i + 1,
        x: currX,
        y: currY,
        nextX,
        k1,
        k2,
        k3,
        k4,
        nextY
      });

      currX = nextX;
      currY = nextY;
    }

    setResult({
      targetX: currX,
      finalY: currY,
      stepsCount
    });
    setGridLog(log);
    setStepsData(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRK4(functionInput, x0, y0, stepH, targetX);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('x + y');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.2);
    calculateRK4('x + y', 0, 1, 0.1, 0.2);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.2);
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Runge-Kutta 4th Order (RK4) Solver</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label htmlFor="targetX" className="block text-sm font-semibold mb-1">Target <InlineMath math="x" />:</label>
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
            Calculate RK4 Solution
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
          <strong>RK4 Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg flex items-center gap-2">
          Final RK4 Solution: <InlineMath math={`y(${result.targetX.toFixed(4)}) \\approx ${result.finalY.toFixed(6)}`} />
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">RK4 Solution Curve:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="rk4_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot
              steps={[{ step: 0, x: parseFloat(x0), y: parseFloat(y0) }, ...stepsData.map(s => ({ step: s.step, x: s.nextX, y: s.nextY }))]}
              title="Runge-Kutta 4th Order Trajectory Curve"
            />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">RK4 Iterations Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="rk4_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-2">Step n</th>
                <th className="border p-2"><InlineMath math="x_n" /></th>
                <th className="border p-2"><InlineMath math="y_n" /></th>
                <th className="border p-2"><InlineMath math="k_1" /></th>
                <th className="border p-2"><InlineMath math="k_2" /></th>
                <th className="border p-2"><InlineMath math="k_3" /></th>
                <th className="border p-2"><InlineMath math="k_4" /></th>
                <th className="border p-2"><InlineMath math="y_{n+1}" /></th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.step} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-2 font-mono">Step {row.step}</td>
                  <td className="border p-2 font-mono">{row.x.toFixed(4)}</td>
                  <td className="border p-2 font-mono">{row.y.toFixed(6)}</td>
                  <td className="border p-2 font-mono text-blue-600">{row.k1.toFixed(6)}</td>
                  <td className="border p-2 font-mono text-purple-600">{row.k2.toFixed(6)}</td>
                  <td className="border p-2 font-mono text-indigo-600">{row.k3.toFixed(6)}</td>
                  <td className="border p-2 font-mono text-pink-600">{row.k4.toFixed(6)}</td>
                  <td className="border p-2 font-mono font-bold text-green-600 dark:text-green-400">{row.nextY.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Intermediate Slopes Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="rk4_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            {stepsData.map((row) => (
              <div key={row.step} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 space-y-2">
                <h3 className="text-md font-bold text-indigo-700 dark:text-indigo-300">Step {row.step}: x_{row.step - 1} = {row.x.toFixed(4)} to x_{row.step} = {row.nextX.toFixed(4)}</h3>
                <BlockMath math={`k_1 = h \\cdot f(x_n, y_n) = ${row.k1.toFixed(6)}`} />
                <BlockMath math={`k_2 = h \\cdot f\\left(x_n + \\frac{h}{2}, y_n + \\frac{k_1}{2}\\right) = ${row.k2.toFixed(6)}`} />
                <BlockMath math={`k_3 = h \\cdot f\\left(x_n + \\frac{h}{2}, y_n + \\frac{k_2}{2}\\right) = ${row.k3.toFixed(6)}`} />
                <BlockMath math={`k_4 = h \\cdot f\\left(x_n + h, y_n + k_3\\right) = ${row.k4.toFixed(6)}`} />
                <div className="p-3 bg-green-50 dark:bg-neutral-900 rounded-lg">
                  <BlockMath math={`y_{${row.step}} = y_{${row.step - 1}} + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)`} />
                  <BlockMath math={`y_{${row.step}} = ${row.y.toFixed(6)} + \\frac{1}{6}(${row.k1.toFixed(6)} + 2(${row.k2.toFixed(6)}) + 2(${row.k3.toFixed(6)}) + ${row.k4.toFixed(6)}) = ${row.nextY.toFixed(6)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RungeKuttaSolver;
