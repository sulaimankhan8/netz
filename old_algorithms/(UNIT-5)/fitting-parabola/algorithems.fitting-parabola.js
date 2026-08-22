'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import Plot from '@/app/components/UnifiedPlot';

const FittingParabolaSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [xValuesInput, setXValuesInput] = useState('-2, -1, 0, 1, 2');
  const [yValuesInput, setYValuesInput] = useState('15, 7, 3, 3, 7');

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const solve3x3 = (A, B) => {
    const M = A.map((row, i) => [...row, B[i]]);
    for (let i = 0; i < 3; i++) {
      let maxEl = Math.abs(M[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < 3; k++) {
        if (Math.abs(M[k][i]) > maxEl) {
          maxEl = Math.abs(M[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < 4; k++) {
        const tmp = M[maxRow][k];
        M[maxRow][k] = M[i][k];
        M[i][k] = tmp;
      }
      if (Math.abs(M[i][i]) < 1e-12) return null;
      for (let k = i + 1; k < 3; k++) {
        const c = -M[k][i] / M[i][i];
        for (let j = i; j < 4; j++) {
          if (i === j) M[k][j] = 0;
          else M[k][j] += c * M[i][j];
        }
      }
    }
    const x = [0, 0, 0];
    for (let i = 2; i >= 0; i--) {
      x[i] = M[i][3] / M[i][i];
      for (let k = i - 1; k >= 0; k--) {
        M[k][3] -= M[k][i] * x[i];
      }
    }
    return x;
  };

  const calculateParabolaFit = (xStr, yStr) => {
    setError('');
    setResult(null);
    setStepsData([]);

    const xArr = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const yArr = yStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (xArr.length !== yArr.length || xArr.length < 3) {
      setError('Please enter equal numbers of numeric x and y values (at least 3 points).');
      return;
    }

    const n = xArr.length;
    const log = [];
    log.push(`Sample Data Points n = ${n}`);

    let sumX = 0, sumY = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumXY = 0, sumX2Y = 0;
    const table = [];

    for (let i = 0; i < n; i++) {
      const x = xArr[i];
      const y = yArr[i];
      const x2 = x * x;
      const x3 = x2 * x;
      const x4 = x3 * x;
      const xy = x * y;
      const x2y = x2 * y;

      sumX += x;
      sumY += y;
      sumX2 += x2;
      sumX3 += x3;
      sumX4 += x4;
      sumXY += xy;
      sumX2Y += x2y;

      table.push({ index: i + 1, x, y, x2, x3, x4, xy, x2y });
    }

    const A = [
      [sumX4, sumX3, sumX2],
      [sumX3, sumX2, sumX],
      [sumX2, sumX, n]
    ];
    const B = [sumX2Y, sumXY, sumY];

    const coeffs = solve3x3(A, B);
    if (!coeffs) {
      setError('Could not fit a unique parabola for the provided data.');
      return;
    }

    const [a, b, c] = coeffs;

    setResult({
      n,
      sumX,
      sumY,
      sumX2,
      sumX3,
      sumX4,
      sumXY,
      sumX2Y,
      a,
      b,
      c
    });
    setGridLog(log);
    setStepsData(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateParabolaFit(xValuesInput, yValuesInput);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setXValuesInput('-2, -1, 0, 1, 2');
    setYValuesInput('15, 7, 3, 3, 7');
    calculateParabolaFit('-2, -1, 0, 1, 2', '15, 7, 3, 3, 7');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fitting a Parabola (Quadratic Fit)</h1>
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
              placeholder="e.g. -2, -1, 0, 1, 2"
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
              placeholder="e.g. 15, 7, 3, 3, 7"
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
            Fit Parabola y = ax^2 + bx + c
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
          <strong>Parabola Fit Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Fitted Parabola Equation: <InlineMath math={`y = ${result.a.toFixed(4)}x^2 + ${result.b.toFixed(4)}x + ${result.c.toFixed(4)}`} />
        </div>
      )}

      {stepsData.length > 0 && result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Parabola Fit Scatter Plot:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="parabola_fit_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot dataPoints={stepsData} parabolaCoeffs={{ a: result.a, b: result.b, c: result.c }} title="Quadratic Parabola Fit" />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Normal Equations Data Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="parabola_fit_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-2">#</th>
                <th className="border p-2">x</th>
                <th className="border p-2">y</th>
                <th className="border p-2">x^2</th>
                <th className="border p-2">x^3</th>
                <th className="border p-2">x^4</th>
                <th className="border p-2">x*y</th>
                <th className="border p-2">x^2*y</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.index} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-2 font-mono">{row.index}</td>
                  <td className="border p-2 font-mono">{row.x}</td>
                  <td className="border p-2 font-mono">{row.y}</td>
                  <td className="border p-2 font-mono">{row.x2}</td>
                  <td className="border p-2 font-mono">{row.x3}</td>
                  <td className="border p-2 font-mono">{row.x4}</td>
                  <td className="border p-2 font-mono">{row.xy}</td>
                  <td className="border p-2 font-mono">{row.x2y}</td>
                </tr>
              ))}
              <tr className="bg-emerald-50 dark:bg-neutral-900 font-bold">
                <td className="border p-2">Sum (\Sigma)</td>
                <td className="border p-2 font-mono">{result.sumX}</td>
                <td className="border p-2 font-mono">{result.sumY}</td>
                <td className="border p-2 font-mono">{result.sumX2}</td>
                <td className="border p-2 font-mono">{result.sumX3}</td>
                <td className="border p-2 font-mono">{result.sumX4}</td>
                <td className="border p-2 font-mono">{result.sumXY}</td>
                <td className="border p-2 font-mono">{result.sumX2Y}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX 3x3 Matrix Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="parabola_fit_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-emerald-50 dark:bg-neutral-900 rounded-xl border border-emerald-300 dark:border-emerald-700">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">3x3 System of Normal Equations</h3>
              <BlockMath math={`a \\sum x^4 + b \\sum x^3 + c \\sum x^2 = \\sum x^2 y \\implies ${result.sumX4} a + ${result.sumX3} b + ${result.sumX2} c = ${result.sumX2Y}`} />
              <BlockMath math={`a \\sum x^3 + b \\sum x^2 + c \\sum x = \\sum xy \\implies ${result.sumX3} a + ${result.sumX2} b + ${result.sumX} c = ${result.sumXY}`} />
              <BlockMath math={`a \\sum x^2 + b \\sum x + n c = \\sum y \\implies ${result.sumX2} a + ${result.sumX} b + ${result.n} c = ${result.sumY}`} />
              <BlockMath math={`a = ${result.a.toFixed(4)}, \\quad b = ${result.b.toFixed(4)}, \\quad c = ${result.c.toFixed(4)}`} />
              <BlockMath math={`y = ${result.a.toFixed(4)} x^2 + ${result.b.toFixed(4)} x + ${result.c.toFixed(4)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FittingParabolaSolver;
