'use client';

import { useState } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFileAlt, 
  FaTag, 
  FaGlobe, 
  FaLock, 
  FaTrash, 
  FaBookOpen,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaThumbtack,
  FaTimes,
  FaLayerGroup,
  FaClock
} from 'react-icons/fa';

export default function NoteSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onTogglePinNote,
  isOpen,
  onClose,
  onToggleSidebar
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'private', 'public'

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []))
  );

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subtitle && note.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (note.blocks && note.blocks.some((b) => b.content && b.content.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTag = selectedTag ? note.tags && note.tags.includes(selectedTag) : true;

    const matchesTab =
      filterTab === 'all'
        ? true
        : filterTab === 'public'
        ? note.isPublic
        : !note.isPublic;

    return matchesSearch && matchesTag && matchesTab;
  });

  const pinnedList = filteredNotes.filter(n => n.isPinned);
  const unpinnedList = filteredNotes.filter(n => !n.isPinned);

  // Collapsed Sidebar Rail Strip
  if (!isOpen) {
    return (
      <aside className="w-12 h-full bg-white dark:bg-[#191919] border-r border-neutral-200 dark:border-[#2d2d2d] flex flex-col items-center py-3 space-y-4 shrink-0 font-sans z-10 transition-colors duration-200">
        <button
          onClick={onToggleSidebar || onClose}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2b2b2b] border border-neutral-200 dark:border-[#333333] transition-colors"
          title="Expand Sidebar (>>)"
        >
          <FaAngleDoubleRight className="w-4 h-4 text-neutral-800 dark:text-white" />
        </button>
        <div className="w-6 border-b border-neutral-200 dark:border-[#2d2d2d]"></div>
        <button
          onClick={onCreateNote}
          className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-[#252525] dark:hover:bg-[#2d2d2d] dark:text-white rounded-lg border border-neutral-300 dark:border-[#383838] transition-colors shadow-sm"
          title="Create New Note"
        >
          <FaPlus className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1"></div>
        <div className="p-2 text-neutral-400 dark:text-neutral-500" title="Notes Studio">
          <FaBookOpen className="w-4 h-4" />
        </div>
      </aside>
    );
  }

  const renderNoteCard = (note) => {
    const isActive = note.id === activeNoteId;
    const blockCount = note.blocks ? note.blocks.length : 0;
    
    const snippetBlock = note.blocks?.find(b => b.content && (b.type === 'paragraph' || b.type === 'math' || b.type === 'callout'));
    const snippetText = snippetBlock?.content || note.subtitle || '';

    return (
      <div
        key={note.id}
        onClick={() => {
          onSelectNote(note.id);
          if (typeof window !== 'undefined' && window.innerWidth < 768) onClose();
        }}
        className={`group relative p-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${
          isActive
            ? 'bg-[#e9e9e5] border-neutral-400 text-neutral-900 shadow-sm dark:bg-[#282828] dark:border-neutral-500 dark:text-white'
            : 'bg-[#f7f7f5] hover:bg-[#efefed] border-[#e0e0de] hover:border-[#d0d0cc] text-neutral-800 dark:bg-[#1e1e1e] dark:hover:bg-[#242424] dark:border-[#2e2e2e] dark:hover:border-[#383838] dark:text-neutral-300'
        }`}
      >
        {/* Top title & quick actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            {note.isPinned && (
              <FaThumbtack className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0 transform -rotate-45" title="Pinned Note" />
            )}
            <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white'}`}>
              {note.title || 'Untitled Note'}
            </h3>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {/* Privacy indicator */}
            {note.isPublic ? (
              <span title="Public Note" className="p-0.5">
                <FaGlobe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </span>
            ) : (
              <span title="Private Note" className="p-0.5">
                <FaLock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              </span>
            )}

            {/* Quick Pin Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onTogglePinNote) onTogglePinNote(note.id);
              }}
              className={`p-1 rounded transition-colors ${
                note.isPinned 
                  ? 'text-amber-500 dark:text-amber-400 hover:bg-amber-500/20' 
                  : 'opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-neutral-200 dark:hover:bg-[#333333]'
              }`}
              title={note.isPinned ? "Unpin Note" : "Pin Note"}
            >
              <FaThumbtack className={`w-3 h-3 ${note.isPinned ? 'transform -rotate-45' : ''}`} />
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
              title="Delete Note"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Subtitle or Snippet */}
        {snippetText && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {snippetText}
          </p>
        )}

        {/* Card Footer Metadata */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-200 dark:border-[#2e2e2e] text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-neutral-600 dark:text-neutral-300 font-medium">
              <FaClock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
              <span>{new Date(note.updatedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-600">•</span>
            <span className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400">
              <FaLayerGroup className="w-3 h-3 opacity-60" />
              <span>{blockCount} {blockCount === 1 ? 'block' : 'blocks'}</span>
            </span>
          </div>

          {note.tags && note.tags.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-[#171717] text-neutral-700 dark:text-neutral-300 font-mono text-xs border border-neutral-300 dark:border-[#333333] max-w-[100px] truncate font-medium">
              #{note.tags[0]}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="relative inset-y-0 z-10 w-80 md:w-84 bg-white dark:bg-[#191919] border-r border-neutral-200 dark:border-[#2d2d2d] flex flex-col h-full font-sans text-neutral-800 dark:text-neutral-200 shrink-0 transition-colors duration-200 shadow-none">
      {/* Header with Title & Double Arrow Collapse Icon (<<) */}
      <div className="h-14 px-4 border-b border-neutral-200 dark:border-[#2d2d2d] bg-white dark:bg-[#191919] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#383838] flex items-center justify-center shadow-sm">
            <FaBookOpen className="w-4 h-4 text-neutral-800 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-900 dark:text-white font-bold text-sm tracking-tight">Notes Studio</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 dark:bg-[#2b2b2b] dark:text-neutral-300 border border-neutral-200 dark:border-[#383838] font-bold">
                {notes.length}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">NETZ Workspace</p>
          </div>
        </div>

        {/* Previous double arrow collapse button (<<) */}
        <button
          onClick={onClose}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2b2b2b] border border-transparent hover:border-neutral-200 dark:hover:border-[#383838] transition-colors"
          title="Collapse Sidebar (<<)"
        >
          <FaAngleDoubleLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Action Button: Create New Note (Notion Light & Dark Monochrome Style) */}
      <div className="p-3 border-b border-neutral-200 dark:border-[#2d2d2d] bg-white dark:bg-[#191919] shrink-0">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-[#252525] dark:hover:bg-[#2d2d2d] dark:text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-[#383838] shadow-sm transition-all active:scale-[0.98] group"
        >
          <FaPlus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200 text-neutral-800 dark:text-white" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2.5 border-b border-neutral-200 dark:border-[#2d2d2d] shrink-0">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-3 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search notes, formulas, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 dark:bg-[#141414] dark:border-[#2e2e2e] dark:text-white dark:placeholder-neutral-500 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors font-medium"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-0.5 rounded"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          ) : (
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-[#242424] px-1.5 py-0.5 rounded border border-neutral-200 dark:border-[#333333]">
              /
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs: ALL, PRIVATE, PUBLIC */}
      <div className="grid grid-cols-3 gap-1.5 border-b border-neutral-200 dark:border-[#2d2d2d] p-2 text-xs font-semibold shrink-0 bg-neutral-50 dark:bg-[#191919]">
        <button
          onClick={() => setFilterTab('all')}
          className={`py-1.5 rounded-lg text-center transition-all border ${
            filterTab === 'all'
              ? 'bg-white text-neutral-900 border-neutral-300 font-bold shadow-sm dark:bg-[#2b2b2b] dark:text-white dark:border-[#404040]'
              : 'bg-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 border-transparent'
          }`}
        >
          All ({notes.length})
        </button>
        <button
          onClick={() => setFilterTab('private')}
          className={`py-1.5 rounded-lg text-center transition-all border ${
            filterTab === 'private'
              ? 'bg-white text-neutral-900 border-neutral-300 font-bold shadow-sm dark:bg-[#2b2b2b] dark:text-white dark:border-[#404040]'
              : 'bg-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 border-transparent'
          }`}
        >
          Private
        </button>
        <button
          onClick={() => setFilterTab('public')}
          className={`py-1.5 rounded-lg text-center transition-all border ${
            filterTab === 'public'
              ? 'bg-white text-neutral-900 border-neutral-300 font-bold shadow-sm dark:bg-[#2b2b2b] dark:text-white dark:border-[#404040]'
              : 'bg-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 border-transparent'
          }`}
        >
          Public
        </button>
      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="px-3 py-2 border-b border-neutral-200 dark:border-[#2d2d2d] flex items-center space-x-1.5 overflow-x-auto text-xs scrollbar-none shrink-0">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg shrink-0 border transition-all font-medium ${
              selectedTag === null
                ? 'bg-neutral-800 text-white border-neutral-800 font-bold dark:bg-[#2d2d2d] dark:text-white dark:border-[#444444]'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:bg-[#141414] dark:border-[#2b2b2b] dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center space-x-1 border transition-all font-medium ${
                tag === selectedTag
                  ? 'bg-neutral-800 text-white border-neutral-800 font-bold dark:bg-[#2d2d2d] dark:text-white dark:border-[#444444]'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:bg-[#141414] dark:border-[#2b2b2b] dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              <FaTag className="w-2.5 h-2.5 opacity-70" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Note List Container */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3 custom-notion-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4 text-neutral-400 text-xs">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-[#242424] border border-neutral-200 dark:border-[#333333] flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <FaFileAlt className="w-6 h-6 opacity-80" />
            </div>
            <p className="font-bold text-neutral-700 dark:text-neutral-200">No notes match your filters</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-[200px] mx-auto">
              Try adjusting search query or tags, or create a brand new note.
            </p>
            {(searchQuery || selectedTag || filterTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                  setFilterTab('all');
                }}
                className="mt-3 text-xs text-neutral-900 dark:text-white hover:underline font-bold"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Pinned Notes Section */}
            {pinnedList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 px-1 text-xs font-extrabold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                  <FaThumbtack className="w-3 h-3 transform -rotate-45" />
                  <span>Pinned ({pinnedList.length})</span>
                </div>
                {pinnedList.map(renderNoteCard)}
              </div>
            )}

            {/* Unpinned Notes Section */}
            {unpinnedList.length > 0 && (
              <div className="space-y-2">
                {pinnedList.length > 0 && (
                  <div className="flex items-center space-x-1.5 px-1 pt-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <span>Notes ({unpinnedList.length})</span>
                  </div>
                )}
                {unpinnedList.map(renderNoteCard)}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
