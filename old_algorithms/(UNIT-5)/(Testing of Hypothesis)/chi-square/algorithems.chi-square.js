'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';

const ChiSquareSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [observedInput, setObservedInput] = useState('20, 30, 25, 25');
  const [expectedInput, setExpectedInput] = useState('25, 25, 25, 25');

  const [result, setResult] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateChiSquare = (obsStr, expStr) => {
    setError('');
    setResult(null);
    setStepsData([]);

    const O = obsStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const E = expStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (O.length !== E.length || O.length < 2) {
      setError('Please enter equal numbers of observed and expected values (at least 2).');
      return;
    }

    if (E.some(v => v <= 0)) {
      setError('Expected frequencies must be strictly positive (> 0).');
      return;
    }

    const n = O.length;
    const log = [];
    log.push(`Categories Count k = ${n}`);
    log.push(`Degrees of Freedom d.f. = k - 1 = ${n - 1}`);

    const table = [];
    let chiSquareSum = 0;

    for (let i = 0; i < n; i++) {
      const obs = O[i];
      const exp = E[i];
      const diff = obs - exp;
      const diffSq = diff * diff;
      const term = diffSq / exp;
      chiSquareSum += term;

      table.push({ index: i + 1, obs, exp, diff, diffSq, term });
    }

    const df = n - 1;

    setResult({
      n,
      df,
      chiSquareSum
    });
    setGridLog(log);
    setStepsData(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateChiSquare(observedInput, expectedInput);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setObservedInput('20, 30, 25, 25');
    setExpectedInput('25, 25, 25, 25');
    calculateChiSquare('20, 30, 25, 25', '25, 25, 25, 25');
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setObservedInput('');
    setExpectedInput('');
    setResult(null);
    setStepsData([]);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chi-Square (<InlineMath math="\\chi^2" />) Goodness of Fit Solver
        </h1>
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
            <label htmlFor="obsVals" className="block text-sm font-semibold mb-1">
              Observed Frequencies O_i (comma-separated):
            </label>
            <input
              type="text"
              id="obsVals"
              value={observedInput}
              onChange={(e) => setObservedInput(e.target.value)}
              placeholder="e.g. 20, 30, 25, 25"
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="expVals" className="block text-sm font-semibold mb-1">
              Expected Frequencies E_i (comma-separated):
            </label>
            <input
              type="text"
              id="expVals"
              value={expectedInput}
              onChange={(e) => setExpectedInput(e.target.value)}
              placeholder="e.g. 25, 25, 25, 25"
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
            Calculate Chi-Square Statistic
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
          <strong>Chi-Square Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Calculated Chi-Square Statistic: <InlineMath math={`\\chi^2 = ${result.chiSquareSum.toFixed(4)}`} /> (d.f. = {result.df})
        </div>
      )}

      {stepsData.length > 0 && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chi-Square Frequency Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="chisquare_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Category</th>
                <th className="border p-3">Observed (O)</th>
                <th className="border p-3">Expected (E)</th>
                <th className="border p-3">O - E</th>
                <th className="border p-3">(O - E)^2</th>
                <th className="border p-3">(O - E)^2 / E</th>
              </tr>
            </thead>
            <tbody>
              {stepsData.map((row) => (
                <tr key={row.index} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                  <td className="border p-3 font-mono">i = {row.index}</td>
                  <td className="border p-3 font-mono">{row.obs}</td>
                  <td className="border p-3 font-mono">{row.exp}</td>
                  <td className="border p-3 font-mono">{row.diff}</td>
                  <td className="border p-3 font-mono">{row.diffSq}</td>
                  <td className="border p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.term.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 dark:bg-neutral-700 rounded-2xl border border-gray-200 dark:border-neutral-600 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Detailed KaTeX Step-by-Step Substitution:</h2>
            <ExportToPNG
              elementId="steps"
              fileName="chisquare_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-emerald-50 dark:bg-neutral-900 rounded-xl border border-emerald-300 dark:border-emerald-700">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">Chi-Square Test Statistic</h3>
              <BlockMath math={`\\chi^2_{\\text{calc}} = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i} = ${result.chiSquareSum.toFixed(4)}`} />
              <BlockMath math={`d.f. = k - 1 = ${result.n} - 1 = ${result.df}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiSquareSolver;
