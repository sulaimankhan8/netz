'use client';

import FullscreenToggle from "@/app/components/FullscreenToggle";
import LagrangeInterpolations from "./algorithems.lagrange-interpolations";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import ThemeToggle from "../../../../components/ThemeToggle";
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function LagrangeInterpolationPage() {
  const data = [
    { xxx: 0, yyy: 5, deltaY: `\\frac{(4-2)(4-3)(4-5)(4-6)}{(0-2)(0-3)(0-5)(0-6)} = 0.0222` },
    { xxx: 2, yyy: 7, deltaY: `\\frac{(4-0)(4-3)(4-5)(4-6)}{(2-0)(2-3)(2-5)(2-6)} = 0.3333` },
    { xxx: 3, yyy: 8, deltaY: `\\frac{(4-0)(4-2)(4-5)(4-6)}{(3-0)(3-2)(3-5)(3-6)} = 0.8889` },
    { xxx: 5, yyy: 10, deltaY: `\\frac{(4-0)(4-2)(4-3)(4-6)}{(5-0)(5-2)(5-3)(5-6)} = 0.5333` },
    { xxx: 6, yyy: 12, deltaY: `\\frac{(4-0)(4-2)(4-3)(4-5)}{(6-0)(6-2)(6-3)(6-5)} = 0.1111` },
  ];

  const formula = `
    P(x) = y_0 \\cdot L_0(x) + y_1 \\cdot L_1(x) + y_2 \\cdot L_2(x) + \\cdots + y_n \\cdot L_n(x)
  `;

  const str = `L_i(x) = \\frac{(x - x_0)(x - x_1) \\cdots (x - x_{i-1})(x - x_{i+1}) \\cdots (x - x_n)}{(x_i - x_0)(x_i - x_1) \\cdots (x_i - x_{i-1})(x_i - x_{i+1}) \\cdots (x_i - x_n)}`;

  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Lagrange Interpolation Method
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The Lagrange interpolation method is a polynomial interpolation technique used to construct a polynomial that passes through a given set of points (which need not be equally spaced). This method is particularly useful for finding the value of a function at a specific point given its values at known points.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Lagrange Interpolation:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center space-y-2">
              <BlockMath math={formula} />
              <BlockMath math={str} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="(x_n,y_n)" /> are the given data points.</li>
                <li><InlineMath math="L_i(x)" /> is the Lagrange basis polynomial.</li>
                <li><InlineMath math="P(x)" /> is the Lagrange interpolating polynomial.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Lagrange Interpolation
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300">Given the following data points:</p>

            {/* Data Table */}
            <div className="flex justify-center overflow-x-auto my-4">
              <table className="w-full max-w-md border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-neutral-900">
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-900 dark:text-white"><InlineMath math="x" /></th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-900 dark:text-white"><InlineMath math="y" /></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}>
                      <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.xxx}</td>
                      <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.yyy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300">We are tasked with finding <InlineMath math="y" /> where <InlineMath math="x = 4" />.</p>

            {/* Step 1 */}
            <div className="space-y-3 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Calculate Basis Polynomials <InlineMath math="L_n(x)" /></h3>
              <div className="flex justify-center overflow-x-auto my-2">
                <table className="w-full max-w-2xl border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-neutral-900">
                      <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="x" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="y" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="L_n(x)" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}>
                        <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.xxx}</td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.yyy}</td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math={row.deltaY} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 2 & 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Substitute Values</h3>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center overflow-x-auto space-y-2">
                <BlockMath math={`P(4) = 5(0.0222) + 7(0.3333) + 8(0.8889) + 10(0.5333) + 12(0.1111)`} />
                <BlockMath math={`P(4) = 0.1111 + 2.3331 + 7.1112 + 5.3330 + 1.3332 = 16.2216`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math="P(4) \approx 16.22" />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Thus, the interpolated value of <InlineMath math="y" /> at <InlineMath math="x = 4" /> using Lagrange interpolation is approximately <InlineMath math="16.22" />.
              </p>
            </div>
          </div>

          {/* Calculator Component */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <LagrangeInterpolations />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}
