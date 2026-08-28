'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const FullscreenToggle = ({ children, className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const checkIsFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return false;
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }, []);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(checkIsFullscreen());
  }, [checkIsFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const currentlyFullscreen = checkIsFullscreen();

    if (!currentlyFullscreen) {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } catch (err) {
        console.warn('Native requestFullscreen failed:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.warn('Exit fullscreen error:', err);
      }
    }
  }, [checkIsFullscreen]);

  const handleDoubleClick = useCallback((e) => {
    const tag = e.target?.tagName?.toLowerCase();
    if (
      ['input', 'textarea', 'select', 'button', 'a', 'svg', 'path'].includes(tag) ||
      e.target.closest('button, a, input, textarea, select, .katex')
    ) {
      return;
    }
    toggleFullscreen();
  }, [toggleFullscreen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isFullscreen) {
      toggleFullscreen();
    }
  }, [isFullscreen, toggleFullscreen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    events.forEach(evt => document.addEventListener(evt, handleFullscreenChange));

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      events.forEach(evt => document.removeEventListener(evt, handleFullscreenChange));
    };
  }, [handleKeyDown, handleFullscreenChange]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'auto';
      document.documentElement.classList.add('netz-focus-mode');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('netz-focus-mode');
    }
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      data-focus-mode={isFullscreen ? 'true' : 'false'}
      className={`relative ${className} ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-50 overflow-auto bg-white dark:bg-[#111111]' : ''}`}
    >
      {/* Floating Focus Mode Status Pill */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-black/90 dark:bg-white/90 text-white dark:text-black px-4 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono font-bold animate-fadeIn select-none">
          <FiMaximize2 className="w-4 h-4 text-amber-400 dark:text-amber-600 animate-pulse" />
          <span>Focus Mode Active</span>
          <span className="hidden sm:inline opacity-70">• Double-click or ESC to exit</span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="ml-2 px-2 py-0.5 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black rounded-full hover:opacity-80 transition-opacity flex items-center gap-1"
            title="Exit Focus Mode"
          >
            <FiMinimize2 className="w-3 h-3" /> Exit
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

export default FullscreenToggle;
