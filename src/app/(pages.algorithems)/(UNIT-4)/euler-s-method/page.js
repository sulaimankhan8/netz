'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import EulerMethodSolver from './algorithems.euler-method';

export default function EulerMethodPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Euler&apos;s Method for Ordinary Differential Equations
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Euler&apos;s Method</strong> is the simplest first-order numerical procedure for solving ordinary differential equations (ODEs) with a given initial value.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It works by taking small linear step increments along the tangent slope computed at the current point to approximate the curve of the solution function over an interval.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Formula for Euler&apos;s Method:</p>
            <div className="w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`y_{n+1} = y_n + h \\cdot f(x_n, y_n)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="x_n" /> is the current point value of <InlineMath math="x" />.</li>
                <li><InlineMath math="y_n" /> is the current estimated solution value of <InlineMath math="y" />.</li>
                <li><InlineMath math="h" /> is the step size increment.</li>
                <li><InlineMath math="f(x_n, y_n)" /> is the slope function <InlineMath math="\frac{dy}{dx}" /> evaluated at <InlineMath math="(x_n, y_n)" />.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Euler&apos;s Method
            </h2>

            <div className="w-full md:w-[80%] p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Solve Differential Equation</p>
              <BlockMath math={`\\frac{dy}{dx} = x + y, \\quad y(0) = 1`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Find <InlineMath math="y(0.2)" /> with <InlineMath math="h = 0.1" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Identify Parameters</h3>
              <p className="text-gray-700 dark:text-gray-300">Initial point <InlineMath math="x_0 = 0, y_0 = 1" />, step size <InlineMath math="h = 0.1" />, slope function <InlineMath math="f(x, y) = x + y" />.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: First Iteration (<InlineMath math="x_1 = 0.1" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`f(x_0, y_0) = 0 + 1 = 1`} />
                <BlockMath math={`y_1 = 1 + (0.1)(1) = 1.1`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Second Iteration (<InlineMath math="x_2 = 0.2" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`f(x_1, y_1) = 0.1 + 1.1 = 1.2`} />
                <BlockMath math={`y_2 = 1.1 + (0.1)(1.2) = 1.22`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{y(0.2) \\approx 1.22000}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Euler&apos;s Method</strong> with step size <InlineMath math="h = 0.1" />, the approximate value of <InlineMath math="y" /> at <InlineMath math="x = 0.2" /> is <strong>1.22000</strong> (exact analytical value 1.24281).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Euler&apos;s Method Calculator
            </h2>
            <EulerMethodSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}