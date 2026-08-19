'use client';

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { FiTrendingUp, FiDollarSign, FiPercent, FiCalendar, FiPieChart, FiDownload, FiRotateCcw, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { EditorialButton, EditorialExportButton } from '@/app/components/editorial';

export default function CompoundInterestCalculator() {
  // Calculator inputs
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [compoundingFreq, setCompoundingFreq] = useState(4); // 4 = Quarterly
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'schedule' | 'comparison'
  const [copied, setCopied] = useState(false);

  // Compounding frequency options
  const frequencies = [
    { label: 'Annually (1x/yr)', value: 1, name: 'Annual' },
    { label: 'Semi-Annually (2x/yr)', value: 2, name: 'Semi-Annual' },
    { label: 'Quarterly (4x/yr)', value: 4, name: 'Quarterly' },
    { label: 'Monthly (12x/yr)', value: 12, name: 'Monthly' },
    { label: 'Daily (365x/yr)', value: 365, name: 'Daily' },
    { label: 'Continuous (eʳᵗ)', value: 0, name: 'Continuous' },
  ];

  // Presets
  const applyPreset = (p, r, y, f, m) => {
    setPrincipal(p);
    setRate(r);
    setYears(y);
    setCompoundingFreq(f);
    setMonthlyContribution(m);
  };

  // Perform Calculations
  const calculations = useMemo(() => {
    const P = Math.max(0, Number(principal) || 0);
    const r = Math.max(0, Number(rate) || 0) / 100;
    const t = Math.max(0.1, Number(years) || 1);
    const PMT = Math.max(0, Number(monthlyContribution) || 0);
    const n = compoundingFreq;

    let finalAmount = 0;
    let totalInvestedPrincipal = P + (PMT * 12 * t);
    let totalInterest = 0;
    let apy = 0;

    // Simple Interest baseline comparison
    const simpleInterestTotal = P * (1 + r * t) + (PMT * 12 * t);
    const simpleInterestEarned = P * r * t;

    // Compounding schedule generation
    const yearlySchedule = [];

    if (n === 0) {
      // Continuous compounding: A = P * e^(rt)
      apy = (Math.exp(r) - 1) * 100;
      let currentBal = P;
      for (let y = 1; y <= Math.ceil(t); y++) {
        const timeElapsed = Math.min(y, t);
        const pContribution = PMT * 12 * timeElapsed;
        // Approximation with continuous cash flows for PMT: PMT * 12 * (e^(rt) - 1) / r
        const pmtFutureVal = r > 0 ? (PMT * 12 * (Math.exp(r * timeElapsed) - 1)) / r : (PMT * 12 * timeElapsed);
        const balAtYear = P * Math.exp(r * timeElapsed) + pmtFutureVal;
        const totalInvestedSoFar = P + pContribution;
        const interestSoFar = balAtYear - totalInvestedSoFar;

        yearlySchedule.push({
          year: y,
          principalPaid: totalInvestedSoFar,
          interestEarned: interestSoFar,
          balance: balAtYear,
        });
      }
      finalAmount = yearlySchedule[yearlySchedule.length - 1]?.balance || P;
    } else {
      // Standard discrete compounding
      // APY = (1 + r/n)^n - 1
      apy = (Math.pow(1 + r / n, n) - 1) * 100;

      let currentBal = P;
      for (let y = 1; y <= Math.ceil(t); y++) {
        const timeElapsed = Math.min(y, t);
        // Principal compound part: P * (1 + r/n)^(n*t)
        const principalCompound = P * Math.pow(1 + r / n, n * timeElapsed);
        
        // Future value of a series of monthly deposits compounded n times per year
        // We simulate monthly compounding/interest accumulation step by step for accuracy
        let pmtFutureVal = 0;
        if (PMT > 0 && r > 0) {
          const monthlyRate = r / 12;
          const totalMonths = Math.round(timeElapsed * 12);
          pmtFutureVal = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        } else if (PMT > 0) {
          pmtFutureVal = PMT * 12 * timeElapsed;
        }

        const balAtYear = principalCompound + pmtFutureVal;
        const totalInvestedSoFar = P + (PMT * 12 * timeElapsed);
        const interestSoFar = Math.max(0, balAtYear - totalInvestedSoFar);

        yearlySchedule.push({
          year: y,
          principalPaid: totalInvestedSoFar,
          interestEarned: interestSoFar,
          balance: balAtYear,
        });
      }
      finalAmount = yearlySchedule[yearlySchedule.length - 1]?.balance || P;
    }

    totalInterest = Math.max(0, finalAmount - totalInvestedPrincipal);
    const compoundBonus = Math.max(0, totalInterest - simpleInterestEarned);
    const growthRatio = totalInvestedPrincipal > 0 ? (finalAmount / totalInvestedPrincipal).toFixed(2) : 1;

    return {
      finalAmount,
      totalInvestedPrincipal,
      totalInterest,
      apy,
      simpleInterestEarned,
      compoundBonus,
      growthRatio,
      yearlySchedule,
    };
  }, [principal, rate, years, compoundingFreq, monthlyContribution]);

  const handleCopySummary = () => {
    const summaryText = `--- COMPOUND INTEREST BREAKDOWN ---
Principal: $${principal.toLocaleString()}
Annual Rate: ${rate}%
Time: ${years} years
Compounding: ${frequencies.find(f => f.value === compoundingFreq)?.label}
Monthly Contribution: $${monthlyContribution}
------------------------------------
Total Invested: $${calculations.totalInvestedPrincipal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
Total Interest: $${calculations.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
Final Balance: $${calculations.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
Effective APY: ${calculations.apy.toFixed(2)}%
Generated via Netz Algorithm Lab`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="compound-interest-calculator" className="w-full space-y-8 font-sans">
      {/* Container with crisp neo-brutalist border and graph paper background */}
      <div className="border-2 border-black dark:border-neutral-600 bg-[#FAF8F5] dark:bg-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] rounded-none p-6 md:p-8 relative">
        
        {/* Top Header Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-black dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-black px-3 py-1 uppercase tracking-widest">
              SIMULATOR & SOLVER
            </span>
            <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase">
              MODEL: A = P(1 + r/n)^(nt)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EditorialButton
              onClick={handleCopySummary}
              variant="secondary"
              size="xs"
              tooltipText="Copy calculation breakdown to clipboard"
              icon={copied ? <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" /> : <FiLayers />}
            >
              {copied ? 'COPIED!' : 'COPY SUMMARY'}
            </EditorialButton>
            <EditorialExportButton
              targetId="compound-interest-calculator"
              fileName="compound-interest-report"
              label="EXPORT REPORT"
              size="xs"
              availableSections={[
                { id: 'compound-interest-calculator', label: 'Full Financial Sheet' },
                { id: 'schedule-table-container', label: 'Amortization Schedule' },
                { id: 'interest-summary-card', label: 'Yield Breakdown Card' }
              ]}
              data={calculations?.schedule || []}
            />
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-bold text-neutral-500 dark:text-neutral-400 uppercase mr-1">⚡ Quick Presets:</span>
          <button
            onClick={() => applyPreset(10000, 7.5, 5, 4, 100)}
            className="px-2.5 py-1 border border-black dark:border-neutral-700 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-black dark:text-amber-200 font-bold transition-colors"
          >
            Modest Growth ($10k @ 7.5%, 5y)
          </button>
          <button
            onClick={() => applyPreset(25000, 9.2, 10, 12, 250)}
            className="px-2.5 py-1 border border-black dark:border-neutral-700 bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 text-black dark:text-emerald-200 font-bold transition-colors"
          >
            Index Fund Wealth ($25k @ 9.2%, 10y)
          </button>
          <button
            onClick={() => applyPreset(5000, 5.0, 3, 365, 50)}
            className="px-2.5 py-1 border border-black dark:border-neutral-700 bg-blue-100 dark:bg-blue-950/50 hover:bg-blue-200 text-black dark:text-blue-200 font-bold transition-colors"
          >
            High-Yield Daily ($5k @ 5.0%, 3y)
          </button>
          <button
            onClick={() => applyPreset(1000, 12.0, 5, 0, 0)}
            className="px-2.5 py-1 border border-black dark:border-neutral-700 bg-purple-100 dark:bg-purple-950/50 hover:bg-purple-200 text-black dark:text-purple-200 font-bold transition-colors"
          >
            Continuous Compounding ($1k @ 12%)
          </button>
        </div>

        {/* Main Grid: Left Controls & Right High-Contrast Displays */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Controls Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input: Principal */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
                <label htmlFor="principal-input" className="flex items-center gap-1 text-black dark:text-white">
                  <FiDollarSign /> Initial Principal (P)
                </label>
                <span className="text-neutral-500">${Number(principal).toLocaleString()}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-neutral-400">$</span>
                <input
                  id="principal-input"
                  type="number"
                  min="0"
                  step="500"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2.5 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none"
                />
              </div>
            </div>

            {/* Input: Annual Interest Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
                <label htmlFor="rate-input" className="flex items-center gap-1 text-black dark:text-white">
                  <FiPercent /> Annual Interest Rate (r)
                </label>
                <span className="text-neutral-500">{rate}% p.a.</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="30"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  className="w-full accent-black dark:accent-white cursor-pointer h-2 bg-neutral-300 dark:bg-neutral-700 rounded-none"
                />
                <input
                  id="rate-input"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2.5 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold text-black dark:text-white text-center focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none"
                />
              </div>
            </div>

            {/* Input: Investment Time (Years) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
                <label htmlFor="years-input" className="flex items-center gap-1 text-black dark:text-white">
                  <FiCalendar /> Time Horizon (t in Years)
                </label>
                <span className="text-neutral-500">{years} {years === 1 ? 'Year' : 'Years'}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                  className="w-full accent-black dark:accent-white cursor-pointer h-2 bg-neutral-300 dark:bg-neutral-700 rounded-none"
                />
                <input
                  id="years-input"
                  type="number"
                  min="1"
                  max="100"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-2.5 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold text-black dark:text-white text-center focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none"
                />
              </div>
            </div>

            {/* Input: Compounding Frequency */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase text-black dark:text-white">
                Compounding Frequency (n)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setCompoundingFreq(freq.value)}
                    className={`py-2 px-3 text-xs font-mono font-bold border-2 border-black dark:border-neutral-700 transition-all text-left truncate ${
                      compoundingFreq === freq.value
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none'
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {freq.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input: Optional Monthly Contribution */}
            <div className="space-y-1.5 pt-2 border-t border-dashed border-neutral-300 dark:border-neutral-700">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
                <label htmlFor="monthly-contribution" className="text-black dark:text-white">
                  Monthly Contribution (PMT)
                </label>
                <span className="text-neutral-500">${monthlyContribution}/mo</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-neutral-400">$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  min="0"
                  step="50"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => applyPreset(10000, 7.5, 5, 4, 0)}
              className="w-full py-2.5 border-2 border-black dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <FiRotateCcw /> Reset Default Values
            </button>
          </div>

          {/* Result Displays & Oatly Dotted Screentone Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Result Card with Dotted Screentone Fill */}
            <div className="border-2 border-black dark:border-neutral-600 p-6 relative overflow-hidden bg-[#FAF8F5] dark:bg-neutral-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
              
              {/* Halftone Dot Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)',
                  backgroundSize: '8px 8px'
                }}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-mono font-extrabold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                      ESTIMATED FUTURE ACCUMULATED VALUE (A)
                    </p>
                    <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mt-1">
                      ${calculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <span className="bg-emerald-400 dark:bg-emerald-600 text-black dark:text-white text-xs font-mono font-black px-2.5 py-1 border-2 border-black dark:border-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {calculations.growthRatio}x Growth
                  </span>
                </div>

                {/* Sub-KPI Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-black dark:border-neutral-700">
                  
                  <div className="bg-white dark:bg-neutral-800 p-3 border-2 border-black dark:border-neutral-700">
                    <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">Total Principal</span>
                    <span className="text-lg font-mono font-black text-black dark:text-white">
                      ${calculations.totalInvestedPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 border-2 border-black dark:border-emerald-600">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-400 block">Interest Earned</span>
                    <span className="text-lg font-mono font-black text-emerald-700 dark:text-emerald-300">
                      +${calculations.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-3 border-2 border-black dark:border-neutral-700 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">Effective APY</span>
                    <span className="text-lg font-mono font-black text-purple-600 dark:text-purple-400">
                      {calculations.apy.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Visual Ratio Proportion Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span className="text-black dark:text-white">
                      Principal: {((calculations.totalInvestedPrincipal / Math.max(1, calculations.finalAmount)) * 100).toFixed(0)}%
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Interest: {((calculations.totalInterest / Math.max(1, calculations.finalAmount)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-4 border-2 border-black dark:border-neutral-600 bg-black dark:bg-neutral-700 flex overflow-hidden">
                    <div 
                      className="bg-neutral-400 dark:bg-neutral-500 h-full transition-all duration-500" 
                      style={{ width: `${(calculations.totalInvestedPrincipal / Math.max(1, calculations.finalAmount)) * 100}%` }}
                      title="Principal"
                    />
                    <div 
                      className="bg-emerald-500 dark:bg-emerald-400 h-full transition-all duration-500" 
                      style={{ width: `${(calculations.totalInterest / Math.max(1, calculations.finalAmount)) * 100}%` }}
                      title="Compound Interest"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* View Switcher Tabs: Summary vs Annual Schedule */}
            <div className="space-y-4">
              <div className="flex border-2 border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    activeTab === 'summary'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Growth Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Annual Schedule ({calculations.yearlySchedule.length} Yrs)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    activeTab === 'comparison'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Compounding Edge
                </button>
              </div>

              {/* Tab 1: Growth Summary */}
              {activeTab === 'summary' && (
                <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500">Compounding Multiplier:</span>
                    <span className="font-bold">{(calculations.finalAmount / Math.max(1, principal)).toFixed(3)}× on initial capital</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500">Nominal Interest Rate (APR):</span>
                    <span className="font-bold">{rate}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500">Effective Annual Rate (EAR / APY):</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{calculations.apy.toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500">Simple Interest Comparison:</span>
                    <span className="font-bold text-neutral-600">${(principal + calculations.simpleInterestEarned).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Compound Interest Advantage:</span>
                    <span>+${calculations.compoundBonus.toLocaleString(undefined, { maximumFractionDigits: 0 })} extra return</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Annual Schedule Table */}
              {activeTab === 'schedule' && (
                <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-x-auto max-h-72 custom-notion-scrollbar">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead className="bg-black text-white dark:bg-neutral-900 sticky top-0">
                      <tr>
                        <th className="p-2.5 border-b border-neutral-600">Year</th>
                        <th className="p-2.5 border-b border-neutral-600">Invested</th>
                        <th className="p-2.5 border-b border-neutral-600">Interest</th>
                        <th className="p-2.5 border-b border-neutral-600 text-right">Total Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {calculations.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                          <td className="p-2.5 font-bold">Yr {row.year}</td>
                          <td className="p-2.5 text-neutral-600 dark:text-neutral-300">${Math.round(row.principalPaid).toLocaleString()}</td>
                          <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+${Math.round(row.interestEarned).toLocaleString()}</td>
                          <td className="p-2.5 font-bold text-right text-black dark:text-white">${Math.round(row.balance).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Compounding Edge */}
              {activeTab === 'comparison' && (
                <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-black dark:text-white uppercase">The Exponential Effect of Compounding:</p>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans text-sm">
                      Unlike simple interest where interest is calculated strictly on the original principal, compound interest allows you to earn <em>interest on your interest</em>.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="border border-black dark:border-neutral-600 p-3 bg-neutral-50 dark:bg-neutral-900">
                      <span className="text-[11px] font-bold block text-neutral-500">Simple Interest Total:</span>
                      <span className="text-base font-bold text-neutral-700 dark:text-neutral-300">
                        ${(principal + calculations.simpleInterestEarned).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="border border-black dark:border-neutral-600 p-3 bg-emerald-50 dark:bg-emerald-950/40">
                      <span className="text-[11px] font-bold block text-emerald-700 dark:text-emerald-400">Compound Total:</span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-300">
                        ${calculations.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
