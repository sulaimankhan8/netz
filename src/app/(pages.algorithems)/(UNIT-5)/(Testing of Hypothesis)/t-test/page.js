'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import TTestSolver from './algorithems.t-test';

export default function TTestPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Student&apos;s t-Test for Small Sample Means
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Student&apos;s t-Test</strong> is a statistical hypothesis test used when the sample size is small (<InlineMath math="n < 30" />) and the population standard deviation <InlineMath math="\sigma" /> is unknown.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">t-Statistic Formula:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}} \\quad (df = n - 1)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="\bar{x}" /> is the sample mean.</li>
                <li><InlineMath math="\mu_0" /> is the hypothesized population mean.</li>
                <li><InlineMath math="s" /> is the sample standard deviation.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Student&apos;s t-Test
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Sample Dataset</p>
              <BlockMath math={`[12, 15, 11, 14, 13]`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Test <InlineMath math="\mu_0 = 10" /> at <InlineMath math="\alpha = 0.05" /></p>
            </div>

            {/* Step 1 & 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 & 2: Formulate Hypotheses & Compute Stats</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`\\bar{x} = 13.0, \\quad s \\approx 1.5811, \\quad df = 4`} />
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3 & 4: Compute t & Compare with Critical Value</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`t = \\frac{13.0 - 10}{0.7071} = 4.2426`} />
                <BlockMath math={`|t_{\\text{calc}}| = 4.24 > 2.776`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\text{Reject } H_0 \\text{ at } \\alpha = 0.05}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, because <InlineMath math="|t_{\text{calc}}| = 4.2426 > 2.776" />, we <strong>reject the null hypothesis</strong> and conclude that the mean is significantly greater than 10.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Student&apos;s t-Test Calculator
            </h2>
            <TTestSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}