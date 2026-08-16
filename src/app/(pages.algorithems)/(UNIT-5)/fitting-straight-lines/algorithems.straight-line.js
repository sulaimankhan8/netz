'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import Plot from './Plot';

const StraightLineSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [xValuesInput, setXValuesInput] = useState('0, 1, 2, 3, 4');
  const [yValuesInput, setYValuesInput] = useState('1, 1.8, 3.3, 4.5, 6.3');

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateLinearFit = (xStr, yStr) => {
    setError('');
    setResult(null);
    setStepsData([]);

    const xArr = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const yArr = yStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (xArr.length !== yArr.length || xArr.length < 2) {
      setError('Please enter equal numbers of numeric x and y values (at least 2 points).');
      return;
    }

    const n = xArr.length;
    const log = [];
    log.push(`Sample Data Count n = ${n}`);

    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
    const table = [];

    for (let i = 0; i < n; i++) {
      const x = xArr[i];
      const y = yArr[i];
      const x2 = x * x;
      const xy = x * y;

      sumX += x;
      sumY += y;
      sumX2 += x2;
      sumXY += xy;

      table.push({ index: i + 1, x, y, x2, xy });
    }

    const denom = n * sumX2 - sumX * sumX;
    if (Math.abs(denom) < 1e-12) {
      setError('Cannot fit a straight line: vertical line or colinear x values.');
      return;
    }

    const a = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY * sumX2 - sumX * sumXY) / denom;

    setResult({
      n,
      sumX,
      sumY,
      sumX2,
      sumXY,
      denom,
      a,
      b
    });
    setGridLog(log);
    setStepsData(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateLinearFit(xValuesInput, yValuesInput);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setXValuesInput('0, 1, 2, 3, 4');
    setYValuesInput('1, 1.8, 3.3, 4.5, 6.3');
    calculateLinearFit('0, 1, 2, 3, 4', '1, 1.8, 3.3, 4.5, 6.3');
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setXValuesInput('');
    setYValuesInput('');
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fitting a Straight Line (Linear Regression)</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="xVals" className="block text-sm font-semibold mb-1">
              x Values (comma-separated):
            </label>
            <input
              type="text"
              id="xVals"
              value={xValuesInput}
              onChange={(e) => setXValuesInput(e.target.value)}
              placeholder="e.g. 0, 1, 2, 3, 4"
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="yVals" className="block text-sm font-semibold mb-1">
              y Values (comma-separated):
            </label>
            <input
              type="text"
              id="yVals"
              value={yValuesInput}
              onChange={(e) => setYValuesInput(e.target.value)}
              placeholder="e.g. 1, 1.8, 3.3, 4.5, 6.3"
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
            Fit Line y = ax + b
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
          <strong>Linear Regression Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Fitted Line Equation: <InlineMath math={`y = ${result.a.toFixed(4)}x + ${result.b.toFixed(4)}`} />
        </div>
      )}

      {stepsData.length > 0 && result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Linear Regression Fit Scatter Plot:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="linear_fit_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot dataPoints={stepsData} lineEquation={{ a: result.a, b: result.b }} title="Linear Regression Curve Fit" />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Normal Equations Data Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="linear_fit_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">#</th>
                <th className="border p-3">x</th>
                <th className="border p-3">y</th>
                <th className="border p-3">x^2</th>
                <th className="border p-3">x * y</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.index} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-3 font-mono">{row.index}</td>
                  <td className="border p-3 font-mono">{row.x.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.y.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.x2.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.xy.toFixed(4)}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 dark:bg-neutral-900 font-bold">
                <td className="border p-3">Sum (\Sigma)</td>
                <td className="border p-3 font-mono">{result.sumX.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.sumY.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.sumX2.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.sumXY.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Normal Equations Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="linear_fit_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-blue-50 dark:bg-neutral-900 rounded-xl border border-blue-300 dark:border-blue-700">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Normal Equations System</h3>
              <BlockMath math={`\\sum y = a \\sum x + n b \\implies ${result.sumY.toFixed(4)} = ${result.sumX.toFixed(4)} a + ${result.n} b`} />
              <BlockMath math={`\\sum xy = a \\sum x^2 + b \\sum x \\implies ${result.sumXY.toFixed(4)} = ${result.sumX2.toFixed(4)} a + ${result.sumX.toFixed(4)} b`} />
              <BlockMath math={`a = \\frac{n \\sum xy - \\sum x \\sum y}{n \\sum x^2 - (\\sum x)^2} = \\frac{${result.n}(${result.sumXY.toFixed(4)}) - (${result.sumX.toFixed(4)})(${result.sumY.toFixed(4)})}{${result.denom.toFixed(4)}} = ${result.a.toFixed(4)}`} />
              <BlockMath math={`b = \\frac{\\sum y \\sum x^2 - \\sum x \\sum xy}{\\Delta} = \\frac{(${result.sumY.toFixed(4)})(${result.sumX2.toFixed(4)}) - (${result.sumX.toFixed(4)})(${result.sumXY.toFixed(4)})}{${result.denom.toFixed(4)}} = ${result.b.toFixed(4)}`} />
              <BlockMath math={`y = ${result.a.toFixed(4)} x + ${result.b.toFixed(4)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StraightLineSolver;
