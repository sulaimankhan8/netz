'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import ZTestSolver from './algorithems.z-test';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function TestOfSignificancePage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Z-Test for Large Sample Hypothesis Testing
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Z-Test</strong> is a parametric statistical test used to determine whether there is a statistically significant difference between a sample mean <InlineMath math="\bar{x}" /> and a population mean <InlineMath math="\mu_0" /> when the sample size is large (<InlineMath math="n \ge 30" />) or when the population standard deviation <InlineMath math="\sigma" /> is known.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Z-Statistic Formula:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`Z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}} = \\frac{\\bar{x} - \\mu_0}{SE}`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="\bar{x}" /> is the calculated sample mean.</li>
                <li><InlineMath math="\mu_0" /> is the hypothesized population mean under <InlineMath math="H_0" />.</li>
                <li><InlineMath math="SE = \frac{\sigma}{\sqrt{n}}" /> is the standard error.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Z-Test
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Testing Claimed Mean</p>
              <BlockMath math={`\\mu_0 = 1000, \\quad \\sigma = 50`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Sample of <InlineMath math="n = 100" /> gives <InlineMath math="\bar{x} = 1012" /> at <InlineMath math="\alpha = 0.05" /></p>
            </div>

            {/* Step 1 & 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 & 2: Formulate Hypotheses & Standard Error</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`H_0: \\mu = 1000, \\quad H_1: \\mu \\neq 1000`} />
                <BlockMath math={`SE = \\frac{50}{\\sqrt{100}} = 5.0`} />
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3 & 4: Compute Z & Compare with Critical Value</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`Z = \\frac{1012 - 1000}{5.0} = 2.40`} />
                <BlockMath math={`|Z_{\\text{calc}}| = 2.40 > 1.96`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{\\text{Reject } H_0 \\text{ at } \\alpha = 0.05}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, because <InlineMath math="|Z_{\text{calc}}| = 2.40 > 1.96" />, we <strong>reject the null hypothesis</strong> and conclude that the mean lifetime differs significantly from 1000 hours.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Z-Test Calculator
            </h2>
            <ZTestSolver />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}