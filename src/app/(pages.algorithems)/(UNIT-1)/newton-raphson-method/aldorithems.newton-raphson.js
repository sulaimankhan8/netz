'use client';

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import TButton from '../../../components/TButton';
import UnifiedPlot from '@/app/components/UnifiedPlot';
import ExportToPNG from "@/app/utils/ExportToPNG";
import { evaluateMath, getSymbolicDerivative } from '@/app/utils/evaluateMath';

const NewtonRaphsonMethod = () => {
  const [demoInProgress, setDemoInProgress] = useState(false);
  const [expression, setExpression] = useState("x * x * x - 4 * x - 9");
  const [initialGuess, setInitialGuess] = useState('');
  const [tolerance, setTolerance] = useState(0.0001);
  const [result, setResult] = useState(null);
  const [tableResults, setTableResults] = useState([]);
  const [stepDetails, setStepDetails] = useState([]);
  const [intervalSteps, setIntervalSteps] = useState([]);
  const [error, setError] = useState('');
  const [derivativeText, setDerivativeText] = useState('');

  const evaluateFunction = (fStr, xVal) => {
    try {
      return evaluateMath(fStr, xVal);
    } catch {
      return null;
    }
  };

  const findInterval = (fStr, maxRange = 100, step = 1) => {
    const steps = [];
    let a = 0;
    let fa = evaluateFunction(fStr, a);

    if (fa === null) {
      steps.push(`Evaluation error at x = 0.`);
      return { interval: null, steps };
    } else if (fa === 0) {
      steps.push(`Exact root found at x = 0.`);
      return { interval: [0, 0], steps };
    } else {
      for (let x = a + step; x <= maxRange; x += step) {
        const fx = evaluateFunction(fStr, x);
        if (fx === null) continue;
        if (fx === 0) {
          steps.push(`Exact root found at x = ${x}.`);
          return { interval: [x, x], steps };
        }
        if (fa * fx < 0) {
          steps.push(`Sign change detected between x = ${a} and x = ${x}.`);
          return { interval: [a, x], steps };
        }
        a = x;
        fa = fx;
      }
    }

    a = 0;
    fa = evaluateFunction(fStr, a);
    for (let x = a - step; x >= -maxRange; x -= step) {
      const fx = evaluateFunction(fStr, x);
      if (fx === null) continue;
      if (fx === 0) {
        steps.push(`Exact root found at x = ${x}.`);
        return { interval: [x, x], steps };
      }
      if (fa * fx < 0) {
        steps.push(`Sign change detected between x = ${x} and x = ${a}.`);
        return { interval: [x, a], steps };
      }
      a = x;
      fa = fx;
    }

    steps.push(`No valid sign-change interval found in [-${maxRange}, ${maxRange}].`);
    return { interval: null, steps };
  };

  const runNewtonRaphson = (exprStr, startX, tolVal, maxIterations = 100) => {
    setError('');
    let derivativeStr = '';
    try {
      derivativeStr = getSymbolicDerivative(exprStr, 'x');
      setDerivativeText(derivativeStr);
    } catch {
      setError('Could not calculate symbolic derivative for the entered function expression.');
      return;
    }

    const f = (val) => evaluateFunction(exprStr, val);
    const fPrime = (val) => evaluateFunction(derivativeStr, val);

    let currentX = startX;
    let iter = 0;
    const iterData = [];
    const detailedSteps = [];

    while (iter < maxIterations) {
      iter++;
      const fx = f(currentX);
      const fpx = fPrime(currentX);

      if (fx === null || fpx === null) {
        setError(`Math domain or calculation error at x = ${currentX}`);
        break;
      }

      if (fpx === 0) {
        setError(`Derivative f'(x) is 0 at x = ${currentX}. Iteration stopped to prevent division by zero.`);
        break;
      }

      const nextX = currentX - (fx / fpx);

      iterData.push({
        iteration: iter,
        x: currentX,
        fx: fx,
        fpx: fpx,
        nextX: nextX,
      });

      detailedSteps.push({
        iteration: iter,
        x: currentX,
        fx: fx,
        fpx: fpx,
        nextX: nextX,
        derivativeStr: derivativeStr,
      });

      if (Math.abs(nextX - currentX) < tolVal || Math.abs(fx) < tolVal) {
        setResult(`Root found at x = ${nextX.toFixed(6)} after ${iter} iterations (Tolerance: ${tolVal})`);
        setTableResults(iterData);
        setStepDetails(detailedSteps);
        return;
      }

      currentX = nextX;
    }

    setResult(`Approximate root x = ${currentX.toFixed(6)} after ${iter} iterations.`);
    setTableResults(iterData);
    setStepDetails(detailedSteps);
  };

  const handleCalculateRoot = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setResult(null);
    setTableResults([]);
    setStepDetails([]);
    setIntervalSteps([]);
    setError('');

    let startX = parseFloat(initialGuess);

    if (isNaN(startX)) {
      const { interval, steps } = findInterval(expression);
      setIntervalSteps(steps);

      if (interval) {
        startX = (interval[0] + interval[1]) / 2;
      } else {
        setError('No initial guess was provided and interval search could not find a sign change. Please enter an initial guess.');
        return;
      }
    }

    runNewtonRaphson(expression, startX, tolerance);
  };

  const handleDemo = async () => {
    setDemoInProgress(true);
    setExpression("x * x * x - 4 * x - 9");
    setInitialGuess('');
    setTolerance(0.0001);

    setTimeout(() => {
      handleCalculateRoot();
      setDemoInProgress(false);
    }, 150);
  };

  const handleReset = () => {
    setExpression("x * x * x - 4 * x - 9");
    setInitialGuess('');
    setTolerance(0.0001);
    setResult(null);
    setTableResults([]);
    setStepDetails([]);
    setIntervalSteps([]);
    setError('');
    setDerivativeText('');
  };

  return (
    <div className="w-full md:w-[80%] mx-auto p-6 bg-white dark:text-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700 text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold">Newton-Raphson Method Solver</h2>

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

      <form onSubmit={handleCalculateRoot} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="function" className="font-semibold block">
            Enter Function <InlineMath math="f(x)" />:
          </label>
          <input
            type="text"
            id="function"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g., x * x * x - 4 * x - 9"
            required
            className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-xl dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="initialGuess" className="font-semibold block">
              Initial Guess <InlineMath math="x_0" /> (Optional):
            </label>
            <input
              type="number"
              id="initialGuess"
              step="any"
              value={initialGuess}
              onChange={(e) => setInitialGuess(e.target.value)}
              placeholder="Auto-detect if blank"
              className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-xl dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tolerance" className="font-semibold block">
              Enter Tolerance:
            </label>
            <input
              type="number"
              id="tolerance"
              step="0.00001"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              placeholder="e.g., 0.0001"
              required
              className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-xl dark:bg-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
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

      {derivativeText && (
        <div className="p-4 bg-blue-50 dark:bg-neutral-900 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-neutral-700 rounded-xl">
          <span className="font-semibold mr-2">Symbolic Derivative <InlineMath math="f'(x)" />:</span>
          <InlineMath math={`f'(x) = ${derivativeText}`} />
        </div>
      )}

      {intervalSteps.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-neutral-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-neutral-700 rounded-xl space-y-1">
          <strong className="block mb-1">Interval Auto-Detection Steps:</strong>
          {intervalSteps.map((stepMsg, idx) => (
            <p key={idx} className="text-sm">{stepMsg}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="p-4 bg-emerald-50 dark:bg-neutral-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-neutral-700 rounded-xl font-semibold">
          <strong>Result:</strong> {result}
        </div>
      )}

      {tableResults.length > 0 && (
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
            iterations={tableResults} 
            functionInput={expression}  
          />
        </div>
      )}

      {tableResults.length > 0 && (
        <div className="w-full mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Newton-Raphson Method Iterations:</h2>
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
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold"><InlineMath math="x_n" /></th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold"><InlineMath math="f(x_n)" /></th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold"><InlineMath math="f'(x_n)" /></th>
                  <th className="border border-gray-200 dark:border-neutral-700 p-3 font-semibold"><InlineMath math="x_{n+1}" /></th>
                </tr>
              </thead>
              <tbody>
                {tableResults.map((item, index) => (
                  <tr 
                    key={index} 
                    className={index === tableResults.length - 1 
                      ? 'bg-emerald-600 text-white font-bold' 
                      : (index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900')
                    }
                  >
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{item.iteration}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{item.x.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{item.fx.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{item.fpx.toFixed(6)}</td>
                    <td className="border border-gray-200 dark:border-neutral-700 p-2.5">{item.nextX.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stepDetails.length > 0 && (
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
            {stepDetails.map((step, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl space-y-2">
                <h3 className="text-lg font-semibold">Iteration {step.iteration}</h3>
                <BlockMath math={`x_{${step.iteration - 1}} = ${step.x.toFixed(6)}`} />
                <BlockMath math={`f(x_{${step.iteration - 1}}) = ${step.fx.toFixed(6)}`} />
                <BlockMath math={`f'(x_{${step.iteration - 1}}) = ${step.fpx.toFixed(6)}`} />
                <BlockMath math={`x_{${step.iteration}} = x_{${step.iteration - 1}} - \\frac{f(x_{${step.iteration - 1}})}{f'(x_{${step.iteration - 1}})} = ${step.x.toFixed(6)} - \\frac{${step.fx.toFixed(6)}}{${step.fpx.toFixed(6)}} = ${step.nextX.toFixed(6)}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewtonRaphsonMethod;
