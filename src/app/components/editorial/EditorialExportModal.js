'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiDownload, 
  FiX, 
  FiCheck, 
  FiCopy, 
  FiFileText, 
  FiImage, 
  FiZap, 
  FiLayers, 
  FiMaximize2, 
  FiGrid 
} from 'react-icons/fi';
import EditorialButton from './EditorialButton';
import { 
  exportAsPNG, 
  exportAsJPEG, 
  exportAsSVG, 
  exportAsPDF, 
  copyImageToClipboard,
  exportDataAsCSV,
  exportDataAsJSON
} from '@/app/utils/exportEngine';

export default function EditorialExportModal({
  isOpen,
  onClose,
  defaultTargetId,
  availableSections = [],
  data = null,
  baseFileName = 'netz-calculation',
}) {
  const [tier, setTier] = useState('premium'); // 'free' | 'premium'
  const [selectedFormat, setSelectedFormat] = useState('svg'); // 'png' | 'jpeg' | 'clipboard' | 'svg' | 'pdf' | 'csv' | 'json'
  const [selectedTargetId, setSelectedTargetId] = useState(defaultTargetId);
  const [pixelRatio, setPixelRatio] = useState(2);
  const [bgMode, setBgMode] = useState('auto'); // 'auto' | 'light' | 'dark' | 'transparent'
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (defaultTargetId) {
      setSelectedTargetId(defaultTargetId);
    }
  }, [defaultTargetId]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setStatusMessage(null);

    const targetId = selectedTargetId || defaultTargetId;
    const fileName = `${baseFileName}.${selectedFormat}`;

    try {
      if (selectedFormat === 'png') {
        await exportAsPNG(targetId, { fileName, pixelRatio, bgMode });
        showSuccess('PNG image exported successfully!');
      } else if (selectedFormat === 'jpeg') {
        await exportAsJPEG(targetId, { fileName, pixelRatio, bgMode });
        showSuccess('JPEG image exported successfully!');
      } else if (selectedFormat === 'clipboard') {
        await copyImageToClipboard(targetId, { pixelRatio, bgMode });
        showSuccess('Snapshot copied to clipboard!');
      } else if (selectedFormat === 'svg') {
        await exportAsSVG(targetId, { fileName, bgMode });
        showSuccess('Vector SVG (infinite scale) exported successfully!');
      } else if (selectedFormat === 'pdf') {
        await exportAsPDF(targetId, { fileName, bgMode });
        showSuccess('Printable PDF Report generated!');
      } else if (selectedFormat === 'csv' && data) {
        exportDataAsCSV(data, `${baseFileName}.csv`);
        showSuccess('Matrix dataset exported as CSV!');
      } else if (selectedFormat === 'json' && data) {
        exportDataAsJSON(data, `${baseFileName}.json`);
        showSuccess('Dataset exported as JSON!');
      }
    } catch (err) {
      console.error('Export error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Export failed. Please check target section.' });
    } finally {
      setIsExporting(false);
    }
  };

  const showSuccess = (msg) => {
    setStatusMessage({ type: 'success', text: msg });
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-[#FAF9F6] dark:bg-[#141414] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl overflow-hidden transition-all"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FiDownload className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Export Laboratory Engine
              </h3>
              <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                Choose format, scope, and resolution
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-notion-scrollbar">
          
          {/* Tier Switcher */}
          <div className="flex items-center justify-between p-1 bg-neutral-200/80 dark:bg-neutral-800 rounded-xl border border-neutral-300 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => { setTier('free'); setSelectedFormat('png'); }}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                tier === 'free'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <FiImage className="w-3.5 h-3.5" />
              <span>Free Tier (Raster PNG / JPG)</span>
            </button>

            <button
              type="button"
              onClick={() => { setTier('premium'); setSelectedFormat('svg'); }}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                tier === 'premium'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <FiZap className="w-3.5 h-3.5 text-amber-300" />
              <span>Premium Tier (Vector SVG & PDF)</span>
            </button>
          </div>

          {/* Format Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
              Select Export Format
            </label>
            
            {tier === 'free' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* PNG Card */}
                <div
                  onClick={() => setSelectedFormat('png')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    selectedFormat === 'png'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">PNG Image</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">FREE</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    High-resolution raster snapshot up to 4K resolution.
                  </p>
                </div>

                {/* JPEG Card */}
                <div
                  onClick={() => setSelectedFormat('jpeg')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    selectedFormat === 'jpeg'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">JPEG Image</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">FREE</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Compressed lightweight raster image for quick sharing.
                  </p>
                </div>

                {/* Clipboard Card */}
                <div
                  onClick={() => setSelectedFormat('clipboard')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    selectedFormat === 'clipboard'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">Clipboard Copy</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">FREE</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Copy snapshot to paste in Slack, Notion, or Discord.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* SVG Vector Card */}
                <div
                  onClick={() => setSelectedFormat('svg')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    selectedFormat === 'svg'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <FiZap className="text-amber-500" /> Vector SVG
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white">PRO VECTOR</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Lossless infinite zoom vector graphics. Perfect for papers, LaTeX, and posters.
                  </p>
                </div>

                {/* PDF Document Card */}
                <div
                  onClick={() => setSelectedFormat('pdf')}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    selectedFormat === 'pdf'
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <FiFileText className="text-blue-500" /> PDF Document
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white">PRO DOC</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Clean, formatted printable A4 calculation report sheet.
                  </p>
                </div>

                {/* CSV Data Card */}
                {data && (
                  <div
                    onClick={() => setSelectedFormat('csv')}
                    className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                      selectedFormat === 'csv'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <FiGrid className="text-emerald-500" /> CSV Matrix Data
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">RAW DATA</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Export difference matrix & points for Excel, Python, or MATLAB.
                    </p>
                  </div>
                )}

                {/* JSON Card */}
                {data && (
                  <div
                    onClick={() => setSelectedFormat('json')}
                    className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                      selectedFormat === 'json'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <FiLayers className="text-purple-500" /> JSON Object
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">DEVELOPER</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Full structured data object with formula states.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Scope Selector */}
          {availableSections.length > 0 && selectedFormat !== 'csv' && selectedFormat !== 'json' && (
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                Target Section Scope
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedTargetId(sec.id)}
                    className={`py-2 px-3 text-xs font-mono font-medium rounded-lg border text-left truncate transition-all ${
                      selectedTargetId === sec.id
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resolution & Background Customizations (For Raster & Vector Images) */}
          {(selectedFormat === 'png' || selectedFormat === 'jpeg' || selectedFormat === 'svg' || selectedFormat === 'clipboard') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              
              {/* Scale / Resolution (for raster) */}
              {selectedFormat !== 'svg' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                    Resolution Scale
                  </label>
                  <div className="flex gap-2">
                    {[
                      { label: '1x Standard', val: 1 },
                      { label: '2x Retina HD', val: 2 },
                      { label: '4x Ultra HD', val: 4 }
                    ].map((s) => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => setPixelRatio(s.val)}
                        className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                          pixelRatio === s.val
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Background Color Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                  Background Color
                </label>
                <div className="flex gap-2">
                  {[
                    { label: 'Theme Match', val: 'auto' },
                    { label: 'Paper White', val: 'light' },
                    { label: 'Transparent', val: 'transparent' }
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setBgMode(b.val)}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                        bgMode === b.val
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}>
              {statusMessage.type === 'error' ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70">
          <span className="text-[11px] font-mono text-neutral-500">
            {tier === 'premium' ? '⚡ Lossless Vector Rendering' : '🖼️ Standard High-Res Raster'}
          </span>

          <div className="flex items-center gap-3">
            <EditorialButton
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </EditorialButton>

            <EditorialButton
              onClick={handleExport}
              disabled={isExporting}
              variant={tier === 'premium' ? 'gradient' : 'primary'}
              size="sm"
              icon={isExporting ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <FiDownload className="w-3.5 h-3.5" />}
            >
              {isExporting ? 'Generating...' : `Export ${selectedFormat.toUpperCase()}`}
            </EditorialButton>
          </div>
        </div>

      </div>
    </div>
  );
}
