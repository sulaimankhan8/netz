'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import ChiSquareSolver from './algorithems.chi-square';

export default function ChiSquarePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Chi-Square (&chi;&sup2;) Test for Goodness of Fit
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Chi-Square (&chi;&sup2;) Test for Goodness of Fit</strong> is a non-parametric hypothesis test used to assess whether an observed frequency distribution differs significantly from an expected theoretical frequency distribution across categorical groups.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Chi-Square Test Statistic Formula:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i} \\quad (df = k - 1)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="O_i" /> is the observed frequency in category <InlineMath math="i" />.</li>
                <li><InlineMath math="E_i" /> is the expected theoretical frequency under <InlineMath math="H_0" />.</li>
                <li><InlineMath math="k" /> is the number of categories.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Chi-Square Test
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Observed Counts (k = 4)</p>
              <BlockMath math={`O = [25, 19, 16, 20], \\quad E_i = 20`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Test at <InlineMath math="\alpha = 0.05" /></p>
            </div>

            {/* Step 1 & 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 & 2: Calculate Component Residuals</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`\\frac{(25-20)^2}{20} = 1.25, \\quad \\frac{(19-20)^2}{20} = 0.05`} />
                <BlockMath math={`\\frac{(16-20)^2}{20} = 0.80, \\quad \\frac{(20-20)^2}{20} = 0.00`} />
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3 & 4: Compute Chi-Square & Compare</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`\\chi^2 = 1.25 + 0.05 + 0.80 + 0.00 = 2.10`} />
                <BlockMath math={`\\chi^2_{\\text{calc}} = 2.10 < 7.815`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\text{Fail to Reject } H_0 \\text{ at } \\alpha = 0.05}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, because <InlineMath math="\chi^2_{\text{calc}} = 2.10 < 7.815" />, we <strong>fail to reject the null hypothesis</strong> and conclude that there is no statistically significant difference between observed and expected frequencies.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Chi-Square Calculator
            </h2>
            <ChiSquareSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}