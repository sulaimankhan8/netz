'use client';

import React from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiTrash2, FiCopy } from 'react-icons/fi';

/**
 * PageManager Component — Multi-Page Notebook Navigator
 * Inspired by Samsung Notes & Apple Notes page thumbnails and multi-page indexing.
 *
 * Allows users to add, navigate, duplicate, and delete pages within a single Playground session.
 */
export default function PageManager({
  pages = [{ id: 'page_1', title: 'Page 1' }],
  currentPageIndex = 0,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
}) {
  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg text-xs font-medium select-none">
      {/* Previous Page */}
      <button
        onClick={() => onSelectPage(Math.max(0, currentPageIndex - 1))}
        disabled={currentPageIndex === 0}
        title="Previous Page"
        className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <FiChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Current Page Index Indicator */}
      <div className="flex items-center gap-1 px-1.5 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
        <span>Page</span>
        <span className="font-bold text-blue-500">{currentPageIndex + 1}</span>
        <span className="text-zinc-400">/</span>
        <span className="text-zinc-400">{pages.length}</span>
      </div>

      {/* Next Page */}
      <button
        onClick={() => onSelectPage(Math.min(pages.length - 1, currentPageIndex + 1))}
        disabled={currentPageIndex === pages.length - 1}
        title="Next Page"
        className="p-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <FiChevronRight className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3.5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

      {/* Add Page */}
      <button
        onClick={onAddPage}
        title="Add New Note Page"
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 active:scale-95 transition-all text-[11px] font-semibold"
      >
        <FiPlus className="w-3 h-3" />
        <span>Add Page</span>
      </button>

      {/* Duplicate Page */}
      {onDuplicatePage && (
        <button
          onClick={() => onDuplicatePage(currentPageIndex)}
          title="Duplicate Current Page"
          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <FiCopy className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Delete Page */}
      {pages.length > 1 && onDeletePage && (
        <button
          onClick={() => onDeletePage(currentPageIndex)}
          title="Delete Page"
          className="p-1 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
