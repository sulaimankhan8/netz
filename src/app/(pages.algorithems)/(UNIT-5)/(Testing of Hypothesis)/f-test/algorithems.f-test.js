'use client';

import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import TButton from '@/app/components/TButton';
import ExportToPNG from '@/app/utils/ExportToPNG';

const FTestSolver = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [sample1Input, setSample1Input] = useState('20, 22, 19, 23, 21, 24');
  const [sample2Input, setSample2Input] = useState('18, 17, 21, 19, 16');

  const [result, setResult] = useState(null);
  const [gridLog, setGridLog] = useState([]);
  const [error, setError] = useState('');

  const calculateFTest = (s1Str, s2Str) => {
    setError('');
    setResult(null);

    const s1Data = s1Str.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    const s2Data = s2Str.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

    if (s1Data.length < 2 || s2Data.length < 2) {
      setError('Please enter at least 2 sample values for both Sample 1 and Sample 2.');
      return;
    }

    const n1 = s1Data.length;
    const n2 = s2Data.length;

    const log = [];
    log.push(`Sample 1 Size n1 = ${n1}, Sample 2 Size n2 = ${n2}`);

    const m1 = s1Data.reduce((a, b) => a + b, 0) / n1;
    const m2 = s2Data.reduce((a, b) => a + b, 0) / n2;

    const var1 = s1Data.reduce((sum, v) => sum + Math.pow(v - m1, 2), 0) / (n1 - 1);
    const var2 = s2Data.reduce((sum, v) => sum + Math.pow(v - m2, 2), 0) / (n2 - 1);

    if (var1 === 0 || var2 === 0) {
      setError('Sample variances cannot be zero.');
      return;
    }

    let fRatio, df1, df2, largerVar, smallerVar;
    if (var1 >= var2) {
      fRatio = var1 / var2;
      df1 = n1 - 1;
      df2 = n2 - 1;
      largerVar = var1;
      smallerVar = var2;
    } else {
      fRatio = var2 / var1;
      df1 = n2 - 1;
      df2 = n1 - 1;
      largerVar = var2;
      smallerVar = var1;
    }

    setResult({
      n1,
      n2,
      m1,
      m2,
      var1,
      var2,
      largerVar,
      smallerVar,
      df1,
      df2,
      fRatio
    });
    setGridLog(log);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateFTest(sample1Input, sample2Input);
  };

  const handleDemo = () => {
    setDemoInProgress(true);
    setSample1Input('20, 22, 19, 23, 21, 24');
    setSample2Input('18, 17, 21, 19, 16');
    calculateFTest('20, 22, 19, 23, 21, 24', '18, 17, 21, 19, 16');
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setSample1Input('');
    setSample2Input('');
    setResult(null);
    setGridLog([]);
    setError('');
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-neutral-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">F-Test for Equality of Variances</h1>
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
            <label htmlFor="s1Data" className="block text-sm font-semibold mb-1">
              Sample 1 Data Values (comma-separated):
            </label>
            <input
              type="text"
              id="s1Data"
              value={sample1Input}
              onChange={(e) => setSample1Input(e.target.value)}
              placeholder="e.g. 20, 22, 19, 23, 21, 24"
              required
              className="w-full p-3 border dark:border-neutral-600 rounded-lg dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="s2Data" className="block text-sm font-semibold mb-1">
              Sample 2 Data Values (comma-separated):
            </label>
            <input
              type="text"
              id="s2Data"
              value={sample2Input}
              onChange={(e) => setSample2Input(e.target.value)}
              placeholder="e.g. 18, 17, 21, 19, 16"
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
            Calculate F-Ratio
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
          <strong>F-Test Initialization Log:</strong>
          {gridLog.map((log, idx) => (
            <p key={idx} className="font-mono text-sm">{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="my-4 p-4 bg-green-100 text-green-800 dark:bg-neutral-700 dark:text-green-200 rounded-xl font-bold text-lg">
          Calculated F-Statistic: <InlineMath math={`F = ${result.fRatio.toFixed(4)}`} /> (d.f. = {result.df1}, {result.df2})
        </div>
      )}

      {result && (
        <div className="my-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sample Variances Table:</h2>
            <ExportToPNG
              elementId="Table"
              fileName="ftest_table.png"
              tooltipText="Export Table to PNG"
              color="blue"
            />
          </div>
          <table id="Table" className="w-full table-auto border-collapse border dark:border-neutral-600 text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-700">
                <th className="border p-3">Sample</th>
                <th className="border p-3">Size n</th>
                <th className="border p-3">Mean \bar&#123;x&#125;</th>
                <th className="border p-3">Variance S^2</th>
                <th className="border p-3">Degrees of Freedom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3 font-mono">Sample 1</td>
                <td className="border p-3 font-mono">{result.n1}</td>
                <td className="border p-3 font-mono">{result.m1.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.var1.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.n1 - 1}</td>
              </tr>
              <tr>
                <td className="border p-3 font-mono">Sample 2</td>
                <td className="border p-3 font-mono">{result.n2}</td>
                <td className="border p-3 font-mono">{result.m2.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.var2.toFixed(4)}</td>
                <td className="border p-3 font-mono">{result.n2 - 1}</td>
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
              fileName="ftest_steps.png"
              tooltipText="Export Steps to PNG"
              color="blue"
            />
          </div>
          <div id="steps" className="space-y-4 font-mono">
            <div className="p-4 bg-purple-50 dark:bg-neutral-900 rounded-xl border border-purple-300 dark:border-purple-700">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">F-Ratio Variance Comparison</h3>
              <BlockMath math={`F_{\\text{calc}} = \\frac{S_1^2}{S_2^2} = \\frac{${result.largerVar.toFixed(4)}}{${result.smallerVar.toFixed(4)}} = ${result.fRatio.toFixed(4)}`} />
              <BlockMath math={`d.f._1 = ${result.df1}, \\quad d.f._2 = ${result.df2}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FTestSolver;
