'use client';

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import Head from 'next/head';
import NewtonBackwardInterpolations from "./algorithems.newton-backward-interpolations";
import ThemeToggle from "../../../../components/ThemeToggle";
import FullscreenToggle from "@/app/components/FullscreenToggle";
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function NewtonBackwardInterpolation() {
  const str = `P(x) = y_n + v \\cdot \\Delta y_n + \\frac{v(v+1)}{2!} \\cdot \\Delta^2 y_{n-2} + \\frac{v(v+1)(v+2)}{3!} \\Delta^{3} y_{n-3} \\ldots`;
  const data = [
    { xxx: 24, yyy: 28.0600, deltaY: '', delta2Y: '', delta3Y: '', delta4Y: '' },
    { xxx: 28, yyy: 30.1900, deltaY: 2.1300, delta2Y: '', delta3Y: '', delta4Y: '' },
    { xxx: 32, yyy: 32.7500, deltaY: 2.5600, delta2Y: 0.4300, delta3Y: '', delta4Y: '' },
    { xxx: 36, yyy: 34.9400, deltaY: 2.1900, delta2Y: -0.3700, delta3Y: -0.8000, delta4Y: '' },
    { xxx: 40, yyy: 40.0000, deltaY: 5.0600, delta2Y: 2.8700, delta3Y: 3.2400, delta4Y: 4.0400 },
  ];

  const formula = `
    P(x) = y_n + v \\cdot \\Delta y_n + \\frac{v(v+1)}{2!} \\cdot \\Delta^2 y_{n-2} 
    + \\frac{v(v+1)(v+2)}{3!} \\cdot \\Delta^3 y_{n-3} 
    + \\frac{v(v+1)(v+2)(v+3)}{4!} \\cdot \\Delta^4 y_{n-4} + \\cdots
  `;

  return (
    <>
      <Head>
        <title>Newton Backward Interpolation | Netz</title>
        <meta name="description" content="Master Newton Backward Interpolation method with step-by-step explanations and examples." />
      </Head>

      <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
        <div className="md:ml-[80px]">
          <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Newton Backward Interpolation Method
              </h1>
              <ThemeToggle />
            </div>

            {/* Overview */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Newton Backward Interpolation is used to estimate the value of a function at a given point when the data points are tabulated at equal intervals. This method is particularly useful when you want to interpolate a value near the end of the data set. It utilizes backward differences to form the interpolation polynomial.
            </p>

            {/* Formula Callout */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Newton Backward Interpolation:</p>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
                <BlockMath math={formula} />
              </div>
              <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
                <p className="font-semibold">Where:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><InlineMath math="v = \frac{x - x_n}{h}" /></li>
                  <li><InlineMath math="x_n" /> is the last value of <InlineMath math="x" /> in the data.</li>
                  <li><InlineMath math="h" /> is the uniform difference between the <InlineMath math="x" /> values (where <InlineMath math="h = x_n - x_{n-1}" />).</li>
                  <li><InlineMath math="\Delta y_n, \Delta^2 y_n, \dots" /> are the backward differences.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-gray-300 dark:border-neutral-700" />

            {/* Example Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                Example of Newton Backward Interpolation
              </h2>

              <p className="text-lg text-gray-700 dark:text-gray-300">Let&apos;s say we are given the following data points:</p>

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

              <p className="text-lg text-gray-700 dark:text-gray-300">We are tasked with finding <InlineMath math="y" /> where <InlineMath math="x = 33" />.</p>

              {/* Step 1: Backward Difference Table */}
              <div className="space-y-3 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Calculate Backward Differences</h3>
                <div className="flex justify-center overflow-x-auto my-2">
                  <table className="w-full max-w-3xl border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-neutral-900">
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="x" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta y}" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta^2 y}" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta^3 y}" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta^4 y}" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.xxx}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.yyy}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.deltaY}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.delta2Y}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.delta3Y}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.delta4Y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Calculate v</h3>
                <p className="text-gray-700 dark:text-gray-300">Using the formula <InlineMath math="v = \frac{x - x_n}{h}" />:</p>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                  <BlockMath math={"\\text{Given } x = 33, x_n = 40, h = 4"} />
                  <BlockMath math="v = \frac{33 - 40}{4} = -1.75" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Apply Newton Backward Formula</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                  <BlockMath math={str} />
                </div>
              </div>

              {/* Conclusion Box */}
              <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Newton Backward Interpolation efficiently computes values near the bottom of tabulated datasets using backward difference tables.
                </p>
              </div>
            </div>

            {/* Calculator Component */}
            <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
              <NewtonBackwardInterpolations />
            </div>

            {/* Sequential Routing Navigation */}
            <AlgorithmNavigation />
          </section>
        </div>
      </FullscreenToggle>
    </>
  );
}