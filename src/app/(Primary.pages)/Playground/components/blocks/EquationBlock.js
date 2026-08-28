'use client';

import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { FiEdit2, FiCheck, FiBarChart2 } from 'react-icons/fi';
import { scopeManager } from '../../utils/scopeManager';

// Safe KaTeX Renderer component to prevent invalid user inputs from crashing the component
function SafeInlineMath({ math }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [math]);

  if (!math || !math.trim()) {
    return <span className="text-zinc-400 italic">Empty equation</span>;
  }

  if (hasError) {
    return <span className="font-mono text-sm text-zinc-800 dark:text-zinc-200">{math}</span>;
  }

  try {
    return (
      <InlineMath
        math={math}
        renderError={() => {
          return <span className="font-mono text-sm text-zinc-800 dark:text-zinc-200">{math}</span>;
        }}
      />
    );
  } catch (err) {
    return <span className="font-mono text-sm text-zinc-800 dark:text-zinc-200">{math}</span>;
  }
}

export default function EquationBlock({
  block,
  onUpdateContent,
  onPlotGraph,
  isEditing: propIsEditing,
  setIsEditing: propSetIsEditing,
}) {
  const [latex, setLatex] = useState(block.content?.latex || 'y = x^2 - 4x + 3');
  const [localIsEditing, setLocalIsEditing] = useState(false);

  const isEditing = propIsEditing !== undefined ? propIsEditing : localIsEditing;
  const setIsEditing = propSetIsEditing || setLocalIsEditing;

  useEffect(() => {
    if (block.content?.latex !== undefined) {
      setLatex(block.content.latex);
    }
  }, [block.content?.latex]);

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
    <div className="relative group">
      {isEditing ? (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <input
            type="text"
            value={latex}
            onChange={(e) => handleLatexChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false);
            }}
            autoFocus
            placeholder="Type equation (e.g. y = x^2 - 4x + 3)..."
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
          />
          {onPlotGraph && (
            <div className="flex items-center pt-0.5">
              <button
                onClick={() => onPlotGraph(block, latex)}
                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all cursor-pointer"
              >
                <FiBarChart2 className="w-4 h-4" />
                <span>Plot Graph</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="group/eq relative px-2.5 py-1.5 rounded-xl bg-transparent hover:bg-zinc-100/40 dark:hover:bg-zinc-800/30 border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 select-none"
        >
          <div className="text-base text-zinc-900 dark:text-zinc-100 font-medium">
            <SafeInlineMath math={latex} />
          </div>

          {/* Semi-transparent hover edit & plot icons */}
          <div className="opacity-0 group-hover/eq:opacity-100 flex items-center gap-1 transition-opacity">
            {onPlotGraph && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlotGraph(block, latex);
                }}
                title="Plot Graph"
                className="p-1 text-zinc-400 hover:text-blue-500 rounded transition-colors"
              >
                <FiBarChart2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Edit Equation"
              className="p-1 text-zinc-400 hover:text-blue-500 rounded transition-colors"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
