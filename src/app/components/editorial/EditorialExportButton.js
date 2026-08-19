'use client';

import React, { useState } from 'react';
import { FiDownload, FiChevronDown, FiZap, FiImage, FiFileText, FiSliders } from 'react-icons/fi';
import EditorialButton from './EditorialButton';
import EditorialExportModal from './EditorialExportModal';
import { exportAsPNG, exportAsSVG, exportAsPDF } from '@/app/utils/exportEngine';

export default function EditorialExportButton({
  targetId,
  fileName = 'report',
  label = 'Export',
  variant = 'secondary',
  size = 'sm',
  availableSections = [],
  data = null,
  tooltipText = 'Export section or calculation sheet',
  className = ''
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickExporting, setQuickExporting] = useState(false);

  const handleQuickExport = async (format) => {
    setDropdownOpen(false);
    setQuickExporting(true);
    try {
      if (format === 'svg') {
        await exportAsSVG(targetId, { fileName: `${fileName}.svg` });
      } else if (format === 'pdf') {
        await exportAsPDF(targetId, { fileName: `${fileName}.pdf` });
      } else {
        await exportAsPNG(targetId, { fileName: `${fileName}.png`, pixelRatio: 2 });
      }
    } catch (e) {
      console.error(e);
      // Fallback to opening modal if quick export fails
      setModalOpen(true);
    } finally {
      setQuickExporting(false);
    }
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        {/* Main Export Button - Opens Modal by default */}
        <EditorialButton
          onClick={() => setModalOpen(true)}
          variant={variant}
          size={size}
          disabled={quickExporting}
          tooltipText={tooltipText}
          icon={quickExporting ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <FiDownload className="w-3.5 h-3.5" />}
          className={`rounded-r-none border-r-0 ${className}`}
        >
          {quickExporting ? 'Exporting...' : label}
        </EditorialButton>

        {/* Dropdown Quick Options Trigger */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-2 py-1.5 border border-neutral-300 dark:border-neutral-600 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-r-lg transition-colors focus:outline-none"
          title="Quick Export Options"
        >
          <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Dropdown Menu */}
        {dropdownOpen && (
          <div 
            className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-xl z-50 py-1 font-mono text-xs animate-fadeIn"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-800">
              Quick Export
            </div>

            <button
              type="button"
              onClick={() => handleQuickExport('png')}
              className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiImage className="text-emerald-500" /> Free PNG (2x HD)
              </span>
              <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">FREE</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickExport('svg')}
              className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiZap className="text-amber-500" /> Vector SVG
              </span>
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold">PRO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickExport('pdf')}
              className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiFileText className="text-blue-500" /> PDF Document
              </span>
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold">PRO</span>
            </button>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />

            <button
              type="button"
              onClick={() => { setDropdownOpen(false); setModalOpen(true); }}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold transition-colors"
            >
              <FiSliders /> Customize Settings...
            </button>
          </div>
        )}
      </div>

      {/* Export Configuration Modal */}
      <EditorialExportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTargetId={targetId}
        availableSections={availableSections}
        data={data}
        baseFileName={fileName}
      />
    </>
  );
}
