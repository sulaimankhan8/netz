'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import {
  FiBarChart2,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi';

export default function AIActionButton({ block, onSelectAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleAction = (actionKey) => {
    setIsOpen(false);
    onSelectAction(block, actionKey);
  };

  const { type } = block;

  return (
    <div ref={popoverRef} className="relative inline-block">
      {/* Sparkles AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Contextual CAS & AI Transforms"
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI</span>
      </button>

      {/* Popover Action Menu */}
      {isOpen && (
        <div className="absolute top-8 right-0 z-50 min-w-[190px] p-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            CAS Actions
          </div>

          {/* Equation Block Actions */}
          {type === 'equation' && (
            <div className="py-1 space-y-0.5">
              <button
                onClick={() => handleAction('PLOT_GRAPH')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                <FiBarChart2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Plot Graph</span>
              </button>

              <button
                onClick={() => handleAction('DIFFERENTIATE')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-purple-500/10 hover:text-purple-500 rounded-lg transition-colors cursor-pointer"
              >
                <FiTrendingUp className="w-3.5 h-3.5 text-purple-500" />
                <span>Differentiate (d/dx)</span>
              </button>

              <button
                onClick={() => handleAction('INTEGRATE')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition-colors cursor-pointer"
              >
                <FiZap className="w-3.5 h-3.5 text-emerald-500" />
                <span>Integrate (∫)</span>
              </button>

              <button
                onClick={() => handleAction('FIND_ROOTS')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-amber-500/10 hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
              >
                <FiCheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Find Roots / Solve</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
