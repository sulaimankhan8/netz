'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';
import Plot from './Plot';

const EulerMethodSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('x + y');
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [stepH, setStepH] = useState(0.1);
  const [targetX, setTargetX] = useState(0.5);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateEuler = (fExpr, xStartVal, yStartVal, hVal, targetVal) => {
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
    log.push(`Total Iterations = ${stepsCount}`);

    let currX = xStart;
    let currY = yStart;
    const table = [];

    table.push({
      step: 0,
      x: currX,
      y: currY,
      slope: f(currX, currY),
      nextY: currY
    });

    for (let i = 0; i < stepsCount; i++) {
      const slope = f(currX, currY);
      const nextY = currY + h * slope;
      const nextX = currX + h;

      currX = nextX;
      currY = nextY;

      table.push({
        step: i + 1,
        x: currX,
        y: currY,
        slope: f(currX, currY),
        nextY
      });
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
    calculateEuler(functionInput, x0, y0, stepH, targetX);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('x + y');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.5);
    calculateEuler('x + y', 0, 1, 0.1, 0.5);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.5);
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Euler&apos;s Method ODE Solver</h1>
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
            Calculate Solution
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
          <strong>ODE Step Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg flex items-center gap-2">
          Final Approximate Solution: <InlineMath math={`y(${result.targetX.toFixed(4)}) \\approx ${result.finalY.toFixed(6)}`} />
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Euler Solution Curve Trajectory:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="euler_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot steps={stepsData} title="Euler's Method Trajectory Curve" />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Euler Step Iterations Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="euler_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Step n</th>
                <th className="border p-3"><InlineMath math="x_n" /></th>
                <th className="border p-3"><InlineMath math="y_n" /></th>
                <th className="border p-3">Slope <InlineMath math="f(x_n, y_n)" /></th>
                <th className="border p-3"><InlineMath math="y_{n+1} = y_n + h \cdot f(x_n, y_n)" /></th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row, idx) => (
                <tr key={idx} className={idx === stepsData.length - 1 ? 'bg-green-50 dark:bg-neutral-900 font-bold' : ''}>
                  <td className="border p-3 font-mono">n = {row.step}</td>
                  <td className="border p-3 font-mono">{row.x.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.y.toFixed(6)}</td>
                  <td className="border p-3 font-mono">{row.slope.toFixed(6)}</td>
                  <td className="border p-3 font-mono text-blue-600 dark:text-blue-400">
                    {idx < stepsData.length - 1 ? stepsData[idx + 1].y.toFixed(6) : row.y.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Step-by-Step Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="euler_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            {stepsData.slice(0, stepsData.length - 1).map((row, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600">
                <h3 className="text-md font-bold mb-1">Iteration Step n = {row.step}</h3>
                <BlockMath math={`x_{${row.step}} = ${row.x.toFixed(4)}, \\quad y_{${row.step}} = ${row.y.toFixed(6)}`} />
                <BlockMath math={`f(x_{${row.step}}, y_{${row.step}}) = ${row.slope.toFixed(6)}`} />
                <BlockMath math={`y_{${row.step + 1}} = y_{${row.step}} + h \\cdot f(x_{${row.step}}, y_{${row.step}})`} />
                <BlockMath math={`y_{${row.step + 1}} = ${row.y.toFixed(6)} + (${stepH}) \\times (${row.slope.toFixed(6)}) = ${stepsData[idx + 1].y.toFixed(6)}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EulerMethodSolver;
