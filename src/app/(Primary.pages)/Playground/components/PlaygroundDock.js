'use client';

import React, { useState } from 'react';
import {
  FiEdit2,
  FiMove,
  FiZoomIn,
  FiZoomOut,
  FiSliders,
  FiCheck,
  FiPlus,
  FiBarChart2,
  FiFileText,
  FiDownload,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiMic,
  FiImage,
} from 'react-icons/fi';
import { FaHighlighter, FaEraser } from 'react-icons/fa6';
import { LuLassoSelect, LuPencil, LuShapes } from 'react-icons/lu';

const PEN_PRESETS = [
  { label: 'Ballpoint', width: 2, opacity: 1.0 },
  { label: 'Fountain', width: 4, opacity: 1.0 },
  { label: 'Pencil', width: 3, opacity: 0.7 },
  { label: 'Marker', width: 8, opacity: 0.85 },
];

const COLOR_PALETTE = [
  '#3B82F6', // Netz Electric Blue
  '#10B981', // Emerald Green
  '#8B5CF6', // Vivid Purple
  '#F43F5E', // Rose Pink
  '#F59E0B', // Warm Amber
  '#06B6D4', // Cyan
  '#64748B', // Slate
  '#FFFFFF', // White / Dark Contrast
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Bold', value: 8 },
];

export default function PlaygroundDock({
  activeTool,
  setActiveTool,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  gridStyle,
  setGridStyle,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onAddBlock,
  onOpenSyncModal,
  onExportCanvas,
  showLiveOcr = false,
  setShowLiveOcr,
  notesMode = false,
  setNotesMode,
  isRecording = false,
  onToggleRecordAudio,
  onInsertImage,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = React.useRef(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 max-w-[95vw]">
      {/* Expanded Settings Panel (Color, Width, Grid & Live OCR Toggle) */}
      {showSettings && (
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          {/* Color Palette */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-zinc-200 dark:border-zinc-800">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center border border-black/10 dark:border-white/10 ${
                  strokeColor === color ? 'scale-125 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              >
                {strokeColor === color && (
                  <FiCheck className={`w-3 h-3 ${color === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w.value}
                onClick={() => setStrokeWidth(w.value)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  strokeWidth === w.value
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* Grid Background Selector */}
          <div className="flex items-center gap-1 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500 mr-1">Grid:</span>
            {['dots', 'grid', 'lines', 'none'].map((style) => (
              <button
                key={style}
                onClick={() => setGridStyle(style)}
                className={`px-2 py-1 capitalize rounded-md transition-colors ${
                  gridStyle === style
                    ? 'bg-zinc-200 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Pen Style Presets */}
          <div className="flex items-center gap-1 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500 mr-1">
              <LuPencil className="w-3 h-3 inline" />
            </span>
            {PEN_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setStrokeWidth(preset.width)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  strokeWidth === preset.width
                    ? 'bg-zinc-200 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Live OCR Opt-In Toggle */}
          {setShowLiveOcr && (
            <div className="flex items-center gap-1 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-xs">
              <button
                onClick={() => setShowLiveOcr(!showLiveOcr)}
                title="Toggle Live Handwriting Recognition Preview Tags"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors font-medium ${
                  showLiveOcr
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {showLiveOcr ? <FiEye className="w-3.5 h-3.5" /> : <FiEyeOff className="w-3.5 h-3.5" />}
                <span>Live OCR Tags</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Export Format Popover Menu */}
      {showExportMenu && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl animate-in fade-in slide-in-from-bottom-2 text-xs">
          <button
            onClick={() => {
              setShowExportMenu(false);
              onExportCanvas('PNG');
            }}
            className="px-3 py-1.5 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
          >
            Export PNG Image
          </button>
          <button
            onClick={() => {
              setShowExportMenu(false);
              onExportCanvas('SVG');
            }}
            className="px-3 py-1.5 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
          >
            Export SVG Vector
          </button>
          <button
            onClick={() => {
              setShowExportMenu(false);
              onExportCanvas('PDF');
            }}
            className="px-3 py-1.5 font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
          >
            Export PDF Document
          </button>
        </div>
      )}

      {/* Main Dock Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl">
        {/* Drawing Tools */}
        <button
          onClick={() => setActiveTool('pen')}
          title="Pen (Stylus / Mouse Ink)"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'pen'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FiEdit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('highlighter')}
          title="Highlighter"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'highlighter'
              ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FaHighlighter className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          title="Eraser (Point & Stroke)"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'eraser'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FaEraser className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('lasso')}
          title="Lasso Select (Tap or Select Ink to Convert to Typed Block)"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'lasso'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <LuLassoSelect className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('shape')}
          title="Shape Tool (Auto-Snaps to Circles, Rectangles, Straight Lines)"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'shape'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <LuShapes className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('pan')}
          title="Pan Infinite Viewport"
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'pan'
              ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black shadow-md'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FiMove className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Notes Mode Toggle */}
        {setNotesMode && (
          <button
            onClick={() => setNotesMode(!notesMode)}
            title={notesMode ? 'Switch to Whiteboard Mode' : 'Switch to Notes Mode'}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-1 ${
              notesMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <FiBookOpen className="w-4 h-4" />
            <span className="text-[11px] font-semibold hidden sm:inline">
              {notesMode ? 'Notes' : 'Notes'}
            </span>
          </button>
        )}

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Add Smart Block Shortcuts */}
        {onAddBlock && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddBlock('equation')}
              title="Add Equation Block"
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all flex items-center gap-1"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>Eq</span>
            </button>

            <button
              onClick={() => onAddBlock('graph')}
              title="Add Graph Block"
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
            >
              <FiBarChart2 className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>

            <button
              onClick={() => onAddBlock('theory')}
              title="Add Theory Block"
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-all flex items-center gap-1"
            >
              <FiFileText className="w-3.5 h-3.5" />
              <span>Theory</span>
            </button>
          </div>
        )}

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Voice Memo Recording Button */}
        {onToggleRecordAudio && (
          <button
            onClick={onToggleRecordAudio}
            title={isRecording ? 'Stop Voice Recording' : 'Record Voice Note'}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <FiMic className="w-4 h-4" />
          </button>
        )}

        {/* Insert Image Button */}
        {onInsertImage && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    onInsertImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Insert Image / Photo"
              className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <FiImage className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Workspace Sync & Export Triggers */}
        {onOpenSyncModal && (
          <button
            onClick={onOpenSyncModal}
            title="Sync Whiteboard to Notes Workspace"
            className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <FiLayers className="w-4 h-4 text-blue-500" />
          </button>
        )}

        {onExportCanvas && (
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Export Canvas (PNG / SVG / PDF)"
            className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        )}

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Toggle Style Settings Panel */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          title="Stroke & Canvas Settings"
          className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
            showSettings
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10"
            style={{ backgroundColor: strokeColor }}
          />
          <FiSliders className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={onResetZoom}
            title="Reset Zoom (100%)"
            className="px-2 py-1 text-xs font-mono font-semibold rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
