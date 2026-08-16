'use client';

import { useState, useEffect } from 'react';
import NoteBlockItem from './NoteBlockItem';
import { exportNoteAsMarkdown } from '../utils/noteStorage';
import { 
  FaShareAlt, 
  FaDownload, 
  FaHeading, 
  FaParagraph, 
  FaSquareRootAlt, 
  FaLightbulb, 
  FaCalculator,
  FaGlobe,
  FaLock,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function NoteEditor({
  note,
  onUpdateNote,
  onOpenShareModal,
  onOpenPickerForBlock,
  onAddWidgetBlock,
  isSidebarOpen,
  onToggleSidebar
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [subtitle, setSubtitle] = useState(note?.subtitle || '');
  const [tagsInput, setTagsInput] = useState(note?.tags ? note.tags.join(', ') : '');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setSubtitle(note.subtitle || '');
      setTagsInput(note.tags ? note.tags.join(', ') : '');
    }
  }, [note]);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-[#191919] font-sans">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
          <FaSquareRootAlt className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-300">No Active Note Selected</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          Select a note from the sidebar or click "Create New Note" to start writing interactive math formulas.
        </p>
      </div>
    );
  }

  const handleTitleChange = (val) => {
    setTitle(val);
    onUpdateNote({ ...note, title: val });
  };

  const handleSubtitleChange = (val) => {
    setSubtitle(val);
    onUpdateNote({ ...note, subtitle: val });
  };

  const handleTagsChange = (val) => {
    setTagsInput(val);
    const parsedTags = val
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    onUpdateNote({ ...note, tags: parsedTags });
  };

  const handleUpdateBlock = (updatedBlock) => {
    const newBlocks = note.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    onUpdateNote({ ...note, blocks: newBlocks });
  };

  const handleDeleteBlock = (blockId) => {
    const newBlocks = note.blocks.filter((b) => b.id !== blockId);
    onUpdateNote({ ...note, blocks: newBlocks });
  };

  const handleMoveBlock = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= note.blocks.length) return;
    const newBlocks = [...note.blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    onUpdateNote({ ...note, blocks: newBlocks });
  };

  const handleInsertBlockAfter = (index) => {
    const newBlock = {
      id: 'b-' + Date.now(),
      type: 'paragraph',
      content: ''
    };
    const newBlocks = [...note.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onUpdateNote({ ...note, blocks: newBlocks });
  };

  const handleAddBlock = (type) => {
    if (type === 'widget') {
      onAddWidgetBlock();
      return;
    }

    let content = '';
    if (type === 'math') {
      content = 'e^{i\\pi} + 1 = 0';
    }

    const newBlock = {
      id: 'b-' + Date.now(),
      type,
      content
    };

    onUpdateNote({ ...note, blocks: [...note.blocks, newBlock] });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#191919] text-slate-100 font-sans overflow-hidden min-w-0">
      {/* Top Action Toolbar */}
      <div className="h-14 px-4 md:px-6 border-b border-[#2e2e2e] bg-[#181818] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl bg-[#2e2e2e] hover:bg-[#383838] text-slate-200 transition-colors"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarOpen ? <FaTimes className="w-3.5 h-3.5" /> : <FaBars className="w-3.5 h-3.5" />}
          </button>

          <span className="flex items-center space-x-1.5 bg-[#282828] px-2.5 py-1 rounded-lg border border-[#333333]">
            {note.isPublic ? (
              <>
                <FaGlobe className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Public</span>
              </>
            ) : (
              <>
                <FaLock className="w-3 h-3 text-slate-400" />
                <span>Private</span>
              </>
            )}
          </span>
          <span className="hidden sm:inline font-mono text-slate-500 text-[11px]">Key: {note.accessKey}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenShareModal}
            className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
          >
            <FaShareAlt className="w-3 h-3" />
            <span className="hidden sm:inline">Share & Access Key</span>
            <span className="sm:hidden">Share</span>
          </button>

          <button
            onClick={() => exportNoteAsMarkdown(note)}
            className="flex items-center space-x-1.5 bg-[#2e2e2e] hover:bg-[#383838] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border border-[#333333]"
          >
            <FaDownload className="w-3 h-3" />
            <span className="hidden sm:inline">Export (.md)</span>
          </button>
        </div>
      </div>

      {/* Editor Main Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-notion-scrollbar">
        <div className="max-w-4xl w-full mx-auto pl-16 sm:pl-24 pr-6 sm:pr-12 py-8 space-y-6">
          {/* Title, Subtitle, Tags Header */}
          <div className="space-y-3 border-b border-[#2e2e2e] pb-6 w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold bg-transparent text-white focus:outline-none placeholder-slate-600"
              placeholder="Untitled Note..."
            />

            <input
              type="text"
              value={subtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium bg-transparent text-indigo-300 focus:outline-none placeholder-slate-600"
              placeholder="Add brief description or topic subtitle..."
            />

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-mono shrink-0">Tags:</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="flex-1 bg-[#202020] border border-[#2e2e2e] rounded-xl px-3 py-1 text-xs text-purple-300 focus:outline-none focus:border-purple-500 font-mono"
                placeholder="e.g. Calculus, Newton Raphson, Unit 1"
              />
            </div>
          </div>

          {/* Blocks Canvas */}
          <div className="space-y-2 min-h-[300px] w-full">
            {note.blocks.map((block, idx) => (
              <NoteBlockItem
                key={block.id}
                block={block}
                index={idx}
                totalBlocks={note.blocks.length}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onMove={handleMoveBlock}
                onOpenPicker={onOpenPickerForBlock}
                onInsertBlockAfter={handleInsertBlockAfter}
              />
            ))}
          </div>

          {/* Add Block Toolbar Footer */}
          <div className="pt-6 border-t border-[#2e2e2e]">
            <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
              + Add Content Block (or type '/' in text)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <button
                onClick={() => handleAddBlock('heading1')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-xs text-slate-300 transition-all hover:scale-105"
              >
                <FaHeading className="w-3.5 h-3.5 text-blue-400" />
                <span>H1 Heading</span>
              </button>

              <button
                onClick={() => handleAddBlock('heading2')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-xs text-slate-300 transition-all hover:scale-105"
              >
                <FaHeading className="w-3 h-3 text-cyan-400" />
                <span>H2 Subheading</span>
              </button>

              <button
                onClick={() => handleAddBlock('paragraph')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-xs text-slate-300 transition-all hover:scale-105"
              >
                <FaParagraph className="w-3.5 h-3.5 text-slate-400" />
                <span>Paragraph</span>
              </button>

              <button
                onClick={() => handleAddBlock('math')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-xs text-slate-300 transition-all hover:scale-105"
              >
                <FaSquareRootAlt className="w-3.5 h-3.5 text-purple-400" />
                <span>LaTeX Math</span>
              </button>

              <button
                onClick={() => handleAddBlock('callout')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-xs text-slate-300 transition-all hover:scale-105"
              >
                <FaLightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Callout</span>
              </button>

              <button
                onClick={() => handleAddBlock('widget')}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-indigo-500/50 text-xs text-indigo-300 font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaCalculator className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Math Widget</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
