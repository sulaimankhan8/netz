'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import NewtonRaphsonMethod from './aldorithems.newton-raphson';

export default function NewtonRaphsonMethods() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Newton-Raphson Method
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The Newton-Raphson method is a powerful second-order root-finding algorithm that uses the tangent line of a function <InlineMath math="f(x)" /> at an initial guess <InlineMath math="x_0" /> to find successively better approximations of a root.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Newton-Raphson Method:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="x_n" /> is the current approximation of the root.</li>
                <li><InlineMath math="f(x_n)" /> is the value of the function at <InlineMath math="x_n" />.</li>
                <li><InlineMath math="f'(x_n)" /> is the derivative of the function at <InlineMath math="x_n" /> (must be non-zero).</li>
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
              <BlockMath math={`f(x) = x^2 - 5 = 0`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Initial Guess <InlineMath math="x_0 = 2" /></p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Compute Derivative</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="f'(x) = 2x" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: First Iteration (<InlineMath math="x_1" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math="f(2) = 2^2 - 5 = -1, \quad f'(2) = 2(2) = 4" />
                <BlockMath math="x_1 = 2 - \frac{-1}{4} = 2 + 0.25 = 2.25" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Second Iteration (<InlineMath math="x_2" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math="f(2.25) = (2.25)^2 - 5 = 0.0625, \quad f'(2.25) = 4.5" />
                <BlockMath math="x_2 = 2.25 - \frac{0.0625}{4.5} \approx 2.2361" />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                The Newton-Raphson Method rapidly converges to <InlineMath math="\sqrt{5} \approx 2.236068" /> in just a few iterations.
              </p>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <NewtonRaphsonMethod />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}
