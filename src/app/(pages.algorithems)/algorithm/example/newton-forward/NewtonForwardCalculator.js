'use client';

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from '@/app/components/UnifiedPlot';
import { 
  EditorialButton, 
  EditorialExportButton, 
  EditorialStepViewer 
} from '@/app/components/editorial';
import { 
  FiPlus, 
  FiTrash2, 
  FiRotateCcw, 
  FiSliders, 
  FiTrendingUp,
  FiLayers,
  FiCheckCircle,
  FiZap,
  FiCrosshair,
  FiInfo
} from 'react-icons/fi';

export default function NewtonForwardCalculator({ theme }) {
  const [rows, setRows] = useState([
    { x: '1', y: '2' },
    { x: '2', y: '5' },
    { x: '3', y: '10' },
    { x: '4', y: '17' }
  ]);
  const [interpolateX, setInterpolateX] = useState('2.5');
  const [output, setOutput] = useState('');
  const [diffTable, setDiffTable] = useState([]);
  const [xValuesState, setXValuesState] = useState([]);
  const [vSteps, setVSteps] = useState([]);
  const [xRange, setXRange] = useState([]);
  const [copied, setCopied] = useState(false);
  const [viewFilter, setViewFilter] = useState('all'); // 'all' | 'table' | 'steps' | 'plot'
  const [interpolatedVal, setInterpolatedVal] = useState(null);
  const [vParam, setVParam] = useState(null);
  const [hStep, setHStep] = useState(null);
  
  const [polynomialSteps, setPolynomialSteps] = useState({
    formulas: [],
    substituted: [],
    calculated: [],
    final: ''
  });

  // Presets
  const applyPreset = (presetRows, target) => {
    setRows(presetRows);
    setInterpolateX(String(target));
    runInterpolation(presetRows, target);
  };

  // Row Manipulation
  const handleAddRow = () => {
    setRows([...rows, { x: '', y: '' }]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length <= 2) {
      const newRows = [...rows];
      newRows[index] = { x: '', y: '' };
      setRows(newRows);
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, type, value) => {
    const newRows = [...rows];
    newRows[index][type] = value;
    setRows(newRows);
  };

  const handleReset = () => {
    setRows([
      { x: '', y: '' },
      { x: '', y: '' }
    ]);
    setInterpolateX('');
    setOutput('');
    setDiffTable([]);
    setXValuesState([]);
    setVSteps([]);
    setXRange([]);
    setInterpolatedVal(null);
    setVParam(null);
    setHStep(null);
    setPolynomialSteps({
      formulas: [],
      substituted: [],
      calculated: [],
      final: ''
    });
  };

  // Run Calculation
  const runInterpolation = (currentRows, targetX) => {
    const validRows = currentRows.filter(r => r.x !== '' && r.y !== '' && !isNaN(Number(r.x)) && !isNaN(Number(r.y)));
    const xVals = validRows.map(r => parseFloat(r.x));
    const yVals = validRows.map(r => parseFloat(r.y));
    const x = parseFloat(targetX);

    if (xVals.length < 2 || yVals.length < 2) {
      setOutput('Please provide at least 2 valid numerical data points.');
      setInterpolatedVal(null);
      return;
    }

    if (isNaN(x)) {
      setOutput('Please specify a valid numeric target for x.');
      setInterpolatedVal(null);
      return;
    }

    const h0 = xVals[1] - xVals[0];
    let isEqualInterval = true;
    for (let i = 1; i < xVals.length - 1; i++) {
      if (Math.abs((xVals[i + 1] - xVals[i]) - h0) > 1e-5) {
        isEqualInterval = false;
        break;
      }
    }

    const points = xVals.map((xi, i) => ({ x: xi, y: yVals[i] }));
    const result = computeNewtonForward(points, x);

    const minX = Math.min(...xVals) - 2;
    const maxX = Math.max(...xVals) + 2;
    setXRange(Array.from({ length: 100 }, (_, i) => minX + i * (maxX - minX) / 99));

    setXValuesState(xVals);
    setVSteps(result.vSteps);
    setDiffTable(result.diffTable);
    setInterpolatedVal(result.interpolatedValue);
    setHStep(h0);
    setVParam(h0 !== 0 ? (x - xVals[0]) / h0 : 0);

    setPolynomialSteps({
      formulas: result.stepFormulas,
      substituted: result.stepSubstituted,
      calculated: result.stepCalculated,
      final: `P(${x}) = ${result.interpolatedValue.toFixed(5)}`
    });

    setOutput(`Interpolated value at x = ${x}: P(${x}) = ${result.interpolatedValue.toFixed(5)}${!isEqualInterval ? ' (Note: unequal intervals detected)' : ''}`);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    runInterpolation(rows, interpolateX);
  };

  const handleCopySummary = () => {
    if (interpolatedVal === null) return;
    const summaryText = `--- NEWTON FORWARD INTERPOLATION ---
Target x: ${interpolateX}
Interpolated P(${interpolateX}): ${interpolatedVal.toFixed(5)}
Base x0: ${xValuesState[0]} (y0 = ${rows[0]?.y})
Step Size (h): ${hStep?.toFixed(4)}
Parameter (v): ${vParam?.toFixed(4)}
Data Points: ${rows.map(r => `(${r.x}, ${r.y})`).join(', ')}
------------------------------------
Generated via Netz Algorithm Lab`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial calculation on mount
  React.useEffect(() => {
    runInterpolation(rows, interpolateX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="newton-forward-calculator-section" className="w-full space-y-8 font-sans">
      
      {/* Container with mellow neo-editorial border and subtle shadow */}
      <div className="border-2 border-black/80 dark:border-neutral-600 bg-[#FAF8F5] dark:bg-neutral-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.12)] p-6 md:p-8 relative">
        
        {/* Top Header Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/30 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-black px-3 py-1 uppercase tracking-widest rounded-lg">
              SIMULATOR & SOLVER
            </span>
            <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase">
              MODEL: P(x) = y₀ + vΔy₀ + v(v-1)/2! Δ²y₀ + ...
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EditorialButton
              onClick={handleCopySummary}
              disabled={interpolatedVal === null}
              variant="secondary"
              size="xs"
              tooltipText="Copy calculation summary to clipboard"
              icon={copied ? <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" /> : <FiLayers />}
            >
              {copied ? 'COPIED!' : 'COPY SUMMARY'}
            </EditorialButton>
            <EditorialExportButton
              targetId="newton-forward-calculator-section"
              fileName="newton-forward-report"
              label="EXPORT REPORT"
              size="xs"
              availableSections={[
                { id: 'newton-forward-calculator-section', label: 'Full Sheet (All)' },
                { id: 'diffTableExport', label: 'Difference Table' },
                { id: 'newton-forward-steps-container', label: 'Derivation Steps' },
                { id: 'newton-plot-container', label: 'Curve Chart' }
              ]}
              data={diffTable.length > 0 ? diffTable : rows}
            />
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="font-bold text-neutral-500 dark:text-neutral-400 uppercase mr-1 flex items-center gap-1"><FiZap className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:</span>
          <button
            onClick={() => applyPreset([
              { x: '1', y: '2' },
              { x: '2', y: '5' },
              { x: '3', y: '10' },
              { x: '4', y: '17' }
            ], 2.5)}
            className="px-2.5 py-1 border border-black/60 dark:border-neutral-700 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-black dark:text-amber-200 font-bold transition-colors cursor-pointer rounded-lg"
          >
            Quadratic (x² + 1, 4 pts)
          </button>
          <button
            onClick={() => applyPreset([
              { x: '10', y: '1.000' },
              { x: '20', y: '1.301' },
              { x: '30', y: '1.477' },
              { x: '40', y: '1.602' },
              { x: '50', y: '1.699' }
            ], 15)}
            className="px-2.5 py-1 border border-black/60 dark:border-neutral-700 bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 text-black dark:text-emerald-200 font-bold transition-colors cursor-pointer rounded-lg"
          >
            Logarithmic Scale (x=15)
          </button>
          <button
            onClick={() => applyPreset([
              { x: '0', y: '0' },
              { x: '30', y: '0.5' },
              { x: '60', y: '0.866' },
              { x: '90', y: '1.0' }
            ], 45)}
            className="px-2.5 py-1 border border-black/60 dark:border-neutral-700 bg-blue-100 dark:bg-blue-950/50 hover:bg-blue-200 text-black dark:text-blue-200 font-bold transition-colors cursor-pointer rounded-lg"
          >
            Trigonometric Sine (x=45°)
          </button>
          <button
            onClick={() => applyPreset([
              { x: '0', y: '100' },
              { x: '2', y: '80.4' },
              { x: '4', y: '61.6' },
              { x: '6', y: '43.6' },
              { x: '8', y: '26.4' }
            ], 3)}
            className="px-2.5 py-1 border border-black/60 dark:border-neutral-700 bg-purple-100 dark:bg-purple-950/50 hover:bg-purple-200 text-black dark:text-purple-200 font-bold transition-colors cursor-pointer rounded-lg"
          >
            Physics Trajectory (x=3s)
          </button>
        </div>

        {/* Main Grid: Left Controls & Right Displays */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Controls Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
              <span className="flex items-center gap-1.5 text-black dark:text-white">
                <FiSliders /> Tabulated Data Points
              </span>
              <span className="text-neutral-500">Equal Step (h)</span>
            </div>

            {/* Editable Data Rows Table */}
            <div className="border border-black/40 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-b border-black/20 dark:border-neutral-700 font-bold">
                  <tr>
                    <th className="py-2 px-3 text-left w-10">i</th>
                    <th className="py-2 px-3 text-left">x (Mesh Point)</th>
                    <th className="py-2 px-3 text-left">y = f(x)</th>
                    <th className="py-2 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-neutral-700">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                      <td className="py-2 px-3 text-neutral-500 font-bold">{idx}</td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          step="any"
                          placeholder="x"
                          value={row.x}
                          onChange={(e) => handleInputChange(idx, 'x', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                          required
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          step="any"
                          placeholder="y"
                          value={row.y}
                          onChange={(e) => handleInputChange(idx, 'y', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
                          required
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove Point"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Row Actions: Add Point & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1.5 border border-black/60 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 text-black dark:text-white flex items-center gap-1.5 rounded-lg shadow-xs cursor-pointer"
              >
                <FiPlus /> Add Point
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 rounded-lg cursor-pointer"
              >
                <FiRotateCcw /> Clear
              </button>
            </div>

            {/* Target Coordinate Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
                  <label htmlFor="target-x-input" className="flex items-center gap-1.5 text-black dark:text-white">
                    <FiCrosshair className="w-3.5 h-3.5 text-blue-500" /> Target Coordinate (x)
                  </label>
                <span className="text-neutral-500">Estimate at x</span>
              </div>
              <div className="relative">
                <input
                  id="target-x-input"
                  type="number"
                  step="any"
                  value={interpolateX}
                  onChange={(e) => setInterpolateX(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-3 py-2.5 border-2 border-black/70 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-mono font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <FiTrendingUp /> Calculate & Evaluate
            </button>

          </div>

          {/* Right Column: Result Display Banner (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* Primary Result Banner with Prominent Screentone Dots */}
            <div className="border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-35 editorial-dots-bg" />
              
              <div className="relative z-10">
                <span className="text-xs font-mono font-black uppercase tracking-widest text-neutral-500 block mb-1">
                  INTERPOLATED FUNCTIONAL VALUE
                </span>
                
                <div className="text-3xl md:text-5xl font-mono font-black text-black dark:text-white tracking-tight">
                  {interpolatedVal !== null ? (
                    <span>P({interpolateX}) = {interpolatedVal.toFixed(5)}</span>
                  ) : (
                    <span className="text-neutral-400">---</span>
                  )}
                </div>

                {output && (
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300 mt-2 font-medium">
                    {output}
                  </p>
                )}
              </div>

              {/* Parameter Chips */}
              {vParam !== null && hStep !== null && (
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-black/15 dark:border-neutral-700 text-xs font-mono relative z-10">
                  <div className="p-2 border border-black/30 dark:border-neutral-700 rounded-lg bg-[#FAF8F5] dark:bg-neutral-900">
                    <span className="text-neutral-500 block text-[10px]">STEP SIZE (h)</span>
                    <strong className="text-black dark:text-white font-bold">{hStep.toFixed(4)}</strong>
                  </div>
                  <div className="p-2 border border-black/30 dark:border-neutral-700 rounded-lg bg-[#FAF8F5] dark:bg-neutral-900">
                    <span className="text-neutral-500 block text-[10px]">BASE (x₀)</span>
                    <strong className="text-black dark:text-white font-bold">{xValuesState[0]}</strong>
                  </div>
                  <div className="p-2 border border-black/30 dark:border-neutral-700 rounded-lg bg-[#FAF8F5] dark:bg-neutral-900">
                    <span className="text-neutral-500 block text-[10px]">PARAMETER (v)</span>
                    <strong className="text-black dark:text-white font-bold">{vParam.toFixed(4)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Flow Hint */}
            <div className="p-4 border border-black/40 dark:border-neutral-700 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-xs font-mono space-y-1">
              <strong className="text-black dark:text-amber-200 flex items-center gap-1.5 font-bold uppercase">
                <FiInfo className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Operator Property:
              </strong>
              <p className="text-neutral-700 dark:text-neutral-300">
                Because target <InlineMath math={`x = ${interpolateX || '2.5'}`} /> is near the starting base point <InlineMath math={`x_0 = ${xValuesState[0] ?? 1}`} />, Newton Forward differences provide optimal accuracy and fast polynomial convergence.
              </p>
            </div>

          </div>

        </form>

      </div>

      {/* 2. SECTION TABS / SEQUENTIAL FLOW CONTROLLER */}
      {diffTable.length > 0 && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b-2 border-black/80 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase text-black dark:text-white">
                DETAILED RESULTS FLOW:
              </span>
            </div>

            {/* View Switcher Filter Tabs */}
            <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-800 p-1 rounded-xl border border-black/40 dark:border-neutral-700 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewFilter('all')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-lg ${
                  viewFilter === 'all' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
                }`}
              >
                All Sections
              </button>
              <button
                type="button"
                onClick={() => setViewFilter('table')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-lg ${
                  viewFilter === 'table' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
                }`}
              >
                1. Difference Table
              </button>
              <button
                type="button"
                onClick={() => setViewFilter('steps')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-lg ${
                  viewFilter === 'steps' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
                }`}
              >
                2. Derivation Steps
              </button>
              <button
                type="button"
                onClick={() => setViewFilter('plot')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-lg ${
                  viewFilter === 'plot' 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-black'
                }`}
              >
                3. Curve Plot
              </button>
            </div>
          </div>

          {/* SECTION 1: FORWARD DIFFERENCE TABLE */}
          <div 
            id="diffTableExport" 
            className={`border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-6 space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none ${
              viewFilter === 'all' || viewFilter === 'table' ? 'block' : 'hidden'
            }`}
          >
            <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-black/20 dark:border-neutral-700">
              <div>
                <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase mr-2">
                  SECTION 01
                </span>
                <span className="font-mono font-bold text-sm text-black dark:text-white">
                  COMPLETE FORWARD DIFFERENCE MATRIX (Δ)
                </span>
              </div>
              <EditorialExportButton
                targetId="diffTableExport"
                fileName="difference-table"
                label="Export Table"
                variant="outline"
                size="xs"
              />
            </div>

            <div className="overflow-x-auto custom-notion-scrollbar rounded-xl border border-black/30 dark:border-neutral-700">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-neutral-200 dark:bg-neutral-900 text-black dark:text-white border-b border-black/30 dark:border-neutral-700 font-bold">
                    <th className="p-3 border-r border-black/20 dark:border-neutral-700">x</th>
                    <th className="p-3 border-r border-black/20 dark:border-neutral-700">y</th>
                    {Array.from({ length: diffTable.length - 1 }).map((_, i) => (
                      <th key={i} className="p-3 border-r border-black/20 dark:border-neutral-700">
                        Δ<sup>{i + 1}</sup>y
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diffTable.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx === 0 ? 'bg-[#FFE600]/40 dark:bg-amber-950/50 font-bold' : 'hover:bg-neutral-50 dark:hover:bg-neutral-850'}
                    >
                      <td className="p-3 border-r border-t border-black/15 dark:border-neutral-700 text-black dark:text-white font-bold">
                        {xValuesState[rIdx]}
                      </td>
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-3 border-r border-t border-black/15 dark:border-neutral-700 ${
                            rIdx === 0 ? 'text-black dark:text-amber-300 font-bold' : ''
                          }`}
                        >
                          {val !== undefined ? (
                            rIdx < diffTable.length - cIdx ? val.toFixed(4) : ''
                          ) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
              * The highlighted top row represents our primary forward difference vector: <InlineMath math="y_0, \Delta y_0, \Delta^2 y_0, \dots" />
            </p>
          </div>

          {/* SECTION 2: STEP-BY-STEP DERIVATION VIEWER */}
          <div className={viewFilter === 'all' || viewFilter === 'steps' ? 'block' : 'hidden'}>
            <EditorialStepViewer
              title="Step 2: Newton-Gregory Polynomial Expansion & Term Evaluation"
              vSteps={vSteps}
              formulas={polynomialSteps.formulas}
              substituted={polynomialSteps.substituted}
              calculated={polynomialSteps.calculated}
              finalAnswer={polynomialSteps.final}
              id="newton-forward-steps-container"
            />
          </div>

          {/* SECTION 3: INTERACTIVE CURVE PLOT */}
          <div 
            id="newton-plot-container" 
            className={`border-2 border-black/80 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 p-6 space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-none ${
              viewFilter === 'all' || viewFilter === 'plot' ? 'block' : 'hidden'
            }`}
          >
            <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-black/20 dark:border-neutral-700">
              <div>
                <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase mr-2">
                  SECTION 03
                </span>
                <span className="font-mono font-bold text-sm text-black dark:text-white">
                  VISUAL INTERPOLATION POLYNOMIAL CURVE
                </span>
              </div>
              <EditorialExportButton
                targetId="newton-plot-container"
                fileName="interpolation-graph"
                label="Export Graph"
                variant="outline"
                size="xs"
              />
            </div>

            <div className="p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl min-h-[350px]">
              <Plot
                points={rows.filter(r => r.x !== '' && r.y !== '').map(r => ({ x: parseFloat(r.x), y: parseFloat(r.y) }))}
                xRange={xRange}
                darkTheme={theme}
                func={computeNewtonForward}
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

// Complete Newton Forward Interpolation Algorithm Engine
function computeNewtonForward(points, x) {
  const tr = [
    `y_{0}`,
    `\\frac{v}{1!} \\Delta^{1} y_{0}`,
    `\\frac{v(v-1)}{2!} \\Delta^{2} y_{0}`,
    `\\frac{v(v-1)(v-2)}{3!} \\Delta^{3} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)}{4!} \\Delta^{4} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)}{5!} \\Delta^{5} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)(v-5)}{6!} \\Delta^{6} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)(v-5)(v-6)}{7!} \\Delta^{7} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)(v-5)(v-6)(v-7)}{8!} \\Delta^{8} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)(v-5)(v-6)(v-7)(v-8)}{9!} \\Delta^{9} y_{0}`,
    `\\frac{v(v-1)(v-2)(v-3)(v-4)(v-5)(v-6)(v-7)(v-8)(v-9)}{10!} \\Delta^{10} y_{0}`
  ];

  const n = points.length;
  const xi = points.map((p) => p.x);
  const yi = points.map((p) => p.y);

  // Initialize difference table (n x n)
  const diffTable = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    diffTable[i][0] = yi[i];
  }

  // Compute forward differences
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      diffTable[i][j] = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
    }
  }

  // Calculate interval size h and normalized coordinate v
  const h = (xi[1] !== undefined && xi[0] !== undefined) ? (xi[1] - xi[0]) : 1;
  const v = h !== 0 ? (x - xi[0]) / h : 0;

  let interpolatedValue = yi[0] || 0;
  let uProduct = 1;
  let factorial = 1;

  let stepFormulas = [`P(x) = ${tr[0]}`];
  let stepSubstituted = [`${yi[0]}`];
  let stepCalculated = [`${yi[0]}`];

  let vSteps = [
    `h = x_1 - x_0 = ${h.toFixed(4)}`,
    `v = \\frac{x - x_0}{h} = \\frac{${x} - ${xi[0]}}{${h.toFixed(4)}} = ${v.toFixed(4)}`
  ];

  for (let i = 1; i < n; i++) {
    uProduct *= (v - (i - 1));
    factorial *= i;

    const deltaY0 = diffTable[0][i] || 0;
    const term = (uProduct * deltaY0) / factorial;
    interpolatedValue += term;

    stepFormulas.push(`${tr[i] || `\\text{Term } ${i}`}`);

    let factorStr = `${v.toFixed(4)}`;
    for (let k = 1; k < i; k++) {
      factorStr += `(${v.toFixed(4)} - ${k})`;
    }

    stepSubstituted.push(
      `\\frac{${factorStr} \\cdot (${deltaY0.toFixed(4)})}{${i}!}`
    );
    stepCalculated.push(`${term.toFixed(4)}`);
  }

  return {
    interpolatedValue,
    diffTable,
    stepFormulas,
    stepSubstituted,
    stepCalculated,
    vSteps,
  };
}
