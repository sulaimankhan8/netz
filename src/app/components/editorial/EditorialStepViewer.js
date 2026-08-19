'use client';

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { FiCopy, FiCheck, FiCode, FiLayers } from 'react-icons/fi';
import EditorialButton from './EditorialButton';
import EditorialExportButton from './EditorialExportButton';

/**
 * EditorialStepViewer: Modern, responsive step-by-step mathematical derivation viewer.
 */
export default function EditorialStepViewer({
  title = 'Polynomial Expansion Steps',
  vSteps = [],
  formulas = [],
  substituted = [],
  calculated = [],
  finalAnswer = '',
  id = 'step-viewer-container',
  showExport = true,
}) {
  const [inlineMode, setInlineMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySteps = () => {
    let text = `=== ${title.toUpperCase()} ===\n\n`;
    if (vSteps.length > 0) {
      text += `[Parameter Derivation]:\n${vSteps.join('\n')}\n\n`;
    }
    if (formulas.length > 0) {
      text += `[General Formula]:\n${formulas.join(' + ')}\n\n`;
    }
    if (substituted.length > 0) {
      text += `[Substituted Values]:\n${substituted.join(' + ')}\n\n`;
    }
    if (calculated.length > 0) {
      text += `[Evaluated Terms]:\n${calculated.join(' + ')}\n\n`;
    }
    if (finalAnswer) {
      text += `[Final Result]:\n${finalAnswer}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = formulas.length > 0 || vSteps.length > 0 || finalAnswer;
  if (!hasContent) return null;

  return (
    <div
      id={id}
      className="border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 backdrop-blur-sm p-5 md:p-7 space-y-6 shadow-sm relative overflow-hidden"
    >
      {/* Subtle Halftone Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-15 editorial-dots-bg" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-sm md:text-base font-mono font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
            {title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <EditorialButton
            onClick={() => setInlineMode(!inlineMode)}
            variant="outline"
            size="xs"
            tooltipText="Switch math layout format"
            icon={<FiCode className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />}
          >
            {inlineMode ? 'Inline Mode' : 'Block Mode'}
          </EditorialButton>

          {/* Copy Button */}
          <EditorialButton
            onClick={handleCopySteps}
            variant="secondary"
            size="xs"
            tooltipText="Copy all steps to clipboard"
            icon={copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiCopy className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />}
          >
            {copied ? 'Copied Steps' : 'Copy Steps'}
          </EditorialButton>

          {/* Export PNG */}
          {showExport && (
            <EditorialExportButton
              targetId={id}
              fileName="derivation-steps.png"
              label="Save PNG"
              size="xs"
              variant="outline"
            />
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="relative z-10 space-y-4">
        
        {/* Step A: Parameter Calculation */}
        {vSteps.length > 0 && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-700 dark:text-neutral-200 uppercase">
                Step 1: Coordinate Parameter (v)
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Step interval & mesh ratio</span>
            </div>
            <div className="space-y-1 py-1 text-neutral-900 dark:text-neutral-100">
              {vSteps.map((step, i) => (
                <div key={i} className="overflow-x-auto text-center py-1">
                  <BlockMath math={step} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step B: General Formula */}
        {formulas.length > 0 && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-700 dark:text-neutral-200 uppercase">
                Step 2: General Symbolic Formula
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Polynomial expansion</span>
            </div>
            <div className="overflow-x-auto text-center py-2 text-neutral-900 dark:text-neutral-100">
              {inlineMode ? (
                <InlineMath math={formulas.join(' + \\displaystyle ')} />
              ) : (
                <BlockMath math={formulas.join(' + ')} />
              )}
            </div>
          </div>
        )}

        {/* Step C: Substituted Values */}
        {substituted.length > 0 && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-700 dark:text-neutral-200 uppercase">
                Step 3: Substituted Differences & Coefficients
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Numerical substitution</span>
            </div>
            <div className="overflow-x-auto text-center py-2 text-neutral-900 dark:text-neutral-100">
              {inlineMode ? (
                <InlineMath math={substituted.join(' + \\displaystyle ')} />
              ) : (
                <BlockMath math={substituted.join(' + ')} />
              )}
            </div>
          </div>
        )}

        {/* Step D: Evaluated Numerical Terms */}
        {calculated.length > 0 && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-neutral-700 dark:text-neutral-200 uppercase">
                Step 4: Evaluated Term Components
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Arithmetic sum</span>
            </div>
            <div className="overflow-x-auto text-center py-2 font-mono font-bold text-blue-600 dark:text-blue-400">
              <BlockMath math={calculated.join(' + ')} />
            </div>
          </div>
        )}

        {/* Final Result Card */}
        {finalAnswer && (
          <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/90 dark:bg-emerald-950/40 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-400 block">
                Final Evaluated Value
              </span>
              <span className="text-xl md:text-2xl font-mono font-black text-emerald-950 dark:text-emerald-200">
                {finalAnswer}
              </span>
            </div>
            <span className="px-3 py-1 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-mono font-bold rounded-full shadow-sm">
              Complete ✓
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
