'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';

const LeastSquaresSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [fitType, setFitType] = useState('exponential');
  const [xValuesInput, setXValuesInput] = useState('1, 2, 3, 4, 5');
  const [yValuesInput, setYValuesInput] = useState('2.5, 4.2, 7.5, 12.8, 22.1');

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateLeastSquares = (type, xStr, yStr) => {
    setError('');
    setResult(null);
    setStepsData([]);

    const xArr = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const yArr = yStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (xArr.length !== yArr.length || xArr.length < 2) {
      setError('Please enter equal numbers of numeric x and y values (at least 2 points).');
      return;
    }

    if (yArr.some(v => v <= 0) || (type === 'power' && xArr.some(v => v <= 0))) {
      setError('Logarithmic transformations require strictly positive values (x > 0 and y > 0).');
      return;
    }

    const n = xArr.length;
    const log = [];
    log.push(`Fitting Mode: ${type === 'exponential' ? 'Exponential y = a * e^(b*x)' : 'Power y = a * x^b'}`);
    log.push(`Sample Count n = ${n}`);

    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;
    const table = [];

    for (let i = 0; i < n; i++) {
      const origX = xArr[i];
      const origY = yArr[i];
      const X = type === 'power' ? Math.log(origX) : origX;
      const Y = Math.log(origY);
      const X2 = X * X;
      const XY = X * Y;

      sumX += X;
      sumY += Y;
      sumX2 += X2;
      sumXY += XY;

      table.push({ index: i + 1, origX, origY, X, Y, X2, XY });
    }

    const denom = n * sumX2 - sumX * sumX;
    if (Math.abs(denom) < 1e-12) {
      setError('Cannot fit curve for the given data points.');
      return;
    }

    const B = (n * sumXY - sumX * sumY) / denom;
    const A_cap = (sumY * sumX2 - sumX * sumXY) / denom;
    const A = Math.exp(A_cap);

    setResult({
      n,
      fitType: type,
      A,
      B,
      A_cap,
      sumX,
      sumY,
      sumX2,
      sumXY,
      eqnString: type === 'exponential' ? `y = ${A.toFixed(4)} e^{${B.toFixed(4)} x}` : `y = ${A.toFixed(4)} x^{${B.toFixed(4)}}`
    });
    setGridLog(log);
    setStepsData(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateLeastSquares(fitType, xValuesInput, yValuesInput);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFitType('exponential');
    setXValuesInput('1, 2, 3, 4, 5');
    setYValuesInput('2.5, 4.2, 7.5, 12.8, 22.1');
    calculateLeastSquares('exponential', '1, 2, 3, 4, 5', '2.5, 4.2, 7.5, 12.8, 22.1');
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFitType('exponential');
    setXValuesInput('');
    setYValuesInput('');
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Least Squares Non-Linear Curve Fitting</h1>
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
          <label htmlFor="modelType" className="block text-sm font-semibold mb-1">
            Curve Model Type:
          </label>
          <select
            id="modelType"
            value={fitType}
            onChange={(e) => setFitType(e.target.value)}
            className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
          >
            <option value="exponential">Exponential Curve: y = a * e^(b*x)</option>
            <option value="power">Power Curve: y = a * x^b</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="xVals" className="block text-sm font-semibold mb-1">x Values:</label>
            <input
              type="text"
              id="xVals"
              value={xValuesInput}
              onChange={(e) => setXValuesInput(e.target.value)}
              placeholder="e.g. 1, 2, 3, 4, 5"
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="yVals" className="block text-sm font-semibold mb-1">y Values:</label>
            <input
              type="text"
              id="yVals"
              value={yValuesInput}
              onChange={(e) => setYValuesInput(e.target.value)}
              placeholder="e.g. 2.5, 4.2, 7.5, 12.8, 22.1"
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
            Fit Non-Linear Curve
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
          <strong>Least Squares Log Transformation:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Fitted Equation: <InlineMath math={result.eqnString} />
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transformed Log Data Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="least_squares_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">#</th>
                <th className="border p-3">orig x</th>
                <th className="border p-3">orig y</th>
                <th className="border p-3">X = {fitType === 'power' ? 'ln(x)' : 'x'}</th>
                <th className="border p-3">Y = ln(y)</th>
                <th className="border p-3">X^2</th>
                <th className="border p-3">X * Y</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.index} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-3 font-mono">{row.index}</td>
                  <td className="border p-3 font-mono">{row.origX}</td>
                  <td className="border p-3 font-mono">{row.origY}</td>
                  <td className="border p-3 font-mono">{row.X.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.Y.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.X2.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{row.XY.toFixed(4)}</td>
                </tr>
              ))}
              {result && (
                <tr className="bg-indigo-50 dark:bg-neutral-900 font-bold">
                  <td className="border p-3">Sum (\Sigma)</td>
                  <td className="border p-3">-</td>
                  <td className="border p-3">-</td>
                  <td className="border p-3 font-mono">{result.sumX.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{result.sumY.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{result.sumX2.toFixed(4)}</td>
                  <td className="border p-3 font-mono">{result.sumXY.toFixed(4)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Log Linear Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="least_squares_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-indigo-50 dark:bg-neutral-900 rounded-xl border border-indigo-300 dark:border-indigo-700">
              <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">Log Linear Parameter Solving</h3>
              <BlockMath math={`Y = \\ln a + b X \\implies Y = A' + b X`} />
              <BlockMath math={`b = \\frac{n \\sum XY - \\sum X \\sum Y}{n \\sum X^2 - (\\sum X)^2} = ${result.B.toFixed(4)}`} />
              <BlockMath math={`A' = \\ln a = ${result.A_cap.toFixed(4)} \\implies a = e^{A'} = ${result.A.toFixed(4)}`} />
              <BlockMath math={`\\text{Final Equation: } ${result.eqnString}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeastSquaresSolver;
