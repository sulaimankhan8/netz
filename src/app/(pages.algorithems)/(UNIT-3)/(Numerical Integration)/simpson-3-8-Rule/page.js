'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import Simpson38RuleSolver from './algorithems.simpson-3-8-rule';

export default function Simpson38RulePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Simpson&apos;s 3/8 Rule of Numerical Integration
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Simpson&apos;s 3/8 Rule</strong> is another high-accuracy numerical integration formula derived by fitting cubic polynomials across groups of four consecutive points over subintervals.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It is particularly useful when the total number of subintervals <InlineMath math="n" /> is a <strong>multiple of 3</strong> (e.g. <InlineMath math="n = 3, 6, 9, 12" />).
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Formula for Simpson&apos;s 3/8 Rule:</p>
            <div className="w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`I = \\int_{a}^{b} f(x) \, dx \\approx \\frac{3h}{8} \\left[ (y_0 + y_n) + 3(y_1 + y_2 + y_4 + y_5 + \\dots) + 2(y_3 + y_6 + \\dots) \\right]`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> is the lower limit of integration.</li>
                <li><InlineMath math="b" /> is the upper limit of integration.</li>
                <li><InlineMath math="n" /> is the number of subintervals (<strong>must be a multiple of 3</strong>).</li>
                <li><InlineMath math="h = \frac{b - a}{n}" /> is the step size.</li>
                <li><InlineMath math="y_0 + y_n" /> is the sum of the first and last ordinates.</li>
                <li><InlineMath math="y_1 + y_2 + y_4 + \\dots" /> is the sum of ordinates not multiples of 3 (multiplied by 3).</li>
                <li><InlineMath math="y_3 + y_6 + \\dots" /> is the sum of interior ordinates divisible by 3 (multiplied by 2).</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Simpson&apos;s 3/8 Rule
            </h2>

            <div className="w-full md:w-[80%] p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Evaluate Definite Integral</p>
              <BlockMath math={`\\int_{0}^{3} e^x \, dx`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">With <InlineMath math="n = 3 \text{ subintervals (multiple of 3)}" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Find Step Size (<InlineMath math="h" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={`h = \\frac{3 - 0}{3} = 1.0`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Determine Grid Points (<InlineMath math="x_i" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`x_0 = 0.0, \\quad x_1 = 1.0, \\quad x_2 = 2.0, \\quad x_3 = 3.0`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Evaluate Function Values (<InlineMath math="y_i = e^{x_i}" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y_0 = 1.00000, \\quad y_1 = 2.71828`} />
                <BlockMath math={`y_2 = 7.38906, \\quad y_3 = 20.08554`} />
              </div>
            </div>

            {/* Step 4 & 5 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Apply Simpson&apos;s 3/8 Formula</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`I \\approx \\frac{3(1.0)}{8} \\left[ (1.0 + 20.08554) + 3(2.71828 + 7.38906) \\right]`} />
                <BlockMath math={`I \\approx 0.375 \\times 51.40756 \\approx 19.2778`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\int_{0}^{3} e^x \, dx \\approx 19.2778}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Simpson&apos;s 3/8 Rule</strong> with <InlineMath math="n = 3" />, the approximate value of the integral is <strong>19.2778</strong> (exact value <InlineMath math="e^3 - 1 \approx 19.0855" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Simpson&apos;s 3/8 Rule Calculator
            </h2>
            <Simpson38RuleSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}