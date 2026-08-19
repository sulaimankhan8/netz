'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiGrid, 
  FiFileText, 
  FiSliders, 
  FiUser, 
  FiSearch, 
  FiChevronDown, 
  FiChevronRight, 
  FiLayers, 
  FiExternalLink, 
  FiZap,
  FiActivity,
  FiFolder,
  FiCornerDownRight,
  FiX
} from 'react-icons/fi';

// Unified Navigation Schema
const PRIMARY_NAV = [
  { title: 'Home', route: '/', icon: FiHome },
  { title: 'Algorithms Hub', route: '/Algorithems', icon: FiGrid },
  { title: 'Playground', route: '/Playground', icon: FiZap, badge: 'Interactive' },
  { title: 'Notes Studio', route: '/Notes', icon: FiFileText },
  { title: 'Settings', route: '/Setting', icon: FiSliders },
  { title: 'Profile', route: '/Profile', icon: FiUser },
];

const LAB_EXAMPLES = [
  { title: 'Newton Forward Lab', route: '/algorithm/example/newton-forward', badge: 'New Lab' },
  { title: 'Compound Interest', route: '/algorithm/example', badge: 'Featured' }
];

// Full 3-Level Deep Units Structure (Matching Sidenav.js perfectly)
const UNITS_DATA = [
  {
    id: 'unit-1',
    title: 'Unit 1: Equations & Systems',
    shortTitle: 'Unit 1',
    description: 'Root Finding & Linear Systems',
    subTopics: [
      { title: 'Bisection Method', link: '/bisection-method' },
      { title: 'Iteration Method', link: '/iteration-method' },
      { title: 'False Position Method', link: '/false-position-method' },
      { title: 'Newton-Raphson Method', link: '/newton-raphson-method' },
      { title: 'Gauss Seidel Method', link: '/Gauss-seidal' },
    ]
  },
  {
    id: 'unit-2',
    title: 'Unit 2: Interpolation',
    shortTitle: 'Unit 2',
    description: 'Equal & Unequal Intervals',
    subTopics: [
      {
        title: 'Interpolation for Equal Intervals',
        subTopics: [
          { title: "Newton's Forward Formula", link: '/newton-forward', isLab: true },
          { title: "Newton's Backward Formula", link: '/newton-backward' },
          { title: 'Gauss Forward Formula', link: '/gauss-forward' },
          { title: 'Gauss Backward Formula', link: '/gauss-backward' },
        ],
      },
      {
        title: 'Interpolation for Unequal Intervals',
        subTopics: [
          { title: "Newton's Divided Difference Formula", link: '/newton-divided' },
          { title: "Lagrange's Interpolation Formula", link: '/lagrange-interpolation' },
        ],
      },
    ],
  },
  {
    id: 'unit-3',
    title: 'Unit 3: Differentiation & Integration',
    shortTitle: 'Unit 3',
    description: 'Calculus & Quadrature Rules',
    subTopics: [
      { title: 'Numerical Differentiation', link: '/numerical-differentiation' },
      {
        title: 'Numerical Integration',
        subTopics: [
          { title: 'Trapezoidal Rule', link: '/trapezoidal-Rule' },
          { title: "Simpson's 1/3 Rule", link: '/simpson-1-3-Rule' },
          { title: "Simpson's 3/8 Rule", link: '/simpson-3-8-Rule' },
          { title: "Boole's Rule", link: '/boole-Rule' },
          { title: "Weddle's Rule", link: '/weddle-Rule' },
        ],
      },
    ],
  },
  {
    id: 'unit-4',
    title: 'Unit 4: Differential Equations',
    shortTitle: 'Unit 4',
    description: 'Initial Value ODE Solvers',
    subTopics: [
      { title: "Taylor's Series Method", link: '/taylor-s-series-method' },
      { title: "Euler's Method", link: '/euler-s-method' },
      { title: "Modified Euler's Method", link: '/modified-euler-s-method' },
      { title: 'Runge-Kutta Methods', link: '/runge-kutta-method' },
    ],
  },
  {
    id: 'unit-5',
    title: 'Unit 5: Curve Fitting & Hypothesis Testing',
    shortTitle: 'Unit 5',
    description: 'Regression & Statistical Tests',
    subTopics: [
      { title: 'Method of Least Squares', link: '/least-squares' },
      { title: 'Fitting of Straight Lines', link: '/fitting-straight-lines' },
      { title: 'Fitting of Second Degree Parabola', link: '/fitting-parabola' },
      {
        title: 'Testing of Hypothesis',
        subTopics: [
          { title: 'Test of Significance (Z-test)', link: '/test-significance' },
          { title: 't-test', link: '/t-test' },
          { title: 'F-test', link: '/f-test' },
          { title: 'Chi-Square Test', link: '/chi-square' },
        ],
      },
    ],
  },
];

/**
 * Editorial Sidebar Toggle — Exact replica of original Netz menuToggle animation.
 * Uses CSS ::before/::after pseudo-elements with box-shadow middle-bar trick.
 * Yellow 3-bars (closed) → Purple X cross (open), 0.5s smooth transition.
 */
function HamburgerToggle({ isOpen, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`editorial-toggle${isOpen ? ' active' : ''}`}
      aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    />
  );
}

export default function EditorialSidebar({ className = '' }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded Accordion States for Open Mode
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState({ 'unit-2': true });
  const [expandedSubCategories, setExpandedSubCategories] = useState({ 'Interpolation for Equal Intervals': true });

  // Cascading Flyout States for Collapsed Rail Mode
  const [isRailPagesHovered, setIsRailPagesHovered] = useState(false);
  const [railActiveUnitIndex, setRailActiveUnitIndex] = useState(null);
  const [railActiveSubTopicIndex, setRailActiveSubTopicIndex] = useState(null);
  const [hoveredFlyoutItem, setHoveredFlyoutItem] = useState(null);

  const hoverTimerRef = useRef(null);

  // Clear pending hide timer
  const cancelHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Schedule close of hover menu with bridge buffer
  const scheduleHoverClose = () => {
    cancelHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      setIsRailPagesHovered(false);
      setRailActiveUnitIndex(null);
      setRailActiveSubTopicIndex(null);
    }, 280);
  };

  // Toggle unit accordion
  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  // Toggle sub-category accordion (e.g. Equal Intervals)
  const toggleSubCategory = (title) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Flatten all methods for real-time fuzzy search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    const results = [];

    UNITS_DATA.forEach(unit => {
      unit.subTopics.forEach(sub => {
        if (sub.subTopics) {
          sub.subTopics.forEach(leaf => {
            if (
              leaf.title.toLowerCase().includes(query) ||
              sub.title.toLowerCase().includes(query) ||
              unit.shortTitle.toLowerCase().includes(query)
            ) {
              results.push({
                title: leaf.title,
                link: leaf.link,
                unitTitle: unit.shortTitle,
                categoryTitle: sub.title
              });
            }
          });
        } else {
          if (
            sub.title.toLowerCase().includes(query) ||
            unit.shortTitle.toLowerCase().includes(query)
          ) {
            results.push({
              title: sub.title,
              link: sub.link,
              unitTitle: unit.shortTitle,
              categoryTitle: null
            });
          }
        }
      });
    });

    LAB_EXAMPLES.forEach(lab => {
      if (lab.title.toLowerCase().includes(query)) {
        results.push({
          title: lab.title,
          link: lab.route,
          unitTitle: 'Lab',
          categoryTitle: 'Interactive'
        });
      }
    });

    return results;
  }, [searchQuery]);

  const isActive = (route) => {
    if (!route) return false;
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname?.startsWith(route)) return true;
    return false;
  };

  // Helper to count methods in a unit
  const countMethods = (unit) => {
    let count = 0;
    unit.subTopics.forEach(sub => {
      if (sub.subTopics) count += sub.subTopics.length;
      else count += 1;
    });
    return count;
  };

  return (
    <>
      {/* Mobile Floating Toggle Button with 3-lines to X animation */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <HamburgerToggle 
          isOpen={mobileOpen} 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="shadow-lg"
        />
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 bg-[#FAF9F6] dark:bg-[#121212] border-r border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 transition-all duration-300 ease-in-out flex flex-col justify-between select-none ${
          isCollapsed ? 'w-[72px] overflow-visible' : 'w-[290px]'
        } ${mobileOpen ? 'translate-x-0 w-[290px]' : '-translate-x-full md:translate-x-0'} ${className}`}
      >
        {/* TOP BRANDING & LOGO HEADER */}
        <div className="relative border-b border-neutral-200 dark:border-neutral-800 p-3 shrink-0 overflow-hidden">
          {/* Subtle Screentone Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 editorial-dots-bg" />

          <div className="relative z-10 flex items-center gap-3">
            {/* Toggle always visible — Yellow (closed) or Purple X (open) */}
            <HamburgerToggle
              isOpen={!isCollapsed}
              onClick={() => setIsCollapsed(prev => !prev)}
            />

            {/* Branding — fades in when expanded */}
            {!isCollapsed && (
              <div className="flex flex-col justify-center min-w-0 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-base tracking-tight text-neutral-900 dark:text-white">
                    NETZ
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-700">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                  Numerical Methods & Lab
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR (Visible in expanded mode) */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1 shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search 25+ algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION BODY */}
        <div className={`flex-1 p-3 space-y-4 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden custom-notion-scrollbar'}`}>
          
          {/* SEARCH RESULTS VIEW */}
          {searchResults ? (
            <div className="space-y-2">
              <div className="px-2 text-[10px] font-mono font-bold uppercase text-neutral-400">
                Search Results ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-neutral-500">
                  No algorithms match &quot;{searchQuery}&quot;
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col p-2 rounded-lg text-xs font-mono hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                  >
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span className="px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">
                        {item.unitTitle}
                      </span>
                      {item.categoryTitle && (
                        <span className="truncate">/ {item.categoryTitle}</span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <>
              {/* ============================================================ */}
              {/* 1. PAGES / CURRICULUM TREE SECTION */}
              {/* ============================================================ */}
              <div className="space-y-1">
                {!isCollapsed ? (
                  // OPEN MODE: Deep Hierarchical Accordion Tree
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FiFolder className="w-4 h-4 text-amber-500" />
                        <span>Pages</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          5 Units
                        </span>
                        {isPagesMenuOpen ? (
                          <FiChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                        ) : (
                          <FiChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </div>
                    </button>

                    {/* Level 1: Units Accordion Dropdown List */}
                    {isPagesMenuOpen && (
                      <div className="pl-2 pt-1 space-y-1.5 border-l-2 border-neutral-300 dark:border-neutral-700 ml-3">
                        {UNITS_DATA.map((unit) => {
                          const isUnitOpen = expandedUnits[unit.id];
                          const methodCount = countMethods(unit);

                          return (
                            <div key={unit.id} className="space-y-1">
                              {/* Level 1 Button (Unit) */}
                              <button
                                type="button"
                                onClick={() => toggleUnit(unit.id)}
                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono text-left transition-all cursor-pointer ${
                                  isUnitOpen 
                                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800/50' 
                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FiLayers className={`w-3.5 h-3.5 shrink-0 ${isUnitOpen ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                                  <span className="truncate font-semibold">{unit.shortTitle}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-normal tabular-nums">
                                    {methodCount}
                                  </span>
                                  {isUnitOpen ? (
                                    <FiChevronDown className="w-3 h-3 text-neutral-400" />
                                  ) : (
                                    <FiChevronRight className="w-3 h-3 text-neutral-400" />
                                  )}
                                </div>
                              </button>

                              {/* Level 2: Sub-topics & Categories */}
                              {isUnitOpen && (
                                <div className="pl-3 space-y-1 border-l border-neutral-300 dark:border-neutral-800 ml-2 py-0.5">
                                  {unit.subTopics.map((sub, sIdx) => {
                                    if (sub.subTopics) {
                                      const isCatOpen = expandedSubCategories[sub.title];
                                      return (
                                        <div key={sIdx} className="space-y-0.5">
                                          {/* Level 2 Sub-Category Dropdown */}
                                          <button
                                            type="button"
                                            onClick={() => toggleSubCategory(sub.title)}
                                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 text-left transition-all cursor-pointer"
                                          >
                                            <div className="flex items-center gap-1.5 truncate">
                                              <FiCornerDownRight className="w-3 h-3 text-neutral-400 shrink-0" />
                                              <span className="truncate font-semibold">{sub.title}</span>
                                            </div>
                                            {isCatOpen ? (
                                              <FiChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                                            ) : (
                                              <FiChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
                                            )}
                                          </button>

                                          {/* Level 3: Leaf Algorithm Links */}
                                          {isCatOpen && (
                                            <div className="pl-4 space-y-0.5 border-l border-neutral-300/80 dark:border-neutral-800/80 ml-2 py-0.5">
                                              {sub.subTopics.map((leaf, lIdx) => {
                                                const active = pathname === leaf.link;
                                                return (
                                                  <Link
                                                    key={lIdx}
                                                    href={leaf.link}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                                                      active
                                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                                    }`}
                                                  >
                                                    <span className="truncate">{leaf.title}</span>
                                                    {leaf.isLab && (
                                                      <span className="text-[8px] font-bold px-1 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded shrink-0">
                                                        LAB
                                                      </span>
                                                    )}
                                                  </Link>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }

                                    // Direct Leaf Method
                                    const active = pathname === sub.link;
                                    return (
                                      <Link
                                        key={sIdx}
                                        href={sub.link}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                                          active
                                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                        }`}
                                      >
                                        <span className="truncate">{sub.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // ============================================================
                  // COLLAPSED RAIL MODE: Cascading Multi-Level Hover Flyout Menus
                  // ============================================================
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      cancelHoverTimer();
                      setIsRailPagesHovered(true);
                    }}
                    onMouseLeave={scheduleHoverClose}
                  >
                    {/* Rail Icon Button for Pages — with label */}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                          isRailPagesHovered
                            ? 'bg-amber-400 text-neutral-900 shadow-md scale-105'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300'
                        }`}
                      >
                        <FiFolder className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-500 tracking-wide uppercase">Pages</span>
                    </div>

                    {/* FLYOUT LEVEL 1: Units 1 to 5 List */}
                    {isRailPagesHovered && (
                      <div 
                        className="fixed left-[76px] top-16 z-50 w-52 bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-neutral-900 dark:border-neutral-600 rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                        onMouseEnter={cancelHoverTimer}
                        onMouseLeave={scheduleHoverClose}
                      >
                        {/* Bridge hitbox between rail and flyout */}
                        <div className="absolute -left-3 top-0 bottom-0 w-4 pointer-events-auto" />

                        <div className="px-2.5 py-1.5 border-b border-neutral-300 dark:border-neutral-700 font-mono font-black text-xs text-neutral-900 dark:text-white flex justify-between items-center">
                          <span className="uppercase tracking-wider">Pages</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                            5 Units
                          </span>
                        </div>

                        <div className="space-y-1 pt-1">
                          {UNITS_DATA.map((unit, uIdx) => (
                            <div
                              key={unit.id}
                              onMouseEnter={() => {
                                cancelHoverTimer();
                                setRailActiveUnitIndex(uIdx);
                                setRailActiveSubTopicIndex(null);
                              }}
                              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                                railActiveUnitIndex === uIdx
                                  ? 'bg-amber-400 text-neutral-900 font-bold shadow-sm'
                                  : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FiLayers className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                <span className="truncate font-semibold">{unit.shortTitle}</span>
                              </div>
                              <FiChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FLYOUT LEVEL 2: Sub-Topics / Categories of Selected Unit */}
                    {isRailPagesHovered && railActiveUnitIndex !== null && (
                      <div 
                        className="fixed left-[288px] top-16 z-50 w-64 bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-neutral-900 dark:border-neutral-600 rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                        onMouseEnter={cancelHoverTimer}
                        onMouseLeave={scheduleHoverClose}
                      >
                        {/* Bridge hitbox between Level 1 and Level 2 */}
                        <div className="absolute -left-3 top-0 bottom-0 w-4 pointer-events-auto" />

                        <div className="px-2.5 py-1.5 border-b border-neutral-300 dark:border-neutral-700 font-mono font-bold text-xs text-neutral-900 dark:text-white flex justify-between items-center">
                          <span className="truncate uppercase tracking-wider">{UNITS_DATA[railActiveUnitIndex].shortTitle} Topics</span>
                        </div>

                        <div className="max-h-80 overflow-y-auto space-y-1 pt-1 custom-notion-scrollbar">
                          {UNITS_DATA[railActiveUnitIndex].subTopics.map((sub, sIdx) => {
                            if (sub.subTopics) {
                              return (
                                <div
                                  key={sIdx}
                                  onMouseEnter={() => {
                                    cancelHoverTimer();
                                    setRailActiveSubTopicIndex(sIdx);
                                  }}
                                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                                    railActiveSubTopicIndex === sIdx
                                      ? 'bg-amber-400 text-neutral-900 font-bold shadow-sm'
                                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                  }`}
                                >
                                  <span className="truncate font-semibold">{sub.title}</span>
                                  <FiChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                </div>
                              );
                            }

                            // Direct method link
                            const active = pathname === sub.link;
                            return (
                              <Link
                                key={sIdx}
                                href={sub.link}
                                onClick={() => {
                                  setIsRailPagesHovered(false);
                                  setRailActiveUnitIndex(null);
                                }}
                                className={`block px-2.5 py-2 rounded-lg text-xs font-mono transition-all truncate ${
                                  active
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                {sub.title}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FLYOUT LEVEL 3: Deep Sub-Pages (e.g. Equal Intervals / Hypothesis Testing) */}
                    {isRailPagesHovered && railActiveUnitIndex !== null && railActiveSubTopicIndex !== null && (
                      <div 
                        className="fixed left-[548px] top-16 z-50 w-64 bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-neutral-900 dark:border-neutral-600 rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                        onMouseEnter={cancelHoverTimer}
                        onMouseLeave={scheduleHoverClose}
                      >
                        {/* Bridge hitbox between Level 2 and Level 3 */}
                        <div className="absolute -left-3 top-0 bottom-0 w-4 pointer-events-auto" />

                        <div className="px-2.5 py-1.5 border-b border-neutral-300 dark:border-neutral-700 font-mono font-bold text-xs text-neutral-900 dark:text-white truncate uppercase tracking-wider">
                          {UNITS_DATA[railActiveUnitIndex].subTopics[railActiveSubTopicIndex].title}
                        </div>

                        <div className="max-h-80 overflow-y-auto space-y-1 pt-1 custom-notion-scrollbar">
                          {UNITS_DATA[railActiveUnitIndex].subTopics[railActiveSubTopicIndex].subTopics.map((leaf, lIdx) => {
                            const active = pathname === leaf.link;
                            return (
                              <Link
                                key={lIdx}
                                href={leaf.link}
                                onClick={() => {
                                  setIsRailPagesHovered(false);
                                  setRailActiveUnitIndex(null);
                                  setRailActiveSubTopicIndex(null);
                                }}
                                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all ${
                                  active
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                              >
                                <span className="truncate">{leaf.title}</span>
                                {leaf.isLab && (
                                  <span className="text-[8px] font-bold px-1 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded">
                                    LAB
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* 2. PRIMARY DIRECTORY LINKS */}
              {/* ============================================================ */}
              <div className="space-y-1 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                {!isCollapsed && (
                  <div className="px-1 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                    Directory
                  </div>
                )}
                {PRIMARY_NAV.map((nav, idx) => {
                  const Icon = nav.icon;
                  const active = isActive(nav.route);
                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => isCollapsed && setHoveredFlyoutItem(nav.title)}
                      onMouseLeave={() => isCollapsed && setHoveredFlyoutItem(null)}
                    >
                      <Link
                        href={nav.route}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                          active
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                        } ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white dark:text-neutral-900' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'}`} />
                        
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span>{nav.title}</span>
                            {nav.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded">
                                {nav.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>

                      {/* Rail Flyout Tooltip */}
                      {isCollapsed && hoveredFlyoutItem === nav.title && (
                        <div className="fixed left-[76px] z-50 bg-neutral-950 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-neutral-700 animate-in fade-in duration-100">
                          {nav.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ============================================================ */}
              {/* 3. INTERACTIVE LABS SHOWCASE */}
              {/* ============================================================ */}
              <div className="space-y-1 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                {!isCollapsed && (
                  <div className="px-1 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 flex items-center gap-1.5">
                    <FiActivity className="w-3 h-3 text-emerald-500" /> Labs
                  </div>
                )}
                {LAB_EXAMPLES.map((lab, idx) => {
                  const active = pathname === lab.route;
                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => isCollapsed && setHoveredFlyoutItem(lab.title)}
                      onMouseLeave={() => isCollapsed && setHoveredFlyoutItem(null)}
                    >
                      <Link
                        href={lab.route}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                          active
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950 font-bold shadow-sm'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-800 dark:hover:text-emerald-200'
                        } ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                      >
                        <FiZap className={`w-4 h-4 shrink-0 ${active ? 'text-white dark:text-neutral-950' : 'text-emerald-500'}`} />
                        
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="truncate">{lab.title}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                              {lab.badge}
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Rail Flyout Tooltip */}
                      {isCollapsed && hoveredFlyoutItem === lab.title && (
                        <div className="fixed left-[76px] z-50 bg-emerald-950 text-emerald-200 text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-emerald-700 animate-in fade-in duration-100">
                          {lab.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

        {/* BOTTOM USER PROFILE & LINKEDIN CARD */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 shrink-0 bg-white/80 dark:bg-neutral-950/80 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0">
                    SK
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
                      <span>Sulaiman Khan</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                      Web Developer
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/suleman-khan-b4ab2b275/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 text-neutral-500 transition-colors shrink-0"
                  title="Connect on LinkedIn"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            ) : (
              <a
                href="https://www.linkedin.com/in/suleman-khan-b4ab2b275/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center"
                title="Sulaiman Khan (LinkedIn)"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs hover:scale-105 transition-transform">
                  SK
                </div>
              </a>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
