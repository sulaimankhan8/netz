# NETZ Notes Feature - Technical Architecture & Specification

## 1. Overview & Vision

The **NETZ Notes Workspace** is an interactive, block-based note-taking environment designed specifically for engineering and mathematics students. It combines Notion-style document editing with real-time **LaTeX math rendering**, **interactive calculator widgets**, **tags/filtering**, and **public/private note sharing via unique access keys**.

---

## 2. Technical Architecture & Tech Stack

```
   [NETZ Notes Component Architecture]
                  │
   ┌──────────────┼──────────────┬──────────────┐
   ▼              ▼              ▼              ▼
[Block Canvas]  [Storage]     [Share Key]    [Search Engine]
   │ (KaTeX)      │ (PWA)        │ (NETZ-XXXX)  │ (Tags & Keywords)
   ▼              ▼              ▼              ▼
LaTeX Preview   IndexedDB     Access Key     Instant Search
 & Widgets     & LocalStorage   Sharing       & Tag Filters
```

### Stack Components:
* **UI & Styling**: Next.js 16 App Router (Client Components), Tailwind CSS, Lucide / React Icons.
* **Math Rendering**: KaTeX (`katex`, `react-katex`) for crisp mathematical formula rendering ($\int_{a}^{b} f(x) dx$).
* **Storage & Persistence**: Local-First PWA architecture using `localStorage` and `IndexedDB` for instant offline availability and 0 server latency.
* **Math Computation**: Integrated `evaluateMath.js` (MathJS engine) for live widget solving inside notes.

---

## 3. Data Schema & Document Structure

Each note is represented as a structured JSON object:

```typescript
export interface NoteDocument {
  id: string;             // Unique UUID / timestamp identifier
  title: string;          // Note title (e.g. "Unit 1: Numerical Methods Notes")
  subtitle?: string;       // Subtitle / description
  tags: string[];         // Category tags (e.g. ["Numerical Methods", "Newton Raphson", "Unit 1"])
  createdAt: string;      // ISO timestamp string
  updatedAt: string;      // ISO timestamp string
  isPublic: boolean;      // Public / Private toggle
  accessKey: string;      // Unique 8-character key (e.g. "NETZ-8X42")
  author: string;         // Author name or "Anonymous Student"
  blocks: NoteBlock[];    // Array of block items
}

export type BlockType = 
  | 'heading1' 
  | 'heading2' 
  | 'paragraph' 
  | 'math' 
  | 'callout' 
  | 'widget';

export interface NoteBlock {
  id: string;
  type: BlockType;
  content: string;         // Text or LaTeX string (e.g. "f(x) = x^3 - 4x - 9")
  widgetConfig?: {         // Configuration for embedded interactive solvers
    algorithmType: string; // 'newton-raphson' | 'bisection' | 't-test'
    expression: string;
    params: Record<string, any>;
  };
}
```

---

## 4. Feature & UI Breakdown

### A. Document Navigator & Sidebar
* **Create Note Button**: Instant creation of blank structured notes with default starter templates ("Calculus Lecture Notes", "Hypothesis Testing Lab", "Blank Note").
* **Live Search Bar**: Instant filtering by note title, text content, or specific tags.
* **Tag Pills Filter**: Quick clickable filters (e.g. `#Statistics`, `#NumericalMethods`, `#DiffEq`).
* **Tab Switcher**: Toggle between **My Notes** (Local/Private) and **Community Notes** (Public/Shared).

### B. Block Editor Canvas
* **Dynamic Block Controls**:
  * **H1 / H2 Headings**: Section titles.
  * **Text Paragraphs**: Rich text body.
  * **LaTeX Math Blocks**: Live KaTeX rendering of complex math equations.
  * **Callout Cards**: Highlighted tip/warning notes for exam revisions.
  * **Embedded Math Widgets**: Interactive inline calculator where users can execute calculations directly inside their notes!

### C. Sharing & Key Generator
* **Public/Private Toggle**: Switch visibility at any time.
* **Unique Access Key Generator**: Generates clean share keys (e.g. `NETZ-7B91`) allowing users to copy, paste, and import shared notes across devices.
* **Export Options**: Export note to formatted Markdown (`.md`) or printable text.

---

## 5. File Structure for Notes Feature

```
src/app/(Primary.pages)/Notes/
├── page.js                     # Main Notes Workspace Container & Layout
├── components/
│   ├── NoteSidebar.js          # Document Navigator, Search & Tag Filter
│   ├── NoteEditor.js           # Block Canvas & Title / Tag Toolbar
│   ├── NoteBlockItem.js        # Individual Block Renderer (Heading, Text, KaTeX, Widget)
│   ├── NoteShareModal.js       # Access Key Generator & Import Modal
│   └── EmbeddedMathWidget.js   # Interactive solver widget embedded in note
└── utils/
    ├── noteStorage.js          # LocalStorage CRUD operations & default notes
    └── sampleNotes.js          # Pre-built educational study templates
```
