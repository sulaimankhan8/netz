'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';

const ZTestSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [sampleMean, setSampleMean] = useState(105);
  const [popMean, setPopMean] = useState(100);
  const [stdDev, setStdDev] = useState(15);
  const [sampleSize, setSampleSize] = useState(50);

  const [result, setResult] = useState(null);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateZTest = (xBarVal, muVal, sigmaVal, nVal) => {
    setError('');
    setResult(null);

    const xBar = parseFloat(xBarVal);
    const mu = parseFloat(muVal);
    const sigma = parseFloat(sigmaVal);
    const n = parseInt(nVal, 10);

    if (isNaN(xBar) || isNaN(mu) || isNaN(sigma) || isNaN(n) || sigma <= 0 || n <= 0) {
      setError('Please enter valid numeric sample inputs (sigma > 0 and n > 0).');
      return;
    }

    const log = [];
    log.push(`Sample Mean \\bar{x} = ${xBar}, Population Mean \\mu_0 = ${mu}`);
    log.push(`Standard Deviation \\sigma = ${sigma}, Sample Size n = ${n} (Large Sample n >= 30)`);

    const se = sigma / Math.sqrt(n);
    const zCalc = (xBar - mu) / se;

    setResult({
      xBar,
      mu,
      sigma,
      n,
      se,
      zCalc
    });
    setGridLog(log);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateZTest(sampleMean, popMean, stdDev, sampleSize);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setSampleMean(105);
    setPopMean(100);
    setStdDev(15);
    setSampleSize(50);
    calculateZTest(105, 100, 15, 50);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setSampleMean(105);
    setPopMean(100);
    setStdDev(15);
    setSampleSize(50);
    setResult(null);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Z-Test (Large Sample Significance Test)</h1>
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
            <label htmlFor="sMean" className="block text-sm font-semibold mb-1">
              Sample Mean <InlineMath math="\\bar{x}" />:
            </label>
            <input
              type="number"
              id="sMean"
              step="any"
              value={sampleMean}
              onChange={(e) => setSampleMean(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="pMean" className="block text-sm font-semibold mb-1">
              Population Mean <InlineMath math="\\mu_0" />:
            </label>
            <input
              type="number"
              id="pMean"
              step="any"
              value={popMean}
              onChange={(e) => setPopMean(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="sd" className="block text-sm font-semibold mb-1">
              Standard Deviation <InlineMath math="\\sigma" />:
            </label>
            <input
              type="number"
              id="sd"
              step="any"
              value={stdDev}
              onChange={(e) => setStdDev(e.target.value)}
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="sSize" className="block text-sm font-semibold mb-1">
              Sample Size <InlineMath math="n \\ge 30" />:
            </label>
            <input
              type="number"
              id="sSize"
              min="1"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
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
            Calculate Z-Statistic
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
          <strong>Z-Test Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Calculated Z-Statistic: <InlineMath math={`Z = ${result.zCalc.toFixed(4)}`} />
        </div>
      )}

      {result && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Z-Test Parameters Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="ztest_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Parameter</th>
                <th className="border p-3">Symbol</th>
                <th className="border p-3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-mono">Sample Mean</td>
                <td className="border p-3 font-mono">\bar&#123;x&#125;</td>
                <td className="border p-3 font-mono">{result.xBar}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Population Mean</td>
                <td className="border p-3 font-mono">\mu_0</td>
                <td className="border p-3 font-mono">{result.mu}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Standard Deviation</td>
                <td className="border p-3 font-mono">\sigma</td>
                <td className="border p-3 font-mono">{result.sigma}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Sample Size</td>
                <td className="border p-3 font-mono">n</td>
                <td className="border p-3 font-mono">{result.n}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Standard Error</td>
                <td className="border p-3 font-mono">SE = \sigma / \sqrt&#123;n&#125;</td>
                <td className="border p-3 font-mono">{result.se.toFixed(6)}</td>
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
              fileName="ztest_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-blue-50 dark:bg-neutral-900 rounded-xl border border-blue-300 dark:border-blue-700 space-y-2">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Z-Statistic Formula & Evaluation</h3>
              <BlockMath math={`SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${result.sigma}}{\\sqrt{${result.n}}} = ${result.se.toFixed(6)}`} />
              <BlockMath math={`Z_{\\text{calc}} = \\frac{\\bar{x} - \\mu_0}{SE} = \\frac{${result.xBar} - ${result.mu}}{${result.se.toFixed(6)}} = ${result.zCalc.toFixed(4)}`} />
              <p className="text-sm font-sans font-bold text-indigo-700 dark:text-indigo-300 pt-2">
                {Math.abs(result.zCalc) > 1.96 ? 'Decision: |Z| > 1.96. Reject H0 at 5% significance level.' : 'Decision: |Z| <= 1.96. Accept H0 at 5% significance level.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZTestSolver;
