'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiX, FiMinimize2, FiMaximize2, FiMove } from 'react-icons/fi';
import AIActionButton from '../AIActionButton';

export default function SmartBlockWrapper({
  block,
  zoomLevel = 1,
  onUpdatePosition,
  onDeleteBlock,
  onSelectAiAction,
  children,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const { position, size, type, linkedBlockIds = [], isMinimal = false } = block;
  const isLinked = linkedBlockIds.length > 0;

  // Mouse Drag Handler in Canvas Space
  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x * zoomLevel,
      y: e.clientY - position.y * zoomLevel,
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newX = (e.clientX - dragStartRef.current.x) / zoomLevel;
    const newY = (e.clientY - dragStartRef.current.y) / zoomLevel;
    onUpdatePosition(block.blockId, { x: newX, y: newY });
  }, [isDragging, zoomLevel, block.blockId, onUpdatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // If minimal mode (converted in-place text box like Screenshot 4)
  if (isMinimal || type === 'text_minimal') {
    return (
      <div
        style={{
          transform: `translate(${position.x * zoomLevel}px, ${position.y * zoomLevel}px) scale(${zoomLevel})`,
          transformOrigin: 'top left',
          width: size?.width || 280,
        }}
        className="absolute top-0 left-0 z-40 group"
      >
        <div
          onMouseDown={handleMouseDown}
          className="relative p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 shadow-sm transition-all"
        >
          {/* Minimal Drag & Delete Handle overlay on hover */}
          <div className="opacity-0 group-hover:opacity-100 absolute -top-3 right-1 z-50 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-800 text-white text-[10px]">
            <button
              onClick={() => onDeleteBlock(block.blockId)}
              className="hover:text-rose-400 p-0.5"
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translate(${position.x * zoomLevel}px, ${position.y * zoomLevel}px) scale(${zoomLevel})`,
        transformOrigin: 'top left',
        width: size?.width || 380,
      }}
      className={`absolute top-0 left-0 z-40 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border shadow-2xl transition-shadow ${
        isLinked
          ? 'border-blue-500/80 ring-2 ring-blue-500/20'
          : 'border-zinc-200/80 dark:border-zinc-800/80'
      }`}
    >
      {/* Block Header Toolbar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          <FiMove className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {type} Block
          </span>
          {isLinked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono">
              Linked
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* AI Action Popover Button */}
          {onSelectAiAction && (
            <AIActionButton block={block} onSelectAction={onSelectAiAction} />
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md"
          >
            {isCollapsed ? <FiMaximize2 className="w-3.5 h-3.5" /> : <FiMinimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDeleteBlock(block.blockId)}
            className="p-1 text-zinc-400 hover:text-rose-500 rounded-md"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block Body Content */}
      {!isCollapsed && <div className="p-4">{children}</div>}
    </div>
  );
}
