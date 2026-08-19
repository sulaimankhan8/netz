'use client';

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import { EditorialThemeToggle, EditorialButton, EditorialSidebar } from '@/app/components/editorial';
import CompoundInterestCalculator from './CompoundInterestCalculator';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiBookOpen, FiActivity, FiHelpCircle } from 'react-icons/fi';

export default function CompoundInterestPage() {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  return (
    <FullscreenToggle className="w-full min-h-screen">
      {/* Modern Editorial Example Sidebar */}
      <EditorialSidebar />

      {/* 
        Oatly-Inspired Graph-Paper Backdrop:
        Checkered grid lines with dark-mode responsive grid
      */}
      <div className="w-full min-h-screen bg-[#FAF8F5] dark:bg-[#111111] text-black dark:text-white transition-colors editorial-grid-bg">
        <div className="md:ml-[72px] lg:ml-[72px] transition-all">
          <section className="container mx-auto px-4 md:px-8 py-10 space-y-10 max-w-6xl">
            
            {/* Top Bar / Navigation Tag & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-black dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white dark:bg-white dark:text-black font-mono font-black text-xs px-3 py-1 uppercase tracking-wider">
                  ALGORITHM LAB
                </span>
                
                {/* Switcher Pill Tabs */}
                <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-1 rounded-none border border-black dark:border-neutral-700 text-xs font-mono">
                  <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-bold">
                    Compound Interest
                  </span>
                  <Link
                    href="/algorithm/example/newton-forward"
                    className="px-3 py-1 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Newton Forward
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <EditorialThemeToggle />
              </div>
            </div>

            {/* Hero Header in Raw Neo-Brutalist & Oatly Editorial Type */}
            <div className="space-y-4 pt-2">
              <div className="inline-block border-2 border-black dark:border-white bg-[#FFE600] dark:bg-[#FFE600] text-black px-3 py-0.5 text-xs font-mono font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                NUMERICAL & FINANCIAL ALGORITHM
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-black dark:text-white">
                Compound Interest <br />
                <span className="underline decoration-4 underline-offset-8 decoration-black dark:decoration-white">Algorithm & Formula</span>
              </h1>

              <p className="text-lg md:text-xl font-medium text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
                Compound interest is the mathematical algorithm where interest is earned not only on the initial principal balance, but also on the accumulated interest from prior periods — creating an exponential curve of wealth or debt growth.
              </p>
            </div>

            {/* Core Mathematical Formula Box (With Halftone Screentone Fill) */}
            <div className="border-2 border-black dark:border-neutral-600 bg-[#FAF8F5] dark:bg-neutral-900 p-6 md:p-8 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              
              {/* Halftone / Dotted Pattern Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 editorial-dots-bg" />

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center border-b-2 border-black dark:border-neutral-700 pb-3">
                  <span className="font-mono font-extrabold text-xs uppercase tracking-widest text-black dark:text-white">
                    PRIMARY GOVERNING EQUATION
                  </span>
                  <span className="bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs px-2 py-0.5 uppercase">
                    STANDARD DISCRETE MODEL
                  </span>
                </div>

                <div className="py-4 text-center overflow-x-auto">
                  <BlockMath math={`A = P \\left(1 + \\frac{r}{n}\\right)^{n \\cdot t}`} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <strong className="text-black dark:text-white block font-bold">A</strong>
                    <span className="text-neutral-600 dark:text-neutral-400">Final Accrued Amount</span>
                  </div>
                  <div className="p-2 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <strong className="text-black dark:text-white block font-bold">P</strong>
                    <span className="text-neutral-600 dark:text-neutral-400">Initial Principal Sum</span>
                  </div>
                  <div className="p-2 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <strong className="text-black dark:text-white block font-bold">r</strong>
                    <span className="text-neutral-600 dark:text-neutral-400">Annual Nominal Rate (decimal)</span>
                  </div>
                  <div className="p-2 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <strong className="text-black dark:text-white block font-bold">n, t</strong>
                    <span className="text-neutral-600 dark:text-neutral-400">Freq per yr & Time (yrs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works & Key Algorithmic Variants */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight pb-2 border-b-2 border-black dark:border-neutral-700">
                Mathematical Foundations & Special Cases
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="border-2 border-black dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-3">
                  <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                    CASE 01: NET INTEREST
                  </span>
                  <h3 className="font-bold text-lg text-black dark:text-white">Compound Interest Only (CI)</h3>
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    To extract only the profit/yield earned without the initial capital:
                  </p>
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-neutral-700 text-center">
                    <BlockMath math={`CI = A - P`} />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="border-2 border-black dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-3">
                  <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                    CASE 02: CONTINUOUS LIMIT
                  </span>
                  <h3 className="font-bold text-lg text-black dark:text-white">Continuous Compounding (<InlineMath math={`n \\to \\infty`} />)</h3>
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    As compounding frequency approaches infinity, Euler&apos;s constant <InlineMath math={`e`} /> emerges:
                  </p>
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-neutral-700 text-center">
                    <BlockMath math={`A = P \\cdot e^{r \\cdot t}`} />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="border-2 border-black dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-3">
                  <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                    CASE 03: EFFECTIVE YIELD
                  </span>
                  <h3 className="font-bold text-lg text-black dark:text-white">Effective Annual Rate (APY)</h3>
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    The true annual percentage return factoring intra-year compounding:
                  </p>
                  <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-neutral-700 text-center">
                    <BlockMath math={`\\text{APY} = \\left(1 + \\frac{r}{n}\\right)^n - 1`} />
                  </div>
                </div>

              </div>
            </div>

            {/* Detailed Step-by-Step Worked Example (Oatly Style) */}
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b-2 border-black dark:border-neutral-700">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  Step-by-Step Worked Example
                </h2>
                <span className="text-xs font-mono font-bold bg-neutral-200 dark:bg-neutral-800 px-3 py-1 border border-black dark:border-neutral-600">
                  PRACTICAL SCENARIO
                </span>
              </div>

              {/* Problem Prompt Card */}
              <div className="border-2 border-black dark:border-neutral-600 p-5 bg-emerald-50 dark:bg-emerald-950/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[10px] font-mono font-black px-2 py-0.5 uppercase">
                    PROBLEM STATEMENT
                  </span>
                </div>
                <p className="text-base md:text-lg font-semibold text-emerald-950 dark:text-emerald-200">
                  Suppose an investor deposits <InlineMath math={`P = \\$10,000`} /> into a bond yielding an annual interest rate of <InlineMath math={`r = 8\\%`} /> (0.08) compounded quarterly (<InlineMath math={`n = 4`} />) for a duration of <InlineMath math={`t = 5`} /> years. Determine the final balance <InlineMath math={`A`} /> and the total interest earned <InlineMath math={`CI`} />.
                </p>
              </div>

              {/* Step 1 */}
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                  <span>STEP 01</span> • <span>PARAMETER IDENTIFICATION</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Identify all variables from the problem specification:
                </p>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-neutral-700 font-mono text-xs overflow-x-auto text-center">
                  <BlockMath math={`P = 10000, \\quad r = 0.08, \\quad n = 4, \\quad t = 5`} />
                </div>
              </div>

              {/* Step 2 */}
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                  <span>STEP 02</span> • <span>PERIODIC INTEREST RATE CALCULATION</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Compute the interest rate applied to each quarterly compounding cycle (<InlineMath math={`r / n`} />):
                </p>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-neutral-700 font-mono text-xs overflow-x-auto text-center">
                  <BlockMath math={`\\frac{r}{n} = \\frac{0.08}{4} = 0.02 \\quad (2\\% \\text{ per quarter})`} />
                </div>
              </div>

              {/* Step 3 */}
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                  <span>STEP 03</span> • <span>TOTAL COMPOUNDING PERIODS</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Calculate the total number of compounding intervals over 5 years (<InlineMath math={`n \\cdot t`} />):
                </p>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-neutral-700 font-mono text-xs overflow-x-auto text-center">
                  <BlockMath math={`n \\cdot t = 4 \\times 5 = 20 \\text{ quarters}`} />
                </div>
              </div>

              {/* Step 4 */}
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                  <span>STEP 04</span> • <span>EVALUATE ACCUMULATED AMOUNT (A)</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Substitute the values into the compounding formula:
                </p>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-neutral-700 font-mono text-xs overflow-x-auto text-center space-y-2">
                  <BlockMath math={`A = 10000 \\cdot (1 + 0.02)^{20}`} />
                  <BlockMath math={`A = 10000 \\cdot (1.02)^{20} \\approx 10000 \\cdot 1.485947 = \\$14,859.47`} />
                </div>
              </div>

              {/* Step 5 */}
              <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                  <span>STEP 05</span> • <span>CALCULATE NET INTEREST EARNED</span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Subtract the starting principal from the final accumulated balance:
                </p>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-neutral-700 font-mono text-xs overflow-x-auto text-center">
                  <BlockMath math={`CI = A - P = 14859.47 - 10000 = \\$4,859.47`} />
                </div>
              </div>

              {/* Summary Conclusion Box with Oatly Dotted Screentone */}
              <div className="border-2 border-black dark:border-neutral-600 p-6 relative overflow-hidden bg-[#FAF8F5] dark:bg-neutral-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
                <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 editorial-dots-bg" />
                <div className="relative z-10 space-y-2">
                  <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                    CONCLUSION SUMMARY
                  </span>
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    48.59% Total Return Over 5 Years
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                    By compounding quarterly instead of receiving simple interest, the investor earns an extra <InlineMath math={`\\$859.47`} /> over the baseline simple interest return of <InlineMath math={`\\$4,000`} />. The effective annual rate (APY) is <InlineMath math={`(1.02)^4 - 1 = 8.243\\%`} />.
                  </p>
                </div>
              </div>

            </div>

            {/* Interactive Calculator Section */}
            <div className="pt-8 border-t-2 border-black dark:border-neutral-700 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="inline-block border border-black dark:border-neutral-600 bg-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 text-xs font-mono font-bold uppercase mb-1">
                    LABORATORY
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    Interactive Live Calculator & Visualizer
                  </h2>
                </div>
              </div>

              {/* Live Calculator Component */}
              <CompoundInterestCalculator />
            </div>

            {/* Navigation & Exploration Bar */}
            <div className="pt-6 border-t-2 border-black dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-neutral-500 block">Direct Access Route</span>
                  <span className="text-sm font-mono font-black text-black dark:text-white">/algorithm/example</span>
                </div>
                <Link
                  href="/bisection-method"
                  className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Explore Unit 1 Algorithms <FiArrowRight />
                </Link>
              </div>
            </div>

          </section>
        </div>
      </div>
    </FullscreenToggle>
  );
}
