'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import LeastSquaresSolver from './algorithems.least-squares';

export default function LeastSquaresPage() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Least Squares Method for Exponential Curve Fitting
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The <strong>Least Squares Method for Exponential Fitting</strong> fits a curve of the form <InlineMath math="y = a e^{bx}" /> by transforming non-linear growth or decay data into a linear relationship using natural logarithms.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Linear Transformation (<InlineMath math="\ln y = \ln a + b x" />):</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={`Y' = A + b \\cdot x \\quad (Y' = \\ln y, A = \\ln a)`} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="A = \ln a \implies a = e^A" />.</li>
                <li><InlineMath math="b" /> is the exponential growth or decay rate coefficient.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Exponential Curve Fitting
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300">Given the following 4 observation pairs:</p>

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
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-neutral-900">
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center font-bold">Y</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">1.6</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">4.5</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">13.8</td>
                    <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">40.2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Step 1 & 2 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 & 2: Log Transform & Statistics</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`\\sum x = 10, \\quad \\sum Y' = 8.2926`} />
                <BlockMath math={`\\sum x^2 = 30, \\quad \\sum x Y' = 26.1276`} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Solve for Rate (<InlineMath math="b" />) and Intercept (<InlineMath math="a" />)</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-1">
                <BlockMath math={`b = 1.0792, \\quad A = -0.625 \\implies a = e^{-0.625} \\approx 0.5353`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math={`\\boxed{y \\approx 0.5353 \\cdot e^{1.0792 x}}`} />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Therefore, using <strong>Exponential Least Squares Fitting</strong>, the curve equation of best fit is <strong><InlineMath math="y \approx 0.5353 \cdot e^{1.0792x}" /></strong>.
              </p>
            </div>
          </div>

          {/* Interactive Solver Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Exponential Curve Fitting Calculator
            </h2>
            <LeastSquaresSolver />
          </div>
        </section>
      </div>
    </FullscreenToggle>
  );
}