'use client';

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import Head from 'next/head';
import ThemeToggle from "../../../../components/ThemeToggle";
import FullscreenToggle from "@/app/components/FullscreenToggle";
import GaussBackwardInterpolation from "./algorithems.gauss-backward-interpolations";

export default function GaussBackwardInterpolations() {
  const formula = `
    P = y_0 + p \\Delta y_{-1} + \\frac{(p+1)p}{2!} \\cdot \\Delta^2 y_{-1} + \\frac{(p+1)p(p-1)}{3!} \\cdot \\Delta^3 y_{-2} 
    + \\frac{(p+2)(p+1)p(p-1)}{4!} \\cdot \\Delta^4 y_{-2} + \\cdots
  `;

  const data = [
    { x: 1931, p: -20, y: 15, deltaY: '', delta2Y: '', delta3Y: '', delta4Y: '' },
    { x: 1941, p: -10, y: 20, deltaY: 5, delta2Y: 2, delta3Y: '', delta4Y: '' },
    { x: 1951, p: 0, y: 27, deltaY: 7, delta2Y: 5, delta3Y: 3, delta4Y: 7 },
    { x: 1961, p: 10, y: 39, deltaY: 12, delta2Y: 1, delta3Y: -4, delta4Y: '' },
    { x: 1971, p: 20, y: 52, deltaY: 13, delta2Y: '', delta3Y: '', delta4Y: '' },
  ];

  return (
    <>
      <Head>
        <title>Gauss Backward Interpolation | Netz</title>
        <meta name="description" content="Master Gauss Backward Interpolation method with step-by-step explanations." />
      </Head>

      <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
        <div className="md:ml-[80px]">
          <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Gauss Backward Interpolation Method
              </h1>
              <ThemeToggle />
            </div>

            {/* Overview */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Gauss Backward Interpolation is used to interpolate a value close to the middle or end of the data set. The method uses backward central differences to create an interpolation polynomial.
            </p>

            {/* Formula Callout */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Gauss Backward Interpolation:</p>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
                <BlockMath math={formula} />
              </div>
              <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
                <p className="font-semibold">Where:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><InlineMath math="y_p" /> is the interpolated value at <InlineMath math="x_p" /></li>
                  <li><InlineMath math="y_0" /> is the initial value corresponding to <InlineMath math="x_0" /></li>
                  <li><InlineMath math="\Delta^n y" /> are the backward differences of the function values.</li>
                  <li><InlineMath math="p = \frac{x-x_0}{h}" />, where <InlineMath math="h" /> is the uniform difference between <InlineMath math="x" /> values.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-gray-300 dark:border-neutral-700" />

            {/* Example Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                Example of Gauss Backward Interpolation
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
                        <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.x}</td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center">{row.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300">We are tasked with finding <InlineMath math="y_p" /> where <InlineMath math="x = 1946" />.</p>

              {/* Step 1 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Choose Initial Point</h3>
                <p className="text-gray-700 dark:text-gray-300">Take the point closest to <InlineMath math="x" /> as <InlineMath math="x_0 = 1951" />, with <InlineMath math="h = 10" />.</p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Calculate p</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                  <BlockMath math="p = \frac{1946 - 1951}{10} = -0.5" />
                </div>
              </div>

              {/* Step 3: Difference Table */}
              <div className="space-y-3 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Calculate Central Differences</h3>
                <div className="flex justify-center overflow-x-auto my-2">
                  <table className="w-full max-w-4xl border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-neutral-900">
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="x" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="p" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="\Delta y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="\Delta^2 y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="\Delta^3 y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="\Delta^4 y" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.x}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.p}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.y}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.deltaY}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.delta2Y}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.delta3Y}</td>
                          <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.delta4Y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 4 & 5 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4 & 5: Substitute into Formula</h3>
                <div className="w-full md:w-[80%] mx-auto p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center overflow-x-auto">
                  <BlockMath
                    math={`P(1946) = 27 + (-0.5) \\cdot 7 + \\frac{(-0.5+1)(-0.5)}{2!} \\cdot 5 + \\frac{(-0.5+1)(-0.5)(-0.5-1)}{3!} \\cdot 3`}
                  />
                </div>
              </div>

              {/* Conclusion Box */}
              <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
                <BlockMath math="P(1946) \approx 22.8984" />
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Thus, the interpolated value of <InlineMath math="y" /> at <InlineMath math="x = 1946" /> is approximately <InlineMath math="22.8984" />.
                </p>
              </div>
            </div>

            {/* Calculator Component */}
            <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
              <GaussBackwardInterpolation />
            </div>
          </section>
        </div>
      </FullscreenToggle>
    </>
  );
}
