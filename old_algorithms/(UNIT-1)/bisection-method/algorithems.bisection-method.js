'use client';

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import React, { useState } from 'react';
import TButton from '../../../components/TButton';
import UnifiedPlot from '@/app/components/UnifiedPlot';
import ExportToPNG from "@/app/utils/ExportToPNG";
import { parseUserFunction } from "@/app/utils/evaluateMath";

const BisectionMethod = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [functionInput, setFunctionInput] = useState("x * x *x - 4*x -9"); // Default function
  const [tolerance, setTolerance] = useState(0.0001);
  const [result, setResult] = useState(null);
  const [intervalSteps, setIntervalSteps] = useState([]);
  const [bisectionIterations, setBisectionIterations] = useState([]);
  const [error, setError] = useState('');
  const [iterationsCount, setIterationsCount] = useState(0);

  // Handle input changes
  const handleFunctionChange = (e) => {
    setFunctionInput(e.target.value);
  };

  const handleToleranceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) {
      setTolerance(0.0001);
    } else {
      setTolerance(value);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIntervalSteps([]);
    setBisectionIterations([]);
    setIterationsCount(0);

    // Convert user input to a function safely using mathjs
    let f;
    try {
      f = parseUserFunction(functionInput);
      f(0);
    } catch (err) {
      setError("Invalid function input. Please enter a valid mathematical expression like x^3 - 4*x - 9.");
      return;
    }

    // Find interval
    const { interval, steps: intervalLog } = findInterval(f, 1000);
    setIntervalSteps(intervalLog);

    if (!interval) {
      setError("Could not find an interval where the function changes sign within the search range.");
      return;
    }

    const [a, b] = interval;

    // Perform Bisection Method
    const { message, iterations } = bisectionMethod(f, a, b, tolerance);

    setResult(message);
    setBisectionIterations(iterations);
    setIterationsCount(iterations.length);
  };

  // Function to find interval automatically
  const findInterval = (f, maxRange = 1000, step = 1) => {
    const steps = [];
    let fa, fb, a, b;

    const evaluateFunction = (x) => {
      try {
        const fx = f(x);
        steps.push(`f(${x}) = ${fx.toFixed(6)}`);
        return fx;
      } catch (err) {
        steps.push(`Error evaluating function at x = ${x}`);
        return null;
      }
    };

    a = 0;
    fa = evaluateFunction(a);
    if (fa === null) {
      steps.push(`Skipping positive direction due to evaluation error at x = ${a}`);
    } else if (fa === 0) {
      steps.push(`Exact root found at x = ${a} `);
      return { interval: [a-1, a+1], steps };
    } else {
      for (let x = a + step; x <= maxRange; x += step) {
        const fx = evaluateFunction(x);
        if (fx === null) continue;

        if (fx === 0) {
          steps.push(`Exact root found at x = ${x},\n
             Sign change detected between x = ${x-1} and x = ${x+1}`);
          return { interval: [x-1, x+1], steps };
        }

        if (fa * fx < 0) {
          b = x;
          fb = fx;
          steps.push(`Sign change detected between x = ${a} and x = ${b}`);
          return { interval: [a, b], steps };
        }

        a = x;
        fa = fx;
      }
    }

    steps.push(`No valid interval found in positive direction up to x = ${maxRange}. Searching in negative direction.`);
    
    a = 0;
    fa = evaluateFunction(a);
    if (fa === null) {
      steps.push(`Skipping negative direction due to evaluation error at x = ${a}`);
      return { interval: null, steps };
    } else if (fa === 0) {
      steps.push(`Exact root found at x = ${a}`);
      return { interval: [a, a], steps };
    } else {
      for (let x = a - step; x >= -maxRange; x -= step) {
        const fx = evaluateFunction(x);
        if (fx === null) continue;

        if (fx === 0) {
          steps.push(`Exact root found at x = ${x}`);
          return { interval: [x, x], steps };
        }

        if (fa * fx < 0) {
          b = a;
          a = x;
          fb = fa;
          fa = fx;
          steps.push(`Sign change detected between x = ${a} and x = ${b}`);
          return { interval: [a, b], steps };
        }

        a = x;
        fa = fx;
      }
    }

    steps.push(`No valid interval found in negative direction up to x = -${maxRange}.`);
    return { interval: null, steps };
  };

  const bisectionMethod = (f, a, b, tol, maxIter = 100) => {
    let iterations = [];
    let c = a;
    let iter = 0;

    while (iter < maxIter) {
      iter++;
      c = (a + b) / 2;
      const fa = f(a);
      const fb = f(b);
      const fc = f(c);

      iterations.push({ iteration: iter, a, b, c, fa, fb, fc });

      if (Math.abs(fc) < tol || (b - a) / 2 < tol) {
        return {
          message: `Root found at x = ${c.toFixed(6)} with tolerance ${tol}`,
          iterations,
        };
      }

      if (fa * fc < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    return {
      message: `Max iterations reached. Approximate root at x = ${c.toFixed(6)}`,
      iterations,
    };
  };

  const handleDemo = async () => {
    setDemoInProgress(true);
    setFunctionInput("x * x * x - 4 * x - 9");
    setTolerance(0.0001);

    const syntheticEvent = { preventDefault: () => {} };
    handleSubmit(syntheticEvent);
    setDemoInProgress(false);
  };

  const handleReset = () => {
    setFunctionInput("x * x *x - 4*x -9");
    setTolerance(0.0001);
    setResult(null);
    setIntervalSteps([]);
    setBisectionIterations([]);
    setError('');
    setIterationsCount(0);
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:text-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold">Bisection Method Solver</h2>

        <TButton
          tooltipText="Demo"
          onClick={handleDemo}
          className={`bg-purple-700 ${demoInProgress ? "opacity-50 cursor-not-allowed" : ""} hover:bg-purple-400`}
          color="violet"
          altText="Demo"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="function" className="font-semibold">Enter Function <InlineMath math="f(x)" />:</label>
          <input
            type="text"
            id="function"
            value={functionInput}
            onChange={handleFunctionChange}
            placeholder="e.g., x * x - 4"
            required
            className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-xl dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tolerance" className="font-semibold">Enter Tolerance:</label>
          <input
            type="number"
            id="tolerance"
            step="0.00001"
            value={tolerance}
            onChange={handleToleranceChange}
            placeholder="e.g., 0.0001"
            required
            className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-xl dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            id="Calculate"
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-600 bg-green-500 active:bg-green-700 transition"
          >
            Calculate
          </button>

          <TButton
            tooltipText="Reset"
            onClick={handleReset}
            imgSrc="/reset.svg"
            altText="Reset"
            color="red"
          />
        </div>
      </form>

      {intervalSteps.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-neutral-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-neutral-700 rounded-xl space-y-1">
          <strong className="block mb-1">Interval Detection Steps [ a , b ]:</strong>
          {intervalSteps.map((step, index) => (
            <p key={index} className="text-sm">{step}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="p-4 bg-emerald-50 dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-neutral-700 rounded-xl font-semibold">
          <strong>Result:</strong> {result}
        </div>
      )}

      {bisectionIterations.length > 0 && (
        <div className="w-full mx-auto dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Plot:</h2>
            <ExportToPNG 
              elementId="graphCanvas"
              fileName="graphCanvas.png"
              tooltipText="Export&nbsp;Plot&nbsp;to&nbsp;PNG"
              color="blue"
              altText="Export Plot" 
            />
          </div>
          <UnifiedPlot 
            iterations={bisectionIterations} 
            functionInput={functionInput}  
          />
        </div>
      )}

      {bisectionIterations.length > 0 && (
        <div className="w-full mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bisection Method Iterations:</h2>
            <ExportToPNG 
              elementId="Table"
              fileName="table.png"
              tooltipText="Export&nbsp;Table&nbsp;to&nbsp;PNG"
              color="blue"
              altText="Export Table" 
            />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700">
            <table id="Table" className="w-full table-auto border-collapse text-center">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-900">
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">Iteration</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">a</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">b</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">c(mid)</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">f(a)</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">f(b)</th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold">f(c)</th>
                </tr>
              </thead>
              <tbody>
                {bisectionIterations.map((iter, index) => (
                  <tr key={index} className={index === bisectionIterations.length - 1 ? 'bg-emerald-600 text-white font-bold' : (index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900')}>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.iteration}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.a.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.b.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.c.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.fa.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.fb.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{iter.fc.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {bisectionIterations.length > 0 && (
        <div className="w-full mx-auto text-wrap dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Detailed Steps:</h2>
            <ExportToPNG 
              elementId="steps"
              fileName="steps.png"
              tooltipText="Export&nbsp;Steps&nbsp;to&nbsp;PNG" 
              color="blue" 
              altText="Export Steps" 
            />
          </div>
          <div id="steps" className="space-y-4">
            {bisectionIterations.map((iter, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl space-y-2">
                <h3 className="text-lg font-semibold">Iteration {iter.iteration}</h3>
                <BlockMath math={`a^{(${iter.iteration})} = ${iter.a.toFixed(6)}`} />
                <BlockMath math={`b^{(${iter.iteration})} = ${iter.b.toFixed(6)}`} />
                <BlockMath math={`c^{(${iter.iteration})} = \\frac{a + b}{2} = \\frac{${iter.a.toFixed(6)} + ${iter.b.toFixed(6)}}{2} = ${iter.c.toFixed(6)}`} />
                <BlockMath math={`f(c^{(${iter.iteration})}) = ${iter.fc.toFixed(6)}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BisectionMethod;
