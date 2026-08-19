'use client';

import React from 'react';
import Head from 'next/head';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import { EditorialThemeToggle, EditorialSidebar } from '@/app/components/editorial';
import NewtonForwardCalculator from './NewtonForwardCalculator';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function NewtonForwardExamplePage() {
  const exampleData = [
    { x: 1, y: 2, d1: 3, d2: 2, d3: 0 },
    { x: 2, y: 5, d1: 5, d2: 2, d3: '-' },
    { x: 3, y: 10, d1: 7, d2: '-', d3: '-' },
    { x: 4, y: 17, d1: '-', d2: '-', d3: '-' },
  ];

  const formula = `
    P(x) = y_0 + v \\cdot \\Delta y_0 + \\frac{v(v-1)}{2!} \\cdot \\Delta^2 y_0 
    + \\frac{v(v-1)(v-2)}{3!} \\cdot \\Delta^3 y_0 
    + \\cdots + \\frac{v(v-1)\\cdots(v-n+1)}{n!} \\cdot \\Delta^n y_0
  `;

  return (
    <>
      <Head>
        <title>Newton Forward Interpolation | Algorithm Lab | Netz</title>
        <meta name="description" content="Neo-editorial interactive calculator and step-by-step laboratory for Newton Forward Interpolation." />
      </Head>

      <FullscreenToggle className="w-full min-h-screen">
        {/* Modern Editorial Example Sidebar */}
        <EditorialSidebar />

        {/* 
          Oatly-Inspired Graph-Paper Backdrop:
          Warm paper cream tone (#FAF8F5) and dark mode graph grid (#111111)
        */}
        <div className="w-full min-h-screen bg-[#FAF8F5] dark:bg-[#111111] text-black dark:text-white transition-colors editorial-grid-bg">
          <div className="md:ml-[72px] lg:ml-[72px] transition-all">
            <section className="container mx-auto px-4 md:px-8 py-10 space-y-10 max-w-6xl">
              
              {/* Top Bar / Navigation Tag & Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-black/80 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white dark:bg-white dark:text-black font-mono font-black text-xs px-3 py-1 uppercase tracking-wider rounded-lg">
                    ALGORITHM LAB
                  </span>
                  
                  {/* Switcher Pill Tabs */}
                  <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-800 p-1 rounded-xl border border-black/60 dark:border-neutral-700 text-xs font-mono">
                    <Link
                      href="/algorithm/example"
                      className="px-3 py-1 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors rounded-lg"
                    >
                      Compound Interest
                    </Link>
                    <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg">
                      Newton Forward
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <EditorialThemeToggle />
                </div>
              </div>

              {/* Hero Header in Raw Neo-Brutalist & Oatly Editorial Type (PRESERVED AS REQUESTED) */}
              <div className="space-y-4 pt-2">
                <div className="inline-block border-2 border-black dark:border-white bg-[#FFE600] text-black px-3 py-0.5 text-xs font-mono font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-md">
                  UNIT 2 • EQUAL INTERVAL POLYNOMIAL INTERPOLATION
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-black dark:text-white">
                  Newton Forward <br />
                  <span className="underline decoration-4 underline-offset-8 decoration-black dark:decoration-white">Interpolation Algorithm</span>
                </h1>

                <p className="text-lg md:text-xl font-medium text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
                  Newton Forward Interpolation is an analytic technique designed to estimate unknown functional values <InlineMath math="y = f(x)" /> near the <em>beginning</em> of an equally spaced set of tabulated points, utilizing higher-order forward finite difference operators <InlineMath math="\Delta^k y_0" />.
                </p>
              </div>

              {/* Core Mathematical Formula Box (Sweet Spot Rounded-2xl with Visible Halftone Screentone) */}
              <div className="border-2 border-black/80 dark:border-neutral-600 bg-[#FAF8F5] dark:bg-neutral-900 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.12)]">
                
                {/* Visible Halftone Ben-Day Dot Matrix Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-35 dark:opacity-40 editorial-dots-bg" />

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center border-b border-black/30 dark:border-neutral-700 pb-3">
                    <span className="font-mono font-extrabold text-xs uppercase tracking-widest text-black dark:text-white">
                      PRIMARY GOVERNING EQUATION
                    </span>
                    <span className="bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs px-2.5 py-0.5 rounded-md uppercase">
                      NEWTON-GREGORY MODEL
                    </span>
                  </div>

                  <div className="py-4 text-center overflow-x-auto">
                    <BlockMath math={formula} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                    <div className="p-3 border border-black/40 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 shadow-xs">
                      <strong className="text-black dark:text-white block font-bold">1. Coordinate Parameter (v)</strong>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        <InlineMath math="v = \frac{x - x_0}{h}" /> (fraction of step from initial base <InlineMath math="x_0" />)
                      </span>
                    </div>
                    <div className="p-3 border border-black/40 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 shadow-xs">
                      <strong className="text-black dark:text-white block font-bold">2. Equal Step Width (h)</strong>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        <InlineMath math="h = x_{i+1} - x_i" /> (uniform mesh step)
                      </span>
                    </div>
                    <div className="p-3 border border-black/40 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 shadow-xs">
                      <strong className="text-black dark:text-white block font-bold">3. Forward Differences (Δ)</strong>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        <InlineMath math="\Delta y_0 = y_1 - y_0, \; \Delta^2 y_0 = \Delta y_1 - \Delta y_0" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works & Key Algorithmic Foundations (Sweet Spot 3-Card Grid) */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight pb-2 border-b-2 border-black/80 dark:border-neutral-700">
                  Mathematical Foundations & Operators
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1 */}
                  <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl p-5 bg-white dark:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-3">
                    <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      CASE 01: FORWARD OPERATOR (Δ)
                    </span>
                    <h3 className="font-bold text-lg text-black dark:text-white">Finite Differences Matrix</h3>
                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      The forward difference of order <InlineMath math="k" /> is defined recursively across tabulated nodes:
                    </p>
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
                      <BlockMath math={`\\Delta^k y_i = \\Delta^{k-1} y_{i+1} - \\Delta^{k-1} y_i`} />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl p-5 bg-white dark:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-3">
                    <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      CASE 02: BINOMIAL EXPANSION
                    </span>
                    <h3 className="font-bold text-lg text-black dark:text-white">Fractional Binomial Coefficient</h3>
                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      Generalizes the binomial coefficient <InlineMath math="\binom{v}{k}" /> to non-integer step parameters <InlineMath math="v" />:
                    </p>
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
                      <BlockMath math={`\\binom{v}{k} = \\frac{v(v-1)(v-2)\\cdots(v-k+1)}{k!}`} />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl p-5 bg-white dark:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-3">
                    <span className="bg-black text-white dark:bg-neutral-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      CASE 03: TRUNCATION ERROR
                    </span>
                    <h3 className="font-bold text-lg text-black dark:text-white">Remainder & Stability Bound</h3>
                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                      The theoretical interpolation error remainder for an <InlineMath math="n" />-degree polynomial:
                    </p>
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
                      <BlockMath math={`R_n(x) = \\frac{v(v-1)\\cdots(v-n)}{(n+1)!} h^{n+1} f^{(n+1)}(\\xi)`} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Detailed Step-by-Step Worked Example (Sweet Spot Mellow Curves) */}
              <div className="space-y-6">
                
                <div className="flex justify-between items-center pb-2 border-b-2 border-black/80 dark:border-neutral-700">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    Step-by-Step Worked Example
                  </h2>
                  <span className="text-xs font-mono font-bold bg-neutral-200 dark:bg-neutral-800 px-3 py-1 rounded-lg border border-black/40 dark:border-neutral-600">
                    PRACTICAL SCENARIO
                  </span>
                </div>

                {/* Problem Statement Card */}
                <div className="border-2 border-black/80 dark:border-neutral-600 rounded-2xl p-5 bg-emerald-50 dark:bg-emerald-950/40 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md uppercase">
                      PROBLEM STATEMENT
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-emerald-950 dark:text-emerald-200">
                    Given the equally-spaced discrete dataset below with uniform mesh step <InlineMath math="h = 1" />, compute the estimated functional value <InlineMath math="y = f(x)" /> at target coordinate <InlineMath math="x = 2.5" />.
                  </p>
                </div>

                {/* Step 1: Forward Difference Matrix Table */}
                <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                    <span>STEP 01</span> • <span>CONSTRUCT FORWARD DIFFERENCE TABLE</span>
                  </div>
                  
                  <div className="overflow-x-auto custom-notion-scrollbar rounded-xl border border-black/30 dark:border-neutral-700">
                    <table className="w-full text-center text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-neutral-200 dark:bg-neutral-900 text-black dark:text-white border-b border-black/30 dark:border-neutral-700 font-bold">
                          <th className="p-2.5 border-r border-black/20 dark:border-neutral-700"><InlineMath math="x" /></th>
                          <th className="p-2.5 border-r border-black/20 dark:border-neutral-700"><InlineMath math="y" /></th>
                          <th className="p-2.5 border-r border-black/20 dark:border-neutral-700"><InlineMath math="\Delta y" /></th>
                          <th className="p-2.5 border-r border-black/20 dark:border-neutral-700"><InlineMath math="\Delta^2 y" /></th>
                          <th className="p-2.5"><InlineMath math="\Delta^3 y" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {exampleData.map((row, idx) => (
                          <tr 
                            key={idx} 
                            className={idx === 0 ? 'bg-[#FFE600]/40 dark:bg-amber-950/50 font-bold' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'}
                          >
                            <td className="p-2.5 border-r border-t border-black/15 dark:border-neutral-700">{row.x}</td>
                            <td className="p-2.5 border-r border-t border-black/15 dark:border-neutral-700">{row.y}</td>
                            <td className="p-2.5 border-r border-t border-black/15 dark:border-neutral-700">{row.d1}</td>
                            <td className="p-2.5 border-r border-t border-black/15 dark:border-neutral-700">{row.d2}</td>
                            <td className="p-2.5 border-t border-black/15 dark:border-neutral-700">{row.d3}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    * The top leading diagonal (highlighted in yellow) yields: <InlineMath math="y_0 = 2" />, <InlineMath math="\Delta y_0 = 3" />, <InlineMath math="\Delta^2 y_0 = 2" />, and <InlineMath math="\Delta^3 y_0 = 0" />.
                  </p>
                </div>

                {/* Step 2: Calculate parameter v */}
                <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                    <span>STEP 02</span> • <span>CALCULATE NORMALIZED PARAMETER (v)</span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Using target <InlineMath math="x = 2.5" />, base <InlineMath math="x_0 = 1" />, and uniform step <InlineMath math="h = 2 - 1 = 1" />:
                  </p>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-xs overflow-x-auto text-center">
                    <BlockMath math="v = \frac{x - x_0}{h} = \frac{2.5 - 1}{1} = 1.5" />
                  </div>
                </div>

                {/* Step 3: Polynomial Expansion & Evaluation */}
                <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-neutral-500">
                    <span>STEP 03</span> • <span>EVALUATE POLYNOMIAL EXPANSION TERMS</span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Substitute the difference coefficients and <InlineMath math="v = 1.5" /> into the formula:
                  </p>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-xs overflow-x-auto text-center space-y-2">
                    <BlockMath math={`P(2.5) = 2 + 1.5(3) + \\frac{1.5(1.5-1)}{2!}(2) + \\frac{1.5(1.5-1)(1.5-2)}{3!}(0)`} />
                    <BlockMath math={`P(2.5) = 2 + 4.5 + \\frac{1.5 \\times 0.5}{2}(2) + 0`} />
                    <BlockMath math={`P(2.5) = 2 + 4.5 + 0.75 + 0 = 7.25`} />
                  </div>
                </div>

                {/* Summary Conclusion Box with Visible Halftone Screentone */}
                <div className="border-2 border-black/80 dark:border-neutral-600 rounded-2xl p-6 relative overflow-hidden bg-[#FAF8F5] dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none">
                  <div className="absolute inset-0 pointer-events-none opacity-35 dark:opacity-40 editorial-dots-bg" />
                  <div className="relative z-10 space-y-2">
                    <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase">
                      CONCLUSION SUMMARY
                    </span>
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      Interpolated Value: P(2.5) = 7.25
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                      The Newton Forward Interpolation algorithm evaluates to exactly <strong>7.25</strong>. Because 2.5 is near the top of the range ([1, 4]), the forward difference formula provides optimal numerical stability and rapid convergence with zero residual error for this quadratic dataset.
                    </p>
                  </div>
                </div>

              </div>

              {/* Interactive Calculator Section */}
              <div className="pt-8 border-t-2 border-black/80 dark:border-neutral-700 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="inline-block border border-black/60 dark:border-neutral-600 bg-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 text-xs font-mono font-bold rounded-md uppercase mb-1">
                      LABORATORY
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                      Interactive Live Calculator & Visualizer
                    </h2>
                  </div>
                </div>

                {/* Calculator Engine */}
                <NewtonForwardCalculator />
              </div>

              {/* Navigation & Exploration Bar */}
              <div className="pt-6 border-t-2 border-black/80 dark:border-neutral-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-neutral-500 block">Direct Access Route</span>
                    <span className="text-sm font-mono font-black text-black dark:text-white">/algorithm/example/newton-forward</span>
                  </div>
                  <Link
                    href="/newton-backward"
                    className="px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Next: Newton Backward Formula <FiArrowRight />
                  </Link>
                </div>
              </div>

            </section>
          </div>
        </div>
      </FullscreenToggle>
    </>
  );
}
