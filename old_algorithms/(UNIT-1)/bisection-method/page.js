'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import BisectionMethod from './algorithems.bisection-method';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';

export default function BisectionMethods() {
  return (
    <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
      <div className="md:ml-[80px]">
        <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Bisection Method
            </h1>
            <ThemeToggle />
          </div>

          {/* Overview */}
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The bisection method is a straightforward and reliable numerical technique used to find roots (solutions) of continuous functions. It works by repeatedly dividing an interval in half and selecting the subinterval where the function changes sign, thereby narrowing down the location of the root.
          </p>

          {/* Given a function */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Given a function:</p>
            <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center">
              <BlockMath math={`f(x) = 0`} />
            </div>
          </div>

          {/* How the Bisection Method Works */}
          <div className="pt-4 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              How the Bisection Method Works
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700 dark:text-gray-300 pl-2">
              <li className="leading-relaxed">
                <strong>Select Interval:</strong> Choose two points <InlineMath math={`a`} /> and <InlineMath math={`b`} /> such that <InlineMath math={`f(a)`} /> and <InlineMath math={`f(b)`} /> have opposite signs.
              </li>
              <li className="leading-relaxed">
                <strong>Midpoint Calculation:</strong> Compute the midpoint <InlineMath math="C = \frac{a + b}{2}" />.
              </li>
              <li className="leading-relaxed">
                <strong>Evaluate:</strong> Check the sign of <InlineMath math={`f(c)`} />.
              </li>
              <li className="leading-relaxed">
                <strong>Update Interval:</strong> If <InlineMath math={`f(c)`} /> is close enough to zero, <InlineMath math={`c`} /> is the root. Otherwise, update the interval.
              </li>
            </ol>
          </div>

          <hr className="my-8 border-gray-300 dark:border-neutral-700" />

          {/* Example Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
              Example
            </h2>

            <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Given Function</p>
              <BlockMath math={`x^2 = 4`} />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Error Margin is 0.01</p>
            </div>

            {/* Step 1 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Rearranging the Equation</h3>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math={"f(x) = x^2 - 4 = 0"} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Choose Initial Points</h3>
              <p className="text-gray-700 dark:text-gray-300">To apply the Bisection Method, we first need to choose two initial points <InlineMath math="a" /> and <InlineMath math="b" /> such that:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="f(a) \text{ and } f(b) \text{ have opposite signs.}" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Let&apos;s choose <InlineMath math="a = 0 \text{ and } b = 3" />:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                <BlockMath math="f(0) = 0^2 - 4 = -4 \text{ (negative)}" />
                <BlockMath math="f(3) = 3^2 - 4 = 5 \text{ (positive)}" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Since <InlineMath math="f(0) < 0 \text{ and } f(3) > 0," /> we can proceed.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Calculate Midpoint</h3>
              <p className="text-gray-700 dark:text-gray-300">Next, we calculate the midpoint <InlineMath math={`C`} /> of the interval [ a , b ] :</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="C = \frac{a + b}{2} = \frac{0 + 3}{2} = 1.5" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 4: Update the Interval</h3>
              <p className="text-gray-700 dark:text-gray-300">Since <InlineMath math="f(a) < 0 \text{ and } f(C) < 0," /> we know that the root must lie in the interval [ C , b ] :</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="\text{Set } a = C = 1.5" />
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-3 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 5: Repeat the Process</h3>
              <p className="text-gray-700 dark:text-gray-300">We repeat the steps:</p>
              <ol className="list-decimal list-inside space-y-3 font-semibold text-gray-800 dark:text-gray-200 pl-2">
                <li>
                  Calculate new midpoint:
                  <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm font-normal mt-1 text-center">
                    <BlockMath math="C = \frac{1.5 + 3}{2} = 2.25" />
                  </div>
                </li>
                <li>
                  Evaluate function:
                  <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm font-normal mt-1 text-center">
                    <BlockMath math="f(2.25) = (2.25)^2 - 4 = 5.0625 - 4 = 1.0625" />
                  </div>
                </li>
                <li>
                  Update interval:
                  <div className="font-normal text-gray-700 dark:text-gray-300 mt-1">
                    <p>Since <InlineMath math="f(1.5) < 0 \text{ and } f(2.25) > 0" /> set <InlineMath math="b = C = 2.25" /></p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Step 6 */}
            <div className="space-y-3 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 6: Continuing the Process</h3>
              <p className="text-gray-700 dark:text-gray-300">Continuing this process, we narrow down the interval:</p>
              <ol className="list-decimal list-inside space-y-3 font-semibold text-gray-800 dark:text-gray-200 pl-2">
                <li>
                  Calculate new midpoint:
                  <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm font-normal mt-1 text-center">
                    <BlockMath math="C = \frac{1.5 + 2.25}{2} = 1.875" />
                  </div>
                </li>
                <li>
                  Evaluate function:
                  <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm font-normal mt-1 text-center">
                    <BlockMath math="f(1.875) = (1.875)^2 - 4 = 3.515625 - 4 = -0.484375" />
                  </div>
                </li>
                <li>
                  Update interval:
                  <div className="font-normal text-gray-700 dark:text-gray-300 mt-1">
                    <p>Since <InlineMath math="f(1.875) < 0 \text{ and } f(2.25) > 0," /> set <InlineMath math="a = 2.25" /></p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Accuracy */}
            <div className="space-y-2 py-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Continue until Desired Accuracy</h3>
              <p className="text-gray-700 dark:text-gray-300">Continue this process until the difference between <InlineMath math="a" /> and <InlineMath math="b" /> is less than a desired tolerance (for example, 0.01).</p>
              <p className="text-gray-700 dark:text-gray-300">Eventually, you will converge on the root:</p>
              <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                <BlockMath math="\sqrt{4} = 2" />
              </div>
            </div>

            {/* Conclusion Box */}
            <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                The Bisection Method is an efficient way to find the root of a function defined by a continuous equation. In this case, we demonstrated it for <InlineMath math={`x^2 = 4`} />&nbsp;
                and found that the root is <InlineMath math={`x = 2`} />.&nbsp;
                The method guarantees convergence as long as you start with points that bracket the root, making it a reliable technique for root-finding problems.
              </p>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="pt-8 border-t border-gray-300 dark:border-neutral-700">
            <BisectionMethod />
          </div>

          {/* Sequential Routing Navigation */}
          <AlgorithmNavigation />
        </section>
      </div>
    </FullscreenToggle>
  );
}
