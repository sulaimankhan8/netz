'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import RungeKuttaSolver from './algorithems.runge-kutta';

export default function RungeKuttaMethodPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Runge-Kutta 4th Order Method (RK4) for ODEs
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Runge-Kutta 4th Order Method (RK4)</strong> is one of the most widely used and highly accurate numerical methods for solving ordinary differential equations (ODEs) of the form <InlineMath math="y' = f(x, y)" />.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It achieves 4th-order accuracy <InlineMath math="\mathcal{O}(h^4)" /> matching the Taylor series expansion up to <InlineMath math="h^4" /> without requiring explicit evaluation of higher-order analytical derivatives.
          </p>

          {/* Formula Callouts */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">RK4 Slopes & Update Formulas:</p>
            <div className="mx-auto w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`k_1 = h \\cdot f(x_n, y_n)`} />
              <BlockMath math={`k_2 = h \\cdot f\\left(x_n + \\frac{h}{2}, y_n + \\frac{k_1}{2}\\right)`} />
              <BlockMath math={`k_3 = h \\cdot f\\left(x_n + \\frac{h}{2}, y_n + \\frac{k_2}{2}\\right)`} />
              <BlockMath math={`k_4 = h \\cdot f\\left(x_n + h, y_n + k_3\\right)`} />
              <BlockMath math={`y_{n+1} = y_n + \\frac{1}{6} \\left( k_1 + 2k_2 + 2k_3 + k_4 \\right)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="k_1, k_2, k_3, k_4" /> are 4 intermediate slope evaluations across the interval.</li>
                <li><InlineMath math="h" /> is the step size increment.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Runge-Kutta 4th Order Method
            </h2>

            <div className="mx-auto w-full md:w-[80%] p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Solve Differential Equation</p>
              <BlockMath math={`\\frac{dy}{dx} = x + y, \\quad y(0) = 1`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Find <InlineMath math="y(0.1)" /> with <InlineMath math="h = 0.1" /></p>
            </div>

            {/* Step 1 to 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 to 4: Compute Intermediate Slopes</h3>
              <div className="mx-auto w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`k_1 = (0.1)(0 + 1) = 0.10000`} />
                <BlockMath math={`k_2 = (0.1)(0.05 + 1.05) = 0.11000`} />
                <BlockMath math={`k_3 = (0.1)(0.05 + 1.055) = 0.11050`} />
                <BlockMath math={`k_4 = (0.1)(0.1 + 1.1105) = 0.12105`} />
              </div>
            </div>

            {/* Step 5 & 6 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 5 & 6: Compute Average Update</h3>
              <div className="mx-auto w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`\\Delta y = \\frac{1}{6} [0.1 + 2(0.11) + 2(0.1105) + 0.12105] = 0.11034`} />
                <BlockMath math={`y(0.1) = 1 + 0.11034 = 1.11034`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="mx-auto w-full md:w-[80%] p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{y(0.1) \\approx 1.11034}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Runge-Kutta 4th Order Method (RK4)</strong> with <InlineMath math="h = 0.1" />, the approximate value of <InlineMath math="y" /> at <InlineMath math="x = 0.1" /> is <strong>1.11034</strong> (exact value <InlineMath math="2e^{0.1} - 0.1 - 1 \approx 1.11034" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Runge-Kutta 4th Order Calculator
            </h2>
            <RungeKuttaSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}