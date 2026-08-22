'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import BooleRuleSolver from './algorithems.boole-rule';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function BooleRulePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Boole&apos;s Rule of Numerical Integration
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Boole&apos;s Rule</strong> is a 4th-degree Newton-Cotes closed integration formula that approximates the definite integral <InlineMath math="\int_{a}^{b} f(x) \, dx" /> by fitting a 4th-order polynomial across 5 equally spaced points over every subinterval block.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            A fundamental requirement of Boole&apos;s Rule is that the number of subintervals <InlineMath math="n" /> <strong>must be a multiple of 4</strong> (e.g. <InlineMath math="n = 4, 8, 12" />).
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Boole&apos;s Rule:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`I \\approx \\frac{2h}{45} \\left[ 7y_0 + 32y_1 + 12y_2 + 32y_3 + 7y_4 + \\dots \\right]`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> is the lower limit of integration.</li>
                <li><InlineMath math="b" /> is the upper limit of integration.</li>
                <li><InlineMath math="n" /> is the number of subintervals (<strong>must be a multiple of 4</strong>).</li>
                <li><InlineMath math="h = \frac{b - a}{n}" /> is the step size.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Boole&apos;s Rule
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Evaluate Definite Integral</p>
              <BlockMath math={`\\int_{0}^{4} e^x \, dx`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">With <InlineMath math="n = 4 \text{ subintervals}" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Find Step Size (<InlineMath math="h" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={`h = \\frac{4 - 0}{4} = 1.0`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Determine Grid Points (<InlineMath math="x_i" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`x_0 = 0, \\quad x_1 = 1, \\quad x_2 = 2, \\quad x_3 = 3, \\quad x_4 = 4`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Evaluate Function Values (<InlineMath math="y_i = e^{x_i}" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y_0 = 1.0, \\quad y_1 = 2.71828, \\quad y_2 = 7.38906`} />
                <BlockMath math={`y_3 = 20.08554, \\quad y_4 = 54.59815`} />
              </div>
            </div>

            {/* Step 4 & 5 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Apply Boole&apos;s Formula</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`I \\approx \\frac{2(1.0)}{45} \\left[ 7(1) + 32(2.71828) + 12(7.38906) + 32(20.08554) + 7(54.59815) \\right]`} />
                <BlockMath math={`I \\approx \\frac{2}{45} \\left[ 1207.8767 \\right] \\approx 53.6834`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\int_{0}^{4} e^x \, dx \\approx 53.6834}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Boole&apos;s Rule</strong> with <InlineMath math="n = 4" />, the approximate value of the integral is <strong>53.6834</strong> (exact value <InlineMath math="e^4 - 1 \approx 53.59815" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Boole&apos;s Rule Calculator
            </h2>
            <BooleRuleSolver />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}