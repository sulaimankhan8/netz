'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';
import Plot from '@/app/components/UnifiedPlot';

const ModifiedEulerSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('x + y');
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [stepH, setStepH] = useState(0.1);
  const [targetX, setTargetX] = useState(0.3);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateModifiedEuler = (fExpr, xStartVal, yStartVal, hVal, targetVal) => {
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
    log.push(`Predictor-Corrector Total Steps = ${stepsCount}`);

    let currX = xStart;
    let currY = yStart;
    const table = [];

    for (let i = 0; i < stepsCount; i++) {
      const slope1 = f(currX, currY);
      const yPredictor = currY + h * slope1;
      const nextX = currX + h;
      const slope2 = f(nextX, yPredictor);
      const yCorrector = currY + (h / 2) * (slope1 + slope2);

      table.push({
        step: i + 1,
        x: currX,
        y: currY,
        nextX,
        slope1,
        yPredictor,
        slope2,
        yCorrector
      });

      currX = nextX;
      currY = yCorrector;
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
    calculateModifiedEuler(functionInput, x0, y0, stepH, targetX);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('x + y');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.3);
    calculateModifiedEuler('x + y', 0, 1, 0.1, 0.3);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setX0(0);
    setY0(1);
    setStepH(0.1);
    setTargetX(0.3);
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modified Euler&apos;s (Heun&apos;s) Solver</h1>
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
          <strong>Predictor-Corrector Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg flex items-center gap-2">
          Final Corrected Solution: <InlineMath math={`y(${result.targetX.toFixed(4)}) \\approx ${result.finalY.toFixed(6)}`} />
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Modified Euler Solution Curve:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="modified_euler_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot
              steps={[{ step: 0, x: parseFloat(x0), y: parseFloat(y0) }, ...stepsData.map(s => ({ step: s.step, x: s.nextX, y: s.yCorrector }))]}
              title="Modified Euler (Heun's) Trajectory Curve"
            />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Predictor-Corrector Iterations Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="modified_euler_table.png"
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
                <th className="border p-3">Predictor <InlineMath math="y_{n+1}^{(0)}" /></th>
                <th className="border p-3">Corrector <InlineMath math="y_{n+1}^{(1)}" /></th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.step} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-3 font-mono">Step {row.step}</td>
                  <td className="border p-3 font-mono">{row.x.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.y.toFixed(6)}</td>
                  <td className="border p-3 font-mono text-purple-600 dark:text-purple-400">{row.yPredictor.toFixed(6)}</td>
                  <td className="border p-3 font-mono font-bold text-green-600 dark:text-green-400">{row.yCorrector.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Predictor-Corrector Steps:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="modified_euler_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            {stepsData.map((row) => (
              <div key={row.step} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border dark:border-neutral-600 space-y-2">
                <h3 className="text-md font-bold text-indigo-700 dark:text-indigo-300">Step {row.step}: x_{row.step - 1} = {row.x.toFixed(4)} to x_{row.step} = {row.nextX.toFixed(4)}</h3>
                <div className="p-3 bg-purple-50 dark:bg-neutral-900 rounded-lg">
                  <strong>1. Predictor Step:</strong>
                  <BlockMath math={`y_{${row.step}}^{(0)} = y_{${row.step - 1}} + h \\cdot f(x_{${row.step - 1}}, y_{${row.step - 1}})`} />
                  <BlockMath math={`y_{${row.step}}^{(0)} = ${row.y.toFixed(6)} + (${stepH}) \\times (${row.slope1.toFixed(6)}) = ${row.yPredictor.toFixed(6)}`} />
                </div>
                <div className="p-3 bg-green-50 dark:bg-neutral-900 rounded-lg">
                  <strong>2. Corrector Step:</strong>
                  <BlockMath math={`y_{${row.step}}^{(1)} = y_{${row.step - 1}} + \\frac{h}{2} \\left[ f(x_{${row.step - 1}}, y_{${row.step - 1}}) + f(x_{${row.step}}, y_{${row.step}}^{(0)}) \\right]`} />
                  <BlockMath math={`y_{${row.step}}^{(1)} = ${row.y.toFixed(6)} + \\frac{${stepH}}{2} \\left[ ${row.slope1.toFixed(6)} + ${row.slope2.toFixed(6)} \\right] = ${row.yCorrector.toFixed(6)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifiedEulerSolver;
