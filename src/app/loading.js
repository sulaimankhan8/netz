'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 dark:bg-neutral-950/80 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center justify-center p-8 m-4 max-w-sm w-full bg-white/90 dark:bg-neutral-900/90 border border-gray-200/80 dark:border-neutral-800/80 shadow-2xl rounded-3xl space-y-6 text-center overflow-hidden">
        
        {/* Ambient Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none animate-pulse delay-700"></div>

        {/* Orbiting Quantum Spinner */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 border-r-indigo-500 animate-spin"></div>
          
          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-500 border-l-cyan-400 animate-[spin_2s_linear_infinite_reverse]"></div>

          {/* Central Math Icon Badge */}
          <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg text-white font-bold text-2xl tracking-wider animate-pulse">
            <span>NETZ</span>
          </div>

          {/* Floating Math Symbols */}
          <span className="absolute -top-1 left-2 text-xs font-mono text-purple-500 animate-bounce opacity-80">f(x)</span>
          <span className="absolute bottom-0 right-1 text-xs font-mono text-emerald-500 animate-pulse opacity-80">∫dx</span>
          <span className="absolute top-1/2 -right-2 text-xs font-mono text-blue-500 animate-ping opacity-70">π</span>
        </div>

        {/* Text Details & Animated Dots */}
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            NETZ Application
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 flex items-center justify-center gap-1">
            <span>Loading content</span>
            <span className="inline-flex gap-1 items-center ml-1">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
          </p>
        </div>

        {/* Progress Bar Accent */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 rounded-full animate-[shimmer_1.5s_infinite_linear] shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
