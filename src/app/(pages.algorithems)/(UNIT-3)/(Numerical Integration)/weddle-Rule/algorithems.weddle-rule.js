'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';
import Plot from '../simpson-1-3-Rule/Plot';

const WeddleRuleSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('1 / (1 + x^2)');
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(6);
  const [subintervals, setSubintervals] = useState(6);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [plotPoints, setPlotPoints] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateWeddle = (fExpr, aVal, bVal, nVal) => {
    setError('');
    const a = parseFloat(aVal);
    const b = parseFloat(bVal);
    const n = parseInt(nVal, 10);

    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
      setError('Please enter valid numeric limits and a positive integer for subintervals (n).');
      return;
    }
    if (n % 6 !== 0) {
      setError('Weddle\'s Rule requires subintervals (n) to be a multiple of 6.');
      return;
    }
    if (a >= b) {
      setError('Lower limit (a) must be strictly less than upper limit (b).');
      return;
    }

    let f;
    try {
      f = parseUserFunction(fExpr);
      f(a);
      f(b);
    } catch (err) {
      setError('Invalid function input. Please enter a valid mathematical expression like 1 / (1 + x^2).');
      return;
    }

    const h = (b - a) / n;
    const log = [];
    log.push(`Interval [a, b] = [${a}, ${b}], n = ${n} (Multiple of 6)`);
    log.push(`Grid Step Size h = (${b} - ${a}) / ${n} = ${h.toFixed(6)}`);

    const points = [];
    const weddlePattern = [1, 5, 1, 6, 1, 5, 1]; // for a single block of 6

    let totalWeightedSum = 0;

    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      let weight = 1;
      if (i === 0 || i === n) {
        weight = 1;
      } else {
        const mod = i % 6;
        weight = weddlePattern[mod];
        if (mod === 0) weight = 2; // boundary between blocks of 6
      }

      const contribution = weight * y;
      totalWeightedSum += contribution;

      points.push({
        index: i,
        x,
        y,
        weight,
        contribution
      });
    }

    const integralValue = ((3 * h) / 10) * totalWeightedSum;

    setResult({
      h,
      totalWeightedSum,
      integralValue
    });
    setGridLog(log);
    setStepsData(points);
    setPlotPoints(points);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateWeddle(functionInput, lowerLimit, upperLimit, subintervals);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setFunctionInput('1 / (1 + x^2)');
    setLowerLimit(0);
    setUpperLimit(6);
    setSubintervals(6);
    calculateWeddle('1 / (1 + x^2)', 0, 6, 6);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setLowerLimit(0);
    setUpperLimit(6);
    setSubintervals(6);
    setResult(null);
    setStepsData([]);
    setPlotPoints([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weddle&apos;s Rule Solver</h1>
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
            placeholder="e.g. 1 / (1 + x^2)"
            required
            className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="lowerLimit" className="block text-sm font-semibold mb-1">Lower Limit <InlineMath math="a" />:</label>
            <input
              type="number"
              id="lowerLimit"
              step="any"
              value={lowerLimit}
              onChange={(e) => setLowerLimit(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="upperLimit" className="block text-sm font-semibold mb-1">Upper Limit <InlineMath math="b" />:</label>
            <input
              type="number"
              id="upperLimit"
              step="any"
              value={upperLimit}
              onChange={(e) => setUpperLimit(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="subintervals" className="block text-sm font-semibold mb-1">Subintervals <InlineMath math="n" /> (Multiple of 6):</label>
            <input
              type="number"
              id="subintervals"
              min="6"
              step="6"
              value={subintervals}
              onChange={(e) => setSubintervals(e.target.value)}
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
          <strong>Grid Step Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg flex items-center gap-2">
          Result: Integral <InlineMath math={`I \\approx ${result.integralValue.toFixed(8)}`} />
        </div>
      )}

      {plotPoints.length > 0 && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weddle&apos;s Rule Curve Plot:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="weddle_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot points={plotPoints} title={`Weddle's Rule Fit (n = ${subintervals})`} />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weddle&apos;s Table of Grid Values:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="weddle_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">i</th>
                <th className="border p-3">x_i</th>
                <th className="border p-3">y_i = f(x_i)</th>
                <th className="border p-3">Weddle Weight</th>
                <th className="border p-3">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.index} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-3 font-mono">i = {row.index}</td>
                  <td className="border p-3 font-mono">{row.x.toFixed(6)}</td>
                  <td className="border p-3 font-mono">{row.y.toFixed(6)}</td>
                  <td className="border p-3 font-bold text-teal-600 dark:text-teal-400">{row.weight}</td>
                  <td className="border p-3 font-mono">{row.contribution.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stepsData.length > 0 && result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Step-by-Step Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="weddle_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            {stepsData.map((row) => (
              <div key={row.index} className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border dark:border-neutral-600">
                <h3 className="text-md font-bold mb-1">Subinterval Grid Point i = {row.index}</h3>
                <BlockMath math={`x_{${row.index}} = a + ${row.index} \\cdot h = ${row.x.toFixed(6)}`} />
                <BlockMath math={`y_{${row.index}} = f(x_{${row.index}}) = ${row.y.toFixed(6)}`} />
                <BlockMath math={`\\text{Weight} = ${row.weight} \\implies \\text{Term} = ${row.weight} \\times ${row.y.toFixed(6)} = ${row.contribution.toFixed(6)}`} />
              </div>
            ))}
            <div className="p-4 bg-teal-50 dark:bg-neutral-900 rounded-xl border border-teal-300 dark:border-teal-700">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-2">Final Integration Formula Substitution</h3>
              <BlockMath math={`I = \\frac{3h}{10} \\sum_{i=0}^{n} w_i \\cdot y_i`} />
              <BlockMath math={`I = \\frac{3(${result.h.toFixed(6)})}{10} \\left[ ${result.totalWeightedSum.toFixed(6)} \\right]`} />
              <BlockMath math={`I \\approx ${result.integralValue.toFixed(8)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddleRuleSolver;
