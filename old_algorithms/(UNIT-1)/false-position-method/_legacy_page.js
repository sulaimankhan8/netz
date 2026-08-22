'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import FalsePositionMethod from './algorithems.false-positions-method';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function FalsePositionMethods() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              False Position Method (Regula Falsi)
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The False Position Method (or Regula Falsi) is a root-finding algorithm that combines features of the Bisection Method and the Secant Method. It approximates the root of a continuous function by drawing a secant line between two initial points with opposite signs.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for False Position Method:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`c = \\frac{a \\cdot f(b) - b \\cdot f(a)}{f(b) - f(a)}`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> and <InlineMath math="b" /> are initial guesses such that <InlineMath math="f(a)" /> and <InlineMath math="f(b)" /> have opposite signs.</li>
                <li><InlineMath math="c" /> is the x-intercept of the secant line joining <InlineMath math="(a, f(a))" /> and <InlineMath math="(b, f(b))" />.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Given Function</p>
              <BlockMath math={`f(x) = x^3 - 2x - 5 = 0`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Error Margin is 0.001</p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Choose Initial Points</h3>
              <p className="text-gray-700 dark:text-gray-300">Choose <InlineMath math="a = 2" /> and <InlineMath math="b = 3" />:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                <BlockMath math="f(2) = 2^3 - 2(2) - 5 = -1 \quad (\text{negative})" />
                <BlockMath math="f(3) = 3^3 - 2(3) - 5 = 16 \quad (\text{positive})" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Calculate First Approximation</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                <BlockMath math="c_1 = \frac{2(16) - 3(-1)}{16 - (-1)} = \frac{32 + 3}{17} = \frac{35}{17} \approx 2.0588" />
                <BlockMath math="f(2.0588) = (2.0588)^3 - 2(2.0588) - 5 \approx -0.3908" />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By repeating the False Position formula, the root converges to <strong>2.0945</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <FalsePositionMethod />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}