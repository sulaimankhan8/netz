'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import IterationMethod from './algorithems.fixed-point-method';

export default function IterationMethods() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Fixed Point Iteration Method
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The Fixed Point Iteration method (or Iteration Method) rewrites an equation <InlineMath math="f(x) = 0" /> in the form <InlineMath math="x = \phi(x)" />. Starting from an initial guess <InlineMath math="x_0" />, successive approximations are generated using the recurrence relation <InlineMath math="x_{n+1} = \phi(x_n)" />.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Fixed Point Iteration:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`x_{n+1} = \\phi(x_n)`} />
              <BlockMath math={`|\\phi'(x)| < 1 \\quad (\\text{Convergence Condition})`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="\phi(x)" /> is derived from <InlineMath math="f(x) = 0" /> by isolating <InlineMath math="x" />.</li>
                <li>The iteration guarantees convergence if <InlineMath math="|\phi'(x)| < 1" /> near the root.</li>
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
              <BlockMath math={`f(x) = x^3 - x - 1 = 0`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Find root near <InlineMath math="x_0 = 1.5" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Rewrite Equation</h3>
              <p className="text-gray-700 dark:text-gray-300">Express <InlineMath math="x^3 - x - 1 = 0" /> as <InlineMath math="x = (x + 1)^{1/3}" />:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="\phi(x) = (x + 1)^{1/3}" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Check Convergence Condition</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math="\phi'(x) = \frac{1}{3(x+1)^{2/3}}" />
                <BlockMath math="|\phi'(1.5)| = \frac{1}{3(2.5)^{2/3}} \approx 0.18 < 1 \quad (\text{Convergent!})" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Perform Iterations</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math="x_1 = (1.5 + 1)^{1/3} \approx 1.3572" />
                <BlockMath math="x_2 = (1.3572 + 1)^{1/3} \approx 1.3309" />
                <BlockMath math="x_3 = (1.3309 + 1)^{1/3} \approx 1.3259" />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                The iterations converge to the root <strong>x &approx; 1.3247</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <IterationMethod />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}