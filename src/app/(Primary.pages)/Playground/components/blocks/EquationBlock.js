'use client';

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { scopeManager } from '../../utils/scopeManager';

export default function EquationBlock({ block, onUpdateContent, onPlotGraph }) {
  const [latex, setLatex] = useState(block.content?.latex || 'y = x^2 - 4x + 3');
  const [isEditing, setIsEditing] = useState(false);

  const handleLatexChange = (newVal) => {
    setLatex(newVal);
    onUpdateContent(block.blockId, { latex: newVal });

    // Register variable definition in global CAS scope if present (e.g. a = 5)
    if (newVal.includes('=')) {
      const parts = newVal.split('=');
      const varName = parts[0].trim();
      const val = parseFloat(parts[1].trim());
      if (varName.match(/^[a-zA-Z]$/) && !isNaN(val)) {
        scopeManager.setSymbol(varName, val, block.blockId);
      }
    }
  };

  return (
    <div className="space-y-3">
      {isEditing ? (
        <input
          type="text"
          value={latex}
          onChange={(e) => handleLatexChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-blue-500 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer hover:border-blue-500/50 transition-colors flex items-center justify-between"
        >
          <div className="text-base text-zinc-900 dark:text-zinc-100 font-medium">
            <InlineMath math={latex || '0'} />
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Tap to Edit</span>
        </div>
      )}

      {/* Block Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onPlotGraph(block, latex)}
          className="flex-1 py-1.5 px-3 text-xs font-medium rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all"
        >
          📊 Plot Graph
        </button>
      </div>
    </div>
  );
}
