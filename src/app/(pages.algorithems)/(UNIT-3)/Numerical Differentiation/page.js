'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import NumericalDifferentiationSolver from './algorithems.numerical-differentiation';

export default function NumericalDifferentiationPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Numerical Differentiation (Central Difference Method)
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Numerical Differentiation</strong> is a technique used to estimate the derivatives of a function <InlineMath math="f(x)" /> at a specific point <InlineMath math="x" /> using values of the function evaluated at neighboring points spaced by a step size <InlineMath math="h" />.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Central Difference Formulas</strong> achieve <InlineMath math="\mathcal{O}(h^2)" /> second-order accuracy by averaging forward and backward steps:
          </p>

          {/* Formula Callouts */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">First Derivative Formula:</p>
            <div className="w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`f'(x) \\approx \\frac{f(x + h) - f(x - h)}{2h}`} />
            </div>

            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Second Derivative Formula:</p>
            <div className="w-full md:w-[80%] p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`f''(x) \\approx \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2}`} />
            </div>
            
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="x" /> is the target point at which derivatives are evaluated.</li>
                <li><InlineMath math="h" /> is the step size.</li>
                <li><InlineMath math="f(x + h)" /> and <InlineMath math="f(x - h)" /> are forward and backward evaluations.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Numerical Differentiation
            </h2>

            <div className="w-full md:w-[80%] p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Given Function</p>
              <BlockMath math={`f(x) = x^3 - 2x + 5`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">At <InlineMath math="x = 2, h = 0.1" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Evaluate Function at Key Points</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`f(1.9) = (1.9)^3 - 2(1.9) + 5 = 8.059`} />
                <BlockMath math={`f(2.0) = (2.0)^3 - 2(2.0) + 5 = 9.000`} />
                <BlockMath math={`f(2.1) = (2.1)^3 - 2(2.1) + 5 = 10.061`} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: First Derivative (<InlineMath math="f'(2)" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`f'(2) \\approx \\frac{10.061 - 8.059}{0.2} = 10.0100`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Second Derivative (<InlineMath math="f''(2)" />)</h3>
              <div className="w-full md:w-[80%] p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`f''(2) \\approx \\frac{10.061 - 2(9.0) + 8.059}{0.01} = 12.0000`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{f'(2) \\approx 10.0100, \\quad f''(2) \\approx 12.0000}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Central Difference Numerical Differentiation</strong> with <InlineMath math="h = 0.1" />, the estimated derivatives are <strong>f&apos;(2) = 10.0100</strong> and <strong>f&apos;&apos;(2) = 12.0000</strong> (exact values 10 and 12).
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Numerical Differentiation Calculator
            </h2>
            <NumericalDifferentiationSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}