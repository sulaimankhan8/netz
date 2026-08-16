'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import Simpson13RuleSolver from './algorithems.simpson-1-3-rule';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function Simpson13RulePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Simpson&apos;s 1/3 Rule of Numerical Integration
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Simpson&apos;s 1/3 Rule</strong> is an advanced numerical integration technique that approximates the definite integral <InlineMath math="\int_{a}^{b} f(x) \, dx" /> by connecting groups of three consecutive points with quadratic parabolas instead of straight line segments.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Because it uses 2nd-degree polynomials, it provides significantly higher accuracy than the Trapezoidal Rule. A key requirement of Simpson&apos;s 1/3 Rule is that the number of subintervals <InlineMath math="n" /> <strong>must be even</strong>.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Simpson&apos;s 1/3 Rule:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`I = \\int_{a}^{b} f(x) \, dx \\approx \\frac{h}{3} \\left[ (y_0 + y_n) + 4(y_1 + y_3 + \\dots) + 2(y_2 + y_4 + \\dots) \\right]`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> is the lower limit of integration.</li>
                <li><InlineMath math="b" /> is the upper limit of integration.</li>
                <li><InlineMath math="n" /> is the number of subintervals (<strong>must be an even integer</strong>).</li>
                <li><InlineMath math="h = \frac{b - a}{n}" /> is the step size.</li>
                <li><InlineMath math="y_0 + y_n" /> is the sum of the first and last ordinates.</li>
                <li><InlineMath math="y_1 + y_3 + \\dots" /> is the sum of odd-indexed ordinates (multiplied by 4).</li>
                <li><InlineMath math="y_2 + y_4 + \\dots" /> is the sum of even-indexed interior ordinates (multiplied by 2).</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Simpson&apos;s 1/3 Rule
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Evaluate Definite Integral</p>
              <BlockMath math={`\\int_{0}^{1} \\frac{1}{1 + x} \, dx`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">With <InlineMath math="n = 4 \text{ subintervals (even)}" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Find Step Size (<InlineMath math="h" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={`h = \\frac{1 - 0}{4} = 0.25`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Determine Grid Points (<InlineMath math="x_i" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`x_0 = 0.0, \\quad x_1 = 0.25, \\quad x_2 = 0.5`} />
                <BlockMath math={`x_3 = 0.75, \\quad x_4 = 1.0`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Evaluate Function Values (<InlineMath math="y_i = \frac{1}{1 + x_i}" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y_0 = 1.0, \\quad y_1 = 0.8, \\quad y_2 = 0.6667`} />
                <BlockMath math={`y_3 = 0.5714, \\quad y_4 = 0.5`} />
              </div>
            </div>

            {/* Step 4 & 5 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Apply Simpson&apos;s 1/3 Formula</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`I \\approx \\frac{0.25}{3} \\left[ (1.0 + 0.5) + 4(0.8 + 0.5714) + 2(0.6667) \\right]`} />
                <BlockMath math={`I \\approx \\frac{0.25}{3} \\left[ 8.31906 \\right] \\approx 0.69315`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\int_{0}^{1} \\frac{1}{1 + x} \, dx \\approx 0.69315}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Simpson&apos;s 1/3 Rule</strong> with <InlineMath math="n = 4" />, the approximate value of the integral is <strong>0.69315</strong> (exact value <InlineMath math="\ln 2 \approx 0.69315" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Simpson&apos;s 1/3 Rule Calculator
            </h2>
            <Simpson13RuleSolver />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}