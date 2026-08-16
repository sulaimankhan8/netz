'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import FTestSolver from './algorithems.f-test';

export default function FTestPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              F-Test for Equality of Two Variances
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>F-Test (Variance Ratio Test)</strong> is a hypothesis test used to compare the variances of two independent, normally distributed populations to evaluate whether one population has greater variability than another.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">F-Statistic Formula:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`F = \\frac{s_1^2}{s_2^2} \\quad (s_1^2 \\ge s_2^2)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="s_1^2" /> is the larger sample variance with <InlineMath math="df_1 = n_1 - 1" />.</li>
                <li><InlineMath math="s_2^2" /> is the smaller sample variance with <InlineMath math="df_2 = n_2 - 1" />.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of F-Test
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Comparing Sample Variances</p>
              <BlockMath math={`n_1 = 10, s_1^2 = 25.0 \\quad | \\quad n_2 = 12, s_2^2 = 10.0`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Test at <InlineMath math="\alpha = 0.05" /></p>
            </div>

            {/* Step 1 & 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 & 2: Formulate Hypotheses & Assign Degrees of Freedom</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`H_0: \\sigma_1^2 = \\sigma_2^2, \\quad H_1: \\sigma_1^2 \\neq \\sigma_2^2`} />
                <BlockMath math={`df_1 = 9, \\quad df_2 = 11`} />
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3 & 4: Compute F Statistic & Compare</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`F = \\frac{25.0}{10.0} = 2.50`} />
                <BlockMath math={`F_{\\text{calc}} = 2.50 < 2.896`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\text{Fail to Reject } H_0 \\text{ at } \\alpha = 0.05}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, because <InlineMath math="F_{\text{calc}} = 2.50 < 2.896" />, we <strong>fail to reject the null hypothesis</strong> and conclude that there is no statistically significant difference between the two population variances.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive F-Test Calculator
            </h2>
            <FTestSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}