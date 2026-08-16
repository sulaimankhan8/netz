'use client';

import { useState } from 'react';
import EmbeddedMathWidget from './EmbeddedMathWidget';
import KaTeXRenderer from './KaTeXRenderer';
import SlashCommandMenu from './SlashCommandMenu';
import { 
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaLightbulb
} from 'react-icons/fa';

export default function NoteBlockItem({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onMove,
  onOpenPicker,
  onInsertBlockAfter
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [isSlashOpen, setIsSlashOpen] = useState(false);

  const handleContentChange = (val) => {
    if (val.includes('/')) {
      const slashIndex = val.lastIndexOf('/');
      const query = val.slice(slashIndex + 1);
      setSlashQuery(query);
      setIsSlashOpen(true);
    } else {
      setIsSlashOpen(false);
    }

    onUpdate({ ...block, content: val });
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    if (block.type === 'paragraph' && !block.content) {
      setSlashQuery('');
      setIsSlashOpen(true);
    } else {
      onInsertBlockAfter(index);
    }
  };

  const handleSelectSlashItem = (item) => {
    setIsSlashOpen(false);
    let cleanContent = block.content ? block.content.split('/')[0].trim() : '';

    if (item.type === 'open-picker') {
      onOpenPicker(block.id);
      return;
    }

    if (item.type === 'widget') {
      onUpdate({
        ...block,
        type: 'widget',
        content: item.title,
        widgetConfig: item.widgetConfig
      });
    } else {
      // Set empty string for heading1, heading2, heading3, callout, and paragraph so placeholders show
      let defaultContent = cleanContent;
      if (['heading1', 'heading2', 'heading3', 'callout', 'paragraph'].includes(item.type)) {
        defaultContent = '';
      } else if (item.type === 'math') {
        defaultContent = 'e^{i\\pi} + 1 = 0';
      }

      onUpdate({
        ...block,
        type: item.type,
        content: defaultContent
      });
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative my-1 font-sans text-slate-100 transition-colors w-full rounded-lg"
    >
      {/* Clean Hover Controls */}
      <div
        className={`absolute -left-20 sm:-left-24 top-0.5 flex items-center space-x-1 transition-opacity duration-150 z-30 shrink-0 bg-[#202020]/90 backdrop-blur-sm border border-[#333333] rounded-lg px-1.5 py-0.5 shadow-lg ${
          isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={handlePlusClick}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2e2e2e] transition-colors"
          title="Add block / open '/' commands"
        >
          <FaPlus className="w-2.5 h-2.5" />
        </button>

        <button
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-[#2e2e2e] rounded transition-colors"
          title="Move Up"
        >
          <FaArrowUp className="w-2.5 h-2.5" />
        </button>

        <button
          onClick={() => onMove(index, index + 1)}
          disabled={index === totalBlocks - 1}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-[#2e2e2e] rounded transition-colors"
          title="Move Down"
        >
          <FaArrowDown className="w-2.5 h-2.5" />
        </button>

        <button
          onClick={() => onDelete(block.id)}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-[#2e2e2e] rounded transition-colors"
          title="Delete Block"
        >
          <FaTrash className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Main Block Content Renderer */}
      <div className="relative w-full">
        {block.type === 'heading1' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-bold bg-transparent text-white focus:outline-none placeholder-slate-600 border-b border-transparent focus:border-indigo-500/50 py-1"
            placeholder="Heading 1..."
          />
        )}

        {block.type === 'heading2' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full text-lg sm:text-xl font-semibold bg-transparent text-slate-200 focus:outline-none placeholder-slate-600 border-b border-transparent focus:border-indigo-500/50 py-1"
            placeholder="Heading 2..."
          />
        )}

        {block.type === 'heading3' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full text-base font-semibold bg-transparent text-indigo-300 focus:outline-none placeholder-slate-600 border-b border-transparent focus:border-indigo-500/50 py-1"
            placeholder="Heading 3..."
          />
        )}

        {block.type === 'paragraph' && (
          <textarea
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={Math.max(1, (block.content.match(/\n/g) || []).length + 1)}
            className="w-full bg-transparent text-sm text-slate-300 focus:outline-none resize-none leading-relaxed placeholder-slate-600 focus:placeholder-slate-500"
            placeholder="Press '/' for commands..."
          />
        )}

        {block.type === 'math' && (
          <div className="space-y-2 p-3.5 rounded-xl bg-[#202020] border border-[#333333] w-full">
            <div className="flex items-center justify-between text-[11px] text-purple-400 font-mono">
              <span>LaTeX Math Code</span>
              <span className="text-[10px] text-slate-500">Live KaTeX Render</span>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full bg-[#181818] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              placeholder="e.g. Z = \frac{\bar{X} - \mu}{\sigma/\sqrt{n}}"
            />
            <div className="p-3 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center">
              <KaTeXRenderer math={block.content || 'e^{i\\pi} + 1 = 0'} blockMode={true} />
            </div>
          </div>
        )}

        {block.type === 'callout' && (
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#25231c] border border-amber-500/30 text-amber-200 text-xs w-full">
            <FaLightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full bg-transparent text-amber-100 focus:outline-none placeholder-amber-500/50"
              placeholder="Callout note or key rule..."
            />
          </div>
        )}

        {block.type === 'widget' && (
          <EmbeddedMathWidget
            config={block.widgetConfig}
            onChange={(newConfig) => onUpdate({ ...block, widgetConfig: newConfig })}
            onOpenPicker={() => onOpenPicker(block.id)}
          />
        )}

        {/* Slash Command Floating Menu Popover */}
        <SlashCommandMenu
          isOpen={isSlashOpen}
          query={slashQuery}
          onSelect={handleSelectSlashItem}
          onClose={() => setIsSlashOpen(false)}
        />
      </div>
    </div>
  );
}
