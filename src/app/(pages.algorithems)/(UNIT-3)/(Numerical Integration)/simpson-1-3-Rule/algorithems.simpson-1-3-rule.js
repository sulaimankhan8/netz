'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';
import { parseUserFunction } from '@/app/utils/evaluateMath';
import Plot from './Plot';

const Simpson13RuleSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState('sin(x)');
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(Math.PI);
  const [subintervals, setSubintervals] = useState(6);

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [plotPoints, setPlotPoints] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateSimpson13 = (fExpr, aVal, bVal, nVal) => {
    setError('');
    const a = parseFloat(aVal);
    const b = parseFloat(bVal);
    const n = parseInt(nVal, 10);

    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
      setError('Please enter valid numeric limits and a positive integer for subintervals (n).');
      return;
    }
    if (n % 2 !== 0) {
      setError('Simpson\'s 1/3 Rule requires an EVEN number of subintervals (n must be divisible by 2).');
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
      setError('Invalid function input. Please enter a valid mathematical expression like sin(x).');
      return;
    }

    const h = (b - a) / n;
    const log = [];
    log.push(`Interval [a, b] = [${a}, ${b}], n = ${n} (Even)`);
    log.push(`Grid Step Size h = (${b} - ${a}) / ${n} = ${h.toFixed(6)}`);

    const points = [];
    let sumOdd = 0;
    let sumEven = 0;

    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      let weight = 1;
      if (i > 0 && i < n) {
        weight = i % 2 !== 0 ? 4 : 2;
      }
      const contribution = weight * y;

      points.push({
        index: i,
        x,
        y,
        weight,
        contribution
      });

      if (i > 0 && i < n) {
        if (i % 2 !== 0) sumOdd += y;
        else sumEven += y;
      }
    }

    const y0 = points[0].y;
    const yn = points[n].y;
    const integralValue = (h / 3) * (y0 + yn + 4 * sumOdd + 2 * sumEven);

    setResult({
      h,
      y0,
      yn,
      sumOdd,
      sumEven,
      integralValue
    });
    setGridLog(log);
    setStepsData(points);
    setPlotPoints(points);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateSimpson13(functionInput, lowerLimit, upperLimit, subintervals);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    const demoA = 0;
    const demoB = Math.PI;
    const demoN = 6;
    setFunctionInput('sin(x)');
    setLowerLimit(demoA);
    setUpperLimit(demoB);
    setSubintervals(demoN);
    calculateSimpson13('sin(x)', demoA, demoB, demoN);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput('');
    setLowerLimit(0);
    setUpperLimit(1);
    setSubintervals(6);
    setResult(null);
    setStepsData([]);
    setPlotPoints([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Simpson&apos;s 1/3 Rule Solver</h1>
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
            placeholder="e.g. sin(x)"
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
            <label htmlFor="subintervals" className="block text-sm font-semibold mb-1">Subintervals <InlineMath math="n" /> (Must be Even):</label>
            <input
              type="number"
              id="subintervals"
              min="2"
              step="2"
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
            <h2 className="text-xl font-semibold">Simpson&apos;s 1/3 Curve Plot:</h2>
            <ExportToPNG
              elementId="graphCanvas"
              fileName="simpson_1_3_plot.png"
              tooltipText="Export Plot to PNG"
              color="blue"
            />
          </div>
          <div id="graphCanvas">
            <Plot points={plotPoints} title={`Simpson's 1/3 Parabolic Fit (n = ${subintervals})`} />
          </div>
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Simpson&apos;s 1/3 Table of Grid Values:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="simpson_1_3_table.png"
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
                <th className="border p-3">Weight</th>
                <th className="border p-3">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr
                  key={row.index}
                  className={row.weight === 4 ? 'bg-purple-50 dark:bg-neutral-900/60 font-semibold' : row.weight === 2 ? 'bg-blue-50 dark:bg-neutral-900/40 font-semibold' : ''}
                >
                  <td className="border p-3 font-mono">i = {row.index}</td>
                  <td className="border p-3 font-mono">{row.x.toFixed(6)}</td>
                  <td className="border p-3 font-mono">{row.y.toFixed(6)}</td>
                  <td className="border p-3 font-bold text-purple-600 dark:text-purple-400">{row.weight}</td>
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
              fileName="simpson_1_3_steps.png"
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
            <div className="p-4 bg-purple-50 dark:bg-neutral-900 rounded-xl border border-purple-300 dark:border-purple-700">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">Final Integration Formula Substitution</h3>
              <BlockMath math={`I = \\frac{h}{3} \\left[ (y_0 + y_n) + 4 \\sum_{\\text{odd}} y_i + 2 \\sum_{\\text{even}} y_i \\right]`} />
              <BlockMath math={`I = \\frac{${result.h.toFixed(6)}}{3} \\left[ (${result.y0.toFixed(6)} + ${result.yn.toFixed(6)}) + 4(${result.sumOdd.toFixed(6)}) + 2(${result.sumEven.toFixed(6)}) \\right]`} />
              <BlockMath math={`I \\approx ${result.integralValue.toFixed(8)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simpson13RuleSolver;
