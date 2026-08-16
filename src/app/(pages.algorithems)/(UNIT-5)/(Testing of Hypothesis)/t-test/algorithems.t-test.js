'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';

const TTestSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [sampleDataInput, setSampleDataInput] = useState('12, 15, 14, 11, 13, 16, 15, 14');
  const [hypothesizedMean, setHypothesizedMean] = useState(13);

  const [result, setResult] = useState(null);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateTTest = (sampleStr, muVal) => {
    setError('');
    setResult(null);

    const data = sampleStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const mu = parseFloat(muVal);

    if (data.length < 2 || isNaN(mu)) {
      setError('Please enter at least 2 sample values and a valid hypothesized mean (\\mu).');
      return;
    }

    const n = data.length;
    const log = [];
    log.push(`Sample Size n = ${n}, Hypothesized Mean \\mu_0 = ${mu}`);
    log.push(`Degrees of Freedom d.f. = n - 1 = ${n - 1}`);

    const mean = data.reduce((sum, v) => sum + v, 0) / n;
    const varSum = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);
    const s2 = varSum / (n - 1);
    const s = Math.sqrt(s2);
    const df = n - 1;

    const tCalc = (mean - mu) / (s / Math.sqrt(n));

    setResult({
      n,
      mean,
      s,
      s2,
      df,
      mu,
      tCalc
    });
    setGridLog(log);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTTest(sampleDataInput, hypothesizedMean);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setSampleDataInput('12, 15, 14, 11, 13, 16, 15, 14');
    setHypothesizedMean(13);
    calculateTTest('12, 15, 14, 11, 13, 16, 15, 14', 13);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setSampleDataInput('');
    setHypothesizedMean(13);
    setResult(null);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">One-Sample Student&apos;s t-Test Solver</h1>
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
            <label htmlFor="sampleData" className="block text-sm font-semibold mb-1">
              Sample Data Values (comma-separated):
            </label>
            <input
              type="text"
              id="sampleData"
              value={sampleDataInput}
              onChange={(e) => setSampleDataInput(e.target.value)}
              placeholder="e.g. 12, 15, 14, 11, 13, 16, 15, 14"
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="hypoMean" className="block text-sm font-semibold mb-1">
              Hypothesized Population Mean <InlineMath math="\\mu_0" />:
            </label>
            <input
              type="number"
              id="hypoMean"
              step="any"
              value={hypothesizedMean}
              onChange={(e) => setHypothesizedMean(e.target.value)}
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
            Calculate t-Statistic
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
          <strong>t-Test Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Calculated t-Statistic: <InlineMath math={`t = ${result.tCalc.toFixed(4)}`} /> (d.f. = {result.df})
        </div>
      )}

      {result && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sample Statistics Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="ttest_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Statistic</th>
                <th className="border p-3">Symbol</th>
                <th className="border p-3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-mono">Sample Size</td>
                <td className="border p-3 font-mono">n</td>
                <td className="border p-3 font-mono">{result.n}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Sample Mean</td>
                <td className="border p-3 font-mono">\bar&#123;x&#125;</td>
                <td className="border p-3 font-mono">{result.mean.toFixed(4)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Sample Variance</td>
                <td className="border p-3 font-mono">s^2</td>
                <td className="border p-3 font-mono">{result.s2.toFixed(4)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Sample Std Deviation</td>
                <td className="border p-3 font-mono">s</td>
                <td className="border p-3 font-mono">{result.s.toFixed(4)}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Degrees of Freedom</td>
                <td className="border p-3 font-mono">d.f.</td>
                <td className="border p-3 font-mono">{result.df}</td>
              </tr>
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
              fileName="ttest_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-blue-50 dark:bg-neutral-900 rounded-xl border border-blue-300 dark:border-blue-700">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">t-Statistic Formula & Evaluation</h3>
              <BlockMath math={`t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}`} />
              <BlockMath math={`t = \\frac{${result.mean.toFixed(4)} - ${result.mu}}{${result.s.toFixed(4)} / \\sqrt{${result.n}}} = \\frac{${(result.mean - result.mu).toFixed(4)}}{${(result.s / Math.sqrt(result.n)).toFixed(4)}} = ${result.tCalc.toFixed(4)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TTestSolver;
