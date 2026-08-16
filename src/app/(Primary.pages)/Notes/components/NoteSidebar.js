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
  FaAngleDoubleLeft
} from 'react-icons/fa';

export default function NoteSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isOpen,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTab, setFilterTab] = useState('all');

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []))
  );

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subtitle && note.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTag = selectedTag ? note.tags && note.tags.includes(selectedTag) : true;

    const matchesTab =
      filterTab === 'all'
        ? true
        : filterTab === 'public'
        ? note.isPublic
        : !note.isPublic;

    return matchesSearch && matchesTag && matchesTab;
  });

  if (!isOpen) return null;

  return (
    <aside className="fixed md:relative inset-y-0 left-0 md:left-auto z-50 md:z-10 w-80 bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col h-full font-sans text-slate-200 shrink-0 transition-all duration-200 ease-in-out shadow-2xl md:shadow-none">
      {/* Header aligned at h-14 (56px) with Notion-style << Collapse button */}
      <div className="h-14 px-4 border-b border-[#2e2e2e] bg-[#181818] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
          <FaBookOpen className="w-4 h-4 text-indigo-500" />
          <span className="text-white">Math Notes</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
            {notes.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2e2e2e] transition-colors"
          title="Collapse Sidebar (<<)"
        >
          <FaAngleDoubleLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Action Button */}
      <div className="p-3 border-b border-[#2e2e2e] bg-[#181818]/50 shrink-0">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-lg transition-all active:scale-95"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2.5 border-b border-[#2e2e2e] shrink-0">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search notes, formulas, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2e2e2e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center border-b border-[#2e2e2e] px-3 py-1.5 text-xs font-medium space-x-1 shrink-0">
        <button
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-1 rounded-lg text-center transition-colors ${
            filterTab === 'all' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notes.length})
        </button>
        <button
          onClick={() => setFilterTab('private')}
          className={`flex-1 py-1 rounded-lg text-center transition-colors ${
            filterTab === 'private' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Private
        </button>
        <button
          onClick={() => setFilterTab('public')}
          className={`flex-1 py-1 rounded-lg text-center transition-colors ${
            filterTab === 'public' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Public
        </button>
      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="px-3 py-2 border-b border-[#2e2e2e] flex items-center space-x-1 overflow-x-auto text-[11px] custom-notion-scrollbar shrink-0">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-0.5 rounded-full shrink-0 ${
              selectedTag === null ? 'bg-indigo-600 text-white font-medium' : 'bg-[#282828] text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-2 py-0.5 rounded-full shrink-0 flex items-center space-x-1 ${
                tag === selectedTag ? 'bg-purple-600 text-white font-medium' : 'bg-[#282828] text-slate-400 hover:text-slate-200'
              }`}
            >
              <FaTag className="w-2.5 h-2.5 opacity-70" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Note List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-notion-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            <FaFileAlt className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
            <p>No notes found.</p>
            <p className="text-[11px] text-slate-600 mt-1">Create a note or adjust search query.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => {
                  onSelectNote(note.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#282828] border border-indigo-500/50 shadow-md'
                    : 'hover:bg-[#242424] border border-transparent text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className={`text-xs font-semibold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {note.title || 'Untitled Note'}
                  </h3>

                  <div className="flex items-center space-x-1 opacity-80 shrink-0 ml-2">
                    {note.isPublic ? (
                      <span title="Public Note">
                        <FaGlobe className="w-3 h-3 text-emerald-400" />
                      </span>
                    ) : (
                      <span title="Private Note">
                        <FaLock className="w-3 h-3 text-slate-500" />
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-[#333333] rounded transition-opacity"
                      title="Delete Note"
                    >
                      <FaTrash className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {note.subtitle && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {note.subtitle}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  {note.tags && note.tags.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#141414] text-indigo-300 font-mono border border-[#2e2e2e]">
                      #{note.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
