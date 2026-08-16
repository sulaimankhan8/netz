'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import TrapezoidalRuleSolver from './algorithems.trapezoidal-rule';

export default function TrapezoidalRulePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Trapezoidal Rule of Numerical Integration
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Trapezoidal Rule</strong> is a fundamental numerical integration technique used to find an approximate value of a definite integral <InlineMath math="\int_{a}^{b} f(x) \, dx" /> by approximating the region under the graph of the function <InlineMath math="f(x)" /> as a series of trapezoids.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It is particularly useful when the function <InlineMath math="f(x)" /> is difficult or impossible to integrate analytically, or when data points are obtained experimentally at discrete intervals.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Trapezoidal Rule:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`I = \\int_{a}^{b} f(x) \, dx \\approx \\frac{h}{2} \\left[ (y_0 + y_n) + 2(y_1 + y_2 + \\dots + y_{n-1}) \\right]`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> is the lower limit of integration.</li>
                <li><InlineMath math="b" /> is the upper limit of integration.</li>
                <li><InlineMath math="n" /> is the number of subintervals.</li>
                <li><InlineMath math="h = \frac{b - a}{n}" /> is the step size or width of each subinterval.</li>
                <li><InlineMath math="y_0, y_1, \\dots, y_n" /> are the function values evaluated at grid points.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Trapezoidal Rule
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Evaluate Definite Integral</p>
              <BlockMath math={`\\int_{0}^{1} \\frac{1}{1 + x^2} \, dx`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">With <InlineMath math="n = 6 \text{ subintervals}" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Find Step Size (<InlineMath math="h" />)</h3>
              <p className="text-gray-700 dark:text-gray-300">Given <InlineMath math="a = 0, b = 1, n = 6" />:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={`h = \\frac{b - a}{n} = \\frac{1 - 0}{6} = \\frac{1}{6} \\approx 0.16667`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Determine Grid Points (<InlineMath math="x_i" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`x_0 = 0.0, \\quad x_1 = 0.1667, \\quad x_2 = 0.3333`} />
                <BlockMath math={`x_3 = 0.5, \\quad x_4 = 0.6667, \\quad x_5 = 0.8333, \\quad x_6 = 1.0`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Evaluate Function Values (<InlineMath math="y_i = \frac{1}{1 + x_i^2}" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y_0 = 1.00000, \\quad y_1 = 0.97297`} />
                <BlockMath math={`y_2 = 0.90000, \\quad y_3 = 0.80000`} />
                <BlockMath math={`y_4 = 0.69231, \\quad y_5 = 0.59016, \\quad y_6 = 0.50000`} />
              </div>
            </div>

            {/* Step 4 & 5 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Apply Formula</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`I \\approx \\frac{1/6}{2} \\left[ (1.0 + 0.5) + 2(3.95544) \\right]`} />
                <BlockMath math={`I \\approx \\frac{1}{12} \\left[ 9.41088 \\right] \\approx 0.78424`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\int_{0}^{1} \\frac{1}{1 + x^2} \, dx \\approx 0.78424}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Trapezoidal Rule</strong> with <InlineMath math="n = 6" />, the approximate value of the integral is <strong>0.78424</strong> (exact value <InlineMath math="\frac{\pi}{4} \approx 0.78540" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Trapezoidal Rule Calculator
            </h2>
            <TrapezoidalRuleSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}