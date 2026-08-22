'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import TaylorSeriesSolver from './algorithems.taylor-series';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function TaylorSeriesMethodPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Taylor&apos;s Series Method for Ordinary Differential Equations
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Taylor&apos;s Series Method</strong> is a numerical technique used to find an approximate solution of an ordinary differential equation (ODE) by expanding the solution as a Taylor series around a known initial point.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It is particularly useful when the differential equation and its successive higher-order derivatives can be evaluated easily at the initial point.
          </p>

          {/* Formula Callouts */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Taylor Series Expansion:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`y(x) = y(x_0) + (x - x_0) y'(x_0) + \\frac{(x - x_0)^2}{2!} y''(x_0) + \\dots`} />
              <BlockMath math={`y(x) \\approx y_0 + (x - x_0) y'_0 + \\frac{(x - x_0)^2}{2!} y''_0 + \\dots + \\frac{(x - x_0)^n}{n!} y^{(n)}_0`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="x_0" /> is the initial value of <InlineMath math="x" />.</li>
                <li><InlineMath math="y_0 = y(x_0)" /> is the initial value of <InlineMath math="y" />.</li>
                <li><InlineMath math="y'_0, y''_0, \dots" /> are successive derivatives at <InlineMath math="x = x_0" />.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Taylor&apos;s Series Method
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Solve Differential Equation</p>
              <BlockMath math={`\\frac{dy}{dx} = x + y, \\quad y(0) = 1`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Find <InlineMath math="y(0.1)" /> up to 4th derivative</p>
            </div>

            {/* Step 1-4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 to 4: Compute Derivatives at <InlineMath math="x_0 = 0" /></h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y'(0) = 0 + 1 = 1`} />
                <BlockMath math={`y''(0) = 1 + y'(0) = 2`} />
                <BlockMath math={`y'''(0) = y''(0) = 2`} />
                <BlockMath math={`y''''(0) = y'''(0) = 2`} />
              </div>
            </div>

            {/* Step 5-7 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 5 to 7: Apply Expansion for <InlineMath math="x = 0.1" /></h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`y(0.1) = 1 + (0.1)(1) + \\frac{(0.1)^2}{2}(2) + \\frac{(0.1)^3}{6}(2) + \\frac{(0.1)^4}{24}(2)`} />
                <BlockMath math={`y(0.1) = 1 + 0.1 + 0.01 + 0.000333 + 0.000008 = 1.11034`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{y(0.1) \\approx 1.11034}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Taylor&apos;s Series Method up to the fourth derivative</strong>, the value of <InlineMath math="y" /> at <InlineMath math="x = 0.1" /> is approximately <strong>1.11034</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Taylor&apos;s Series Calculator
            </h2>
            <TaylorSeriesSolver />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}