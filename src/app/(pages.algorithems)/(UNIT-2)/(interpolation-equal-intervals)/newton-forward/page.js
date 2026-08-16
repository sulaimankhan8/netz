'use client';
import Head from 'next/head';
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import NewtonForwardInterpolations from "./algorithems.newton-forward-interpolations";
import FullscreenToggle from "@/app/components/FullscreenToggle";
import ThemeToggle from '@/app/components/ThemeToggle';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function NewtonForwardInterpolation() {
  const str = `P(x) = y_0 + v \\cdot \\Delta y_0 + \\frac{v(v-1)}{2!} \\cdot \\Delta^2 y_{0} + \\frac{v(v-1)(v-2)}{3!} \\cdot \\Delta^3 y_0`;
  const data = [
    { xxx: 1, yyy: 2, deltaY: 3, delta2Y: 2, delta3Y: 0 },
    { xxx: 2, yyy: 5, deltaY: 5, delta2Y: 2, delta3Y: '' },
    { xxx: 3, yyy: 10, deltaY: 7, delta2Y: '', delta3Y: '' },
    { xxx: 4, yyy: 17, deltaY: '', delta2Y: '', delta3Y: '' },
  ];

  const formula = `
    P(x) = y_0 + v \\cdot \\Delta y_0 + \\frac{v(v-1)}{2!} \\cdot \\Delta^2 y_0 
    + \\frac{v(v-1)(v-2)}{3!} \\cdot \\Delta^3 y_0 
    + \\frac{v(v-1)(v-2)(v-3)}{4!} \\cdot \\Delta^4 y_0 + \\cdots
  `;

  return (
    <>
      <Head>
        <title>Newton Forward Interpolation | Netz</title>
        <meta name="description" content="Explore Newton Forward Interpolation on Netz with comprehensive examples." />
      </Head>

      <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
        <div className="md:ml-[80px]">
          <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Newton Forward Interpolation Method
              </h1>
              <ThemeToggle />
            </div>

            {/* Overview */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Newton Forward Interpolation is used to estimate the value of a function at a given point when the data points are tabulated at equal intervals. This method is particularly useful when you want to interpolate a value near the beginning of the data set. It utilizes forward differences to form the interpolation polynomial.
            </p>

            {/* Formula Callout */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Formula for Newton Forward Interpolation:</p>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
                <BlockMath math={formula} />
              </div>
              <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300 pl-4">
                <p className="font-semibold">Where:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><InlineMath math="v = \frac{x - x_0}{h}" /></li>
                  <li><InlineMath math="x_0" /> is the first value of <InlineMath math="x" /> in the data.</li>
                  <li><InlineMath math="h" /> is the uniform difference between the <InlineMath math="x" /> values (where <InlineMath math="h = x_1 - x_0" />).</li>
                  <li><InlineMath math="\Delta y_0, \Delta^2 y_0, \dots" /> are the forward differences.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-gray-300 dark:border-neutral-700" />

            {/* Example Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                Example of Newton Forward Interpolation
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

              <p className="text-lg text-gray-700 dark:text-gray-300">We are tasked with finding <InlineMath math="y" /> where <InlineMath math="x = 2.5" />.</p>

              {/* Step 1: Forward Difference Table */}
              <div className="space-y-3 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Calculate Forward Differences</h3>
                <div className="flex justify-center overflow-x-auto my-2">
                  <table className="w-full max-w-2xl border-collapse border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-neutral-900">
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="x" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="y" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta y}" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta^2 y}" /></th>
                        <th className="border border-gray-200 dark:border-neutral-700 px-4 py-2 text-center"><InlineMath math="{\Delta^3 y}" /></th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Calculate v</h3>
                <p className="text-gray-700 dark:text-gray-300">Using the formula <InlineMath math="v = \frac{x - x_0}{h}" />:</p>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                  <BlockMath math={"\\text{Given } x = 2.5, x_0 = 1, h = 1"} />
                  <BlockMath math="v = \frac{2.5 - 1}{1} = 1.5" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Apply the Formula</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                  <BlockMath math={str} />
                  <BlockMath math={`P(2.5) = 2 + 1.5 \\cdot 3 + \\frac{1.5(1.5-1)}{2!} \\cdot 2 + \\frac{1.5(1.5-1)(1.5-2)}{3!} \\cdot (0)`} />
                </div>
              </div>

              {/* Step-by-step Evaluation */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step-by-step Term Evaluation:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center space-y-2">
                  <BlockMath math={`\\text{First term = } 2`} />
                  <BlockMath math={`\\text{Second term: } 1.5 \\cdot 3 = 4.5`} />
                  <BlockMath math={`\\text{Third term: } \\frac{1.5(0.5)}{2} \\cdot 2 = 0.75`} />
                  <BlockMath math={`\\text{Fourth term: } 0`} />
                </div>
              </div>

              {/* Conclusion Box */}
              <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
                <BlockMath math={'P(2.5) = 2 + 4.5 + 0.75 + 0 = 7.25'} />
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Therefore, using Newton Forward Interpolation, the estimated value of <InlineMath math="y" /> at <InlineMath math="x = 2.5" /> is <strong>7.25</strong>.
                </p>
              </div>
            </div>

            {/* Interactive Calculator Section */}
            <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
              <NewtonForwardInterpolations />
            </div>

            {/* Sequential Routing Navigation */}
            <AlgorithmNavigation />
          </section>
        </div>
      </FullscreenToggle>
    </>
  );
}
