'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import StraightLineSolver from './algorithems.straight-line';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function FittingStraightLinesPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Fitting a Straight Line (Linear Regression)
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Fitting a Straight Line</strong> using the <strong>Least Squares Method</strong> is a statistical technique used to find the line of best fit <InlineMath math="y = a + bx" /> that minimizes the sum of squared vertical distances (residuals) between sample data points and the line.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            It is widely used in trend analysis, linear modeling, and forecasting relationships between an independent variable <InlineMath math="x" /> and a dependent variable <InlineMath math="y" />.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Normal Equations for Straight Line (<InlineMath math="y = a + bx" />):</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`\\sum y = n \\cdot a + b \\sum x`} />
              <BlockMath math={`\\sum xy = a \\sum x + b \\sum x^2`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="n" /> is the number of data point pairs.</li>
                <li><InlineMath math="a" /> is the y-intercept of the fitted line.</li>
                <li><InlineMath math="b" /> is the slope coefficient.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Fitting a Straight Line
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300">Given the following dataset of 5 observation pairs:</p>

            {/* Data Table */}
            <div className="flex justify-center overflow-x-auto my-4">
              <table className="w-full max-w-md border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-neutral-900">
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-900 dark:text-white font-bold">X</th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">1</th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">2</th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">3</th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">4</th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-neutral-900">
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center font-bold">Y</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">2</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">3</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">5</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">4</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">6</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Calculate Summary Statistics</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`\\sum x = 15, \\quad \\sum y = 20`} />
                <BlockMath math={`\\sum x^2 = 55, \\quad \\sum xy = 71`} />
              </div>
            </div>

            {/* Step 2 & 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2 & 3: Solve for Coefficients (<InlineMath math="a, b" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                <BlockMath math={`b = \\frac{5(71) - 15(20)}{5(55) - 15^2} = \\frac{55}{50} = 1.1`} />
                <BlockMath math={`a = \\frac{20 - 1.1(15)}{5} = \\frac{3.5}{5} = 0.7`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{y = 0.7 + 1.1 x}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using the <strong>Least Squares Method</strong>, the straight line of best fit for the given dataset is <strong>y = 0.7 + 1.1x</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Fitting a Straight Line Calculator
            </h2>
            <StraightLineSolver />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}