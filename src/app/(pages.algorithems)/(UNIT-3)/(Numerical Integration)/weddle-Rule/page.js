'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import WeddleRuleSolver from './algorithems.weddle-rule';

export default function WeddleRulePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Weddle&apos;s Rule of Numerical Integration
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Weddle&apos;s Rule</strong> is an extremely accurate Newton-Cotes integration formula of degree 6. It approximates the definite integral <InlineMath math="\int_{a}^{b} f(x) \, dx" /> by interpolating groups of seven points with 6th-degree polynomials.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            A strict requirement for Weddle&apos;s Rule is that the number of subintervals <InlineMath math="n" /> <strong>must be a multiple of 6</strong> (e.g. <InlineMath math="n = 6, 12, 18" />).
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Formula for Weddle&apos;s Rule:</p>
            <div className="w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`I = \\int_{a}^{b} f(x) \, dx \\approx \\frac{3h}{10} \\left[ y_0 + 5y_1 + y_2 + 6y_3 + y_4 + 5y_5 + y_6 \\right]`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="a" /> is the lower limit of integration.</li>
                <li><InlineMath math="b" /> is the upper limit of integration.</li>
                <li><InlineMath math="n" /> is the number of subintervals (<strong>must be a multiple of 6</strong>).</li>
                <li><InlineMath math="h = \frac{b - a}{n}" /> is the step size.</li>
                <li><InlineMath math="y_0, y_1, y_2, y_3, y_4, y_5, y_6" /> are ordinates evaluated with weights <InlineMath math="(1, 5, 1, 6, 1, 5, 1)" />.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Weddle&apos;s Rule
            </h2>

            <div className="w-full md:w-[80%] p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Evaluate Definite Integral</p>
              <BlockMath math={`\\int_{0}^{6} \\frac{1}{1 + x^2} \, dx`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">With <InlineMath math="n = 6 \text{ subintervals (multiple of 6)}" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Find Step Size (<InlineMath math="h" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={`h = \\frac{6 - 0}{6} = 1.0`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Determine Grid Points (<InlineMath math="x_i" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`x_0 = 0, \\quad x_1 = 1, \\quad x_2 = 2, \\quad x_3 = 3, \\quad x_4 = 4, \\quad x_5 = 5, \\quad x_6 = 6`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Evaluate Function Values (<InlineMath math="y_i = \frac{1}{1 + x_i^2}" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`y_0 = 1.0, \\quad y_1 = 0.5, \\quad y_2 = 0.2`} />
                <BlockMath math={`y_3 = 0.1, \\quad y_4 = 0.0588, \\quad y_5 = 0.0385, \\quad y_6 = 0.027`} />
              </div>
            </div>

            {/* Step 4 & 5 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Apply Weddle&apos;s Formula</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`I \\approx \\frac{3(1.0)}{10} \\left[ 1.0 + 5(0.5) + 0.2 + 6(0.1) + 0.0588 + 5(0.0385) + 0.027 \\right]`} />
                <BlockMath math={`I \\approx 0.30 \\times 4.57816 \\approx 1.37345`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\int_{0}^{6} \\frac{1}{1 + x^2} \, dx \\approx 1.37345}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Weddle&apos;s Rule</strong> with <InlineMath math="n = 6" />, the approximate value of the integral is <strong>1.37345</strong> (exact value <InlineMath math="\arctan 6 \approx 1.40565" />).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Weddle&apos;s Rule Calculator
            </h2>
            <WeddleRuleSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}