'use client';

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import ThemeToggle from "../../../../components/ThemeToggle";
import FullscreenToggle from "@/app/components/FullscreenToggle";
import NewtonsDividedDifference from "./algorithems.newton-s-divided-difference-interpolations";

export default function NewtonsDividedDifferences() {
  const formula = `f(x)=y_0+(x-x_0)f[x_0,x_1]+(x-x_0)(x-x_1)f[x_0,x_1,x_2]+(x-x_0)(x-x_1)(x-x_2)f[x_0,x_1,x_2,x_3]`;

  const data = [
    { x: 0, y: 1, deltaY: `\\frac{3-1}{1-0}=2`, delta2Y: `\\frac{23-2}{3-0}=7`, delta3Y: `\\frac{19-7}{4-0}=3`, delta4Y: `\\frac{3-3}{7-0}=0` },
    { x: 1, y: 3, deltaY: `\\frac{49-3}{3-1}=23`, delta2Y: `\\frac{80-23}{4-1}=19`, delta3Y: `\\frac{37-19}{7-1}=3`, delta4Y: '' },
    { x: 3, y: 49, deltaY: `\\frac{129-49}{4-3}=80`, delta2Y: `\\frac{228-80}{7-3}=37`, delta3Y: '', delta4Y: '' },
    { x: 4, y: 129, deltaY: `\\frac{813-129}{7-4}=228`, delta2Y: '', delta3Y: '', delta4Y: '' },
    { x: 7, y: 813, deltaY: '', delta2Y: '', delta3Y: '', delta4Y: '' },
  ];

  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Newton&apos;s Divided Difference Interpolation Method
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Newton&apos;s Divided Difference formula is used for polynomial interpolation. It provides a way to construct a polynomial that passes through a given set of points. The formula is particularly useful when the data points are not equally spaced.
          </p>

          {/* Formula Callout */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Newton&apos;s Divided Difference:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={formula} />
            </div>
            <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
              <p className="font-semibold">Where:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><InlineMath math="f(x)" /> is the interpolating polynomial.</li>
                <li><InlineMath math="y_0" /> is the initial value corresponding to <InlineMath math="x_0" />.</li>
                <li><InlineMath math="f[x_0,x_1,\dots,x_n]" /> are the divided differences.</li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example of Newton&apos;s Divided Difference Interpolation
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300">Given the following data points:</p>

            {/* Data Table */}
            <div className="flex justify-center overflow-x-auto my-4">
              <table className="w-full max-w-md border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-neutral-900">
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-900 dark:text-white"><InlineMath math="x" /></th>
                    <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center text-gray-900 dark:text-white"><InlineMath math="y = f(x_0)" /></th>
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

            <p className="text-lg text-gray-700 dark:text-gray-300">We are tasked with finding <InlineMath math="f(x)" /> where <InlineMath math="x = 0.3" />.</p>

            {/* Step 1: Divided Differences Table */}
            <div className="space-y-3 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Calculate Divided Differences</h3>
              <div className="flex justify-center overflow-x-auto my-2">
                <table className="w-full max-w-4xl border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-neutral-900">
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="x" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="y=f(x_0)" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="1^{\text{st}} \text{ order}" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="2^{\text{nd}} \text{ order}" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="3^{\text{rd}} \text{ order}" /></th>
                      <th className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math="4^{\text{th}} \text{ order}" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'}>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.x}</td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center">{row.y}</td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math={row.deltaY} /></td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math={row.delta2Y} /></td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math={row.delta3Y} /></td>
                        <td className="border border-gray-200 dark:border-neutral-700 px-3 py-2 text-center"><InlineMath math={row.delta4Y} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 2 & 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2 & 3: Substitute Values into Formula</h3>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center overflow-x-auto">
                <BlockMath math={`f(0.3) = 1 + (0.3-0)(2) + (0.3)(0.3-1)(7) + (0.3)(0.3-1)(0.3-3)(3) + 0`} />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <BlockMath math="P(0.3) \approx 1.831" />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Thus, the interpolated value of <InlineMath math="f(x)" /> at <InlineMath math="x = 0.3" /> is approximately <InlineMath math="1.831" />.
              </p>
            </div>
          </div>

          {/* Calculator Component */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <NewtonsDividedDifference />
          </div>

        </section>
      </div>
    </FullscreenToggle>
  );
}
