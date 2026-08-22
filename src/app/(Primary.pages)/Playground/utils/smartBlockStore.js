/**
 * Smart Block Command/Delta State Store
 * Manages Smart Blocks, Block Links, and Command/Delta Undo/Redo stack.
 * Bypasses 5MB localStorage caps by persisting workspace sessions to IndexedDB.
 */

const INDEXEDDB_DB_NAME = 'NETZ_PLAYGROUND_DB';
const INDEXEDDB_STORE_NAME = 'sessions';

// IndexedDB Helper
export function saveSessionToIndexedDB(sessionId, sessionData) {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  const request = window.indexedDB.open(INDEXEDDB_DB_NAME, 1);
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(INDEXEDDB_STORE_NAME)) {
      db.createObjectStore(INDEXEDDB_STORE_NAME, { keyPath: 'sessionId' });
    }
  };

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction(INDEXEDDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(INDEXEDDB_STORE_NAME);
    store.put({ sessionId, ...sessionData, updatedAt: Date.now() });
  };
}

export function loadSessionFromIndexedDB(sessionId, callback) {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  const request = window.indexedDB.open(INDEXEDDB_DB_NAME, 1);
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(INDEXEDDB_STORE_NAME)) {
      db.createObjectStore(INDEXEDDB_STORE_NAME, { keyPath: 'sessionId' });
    }
  };

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction(INDEXEDDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(INDEXEDDB_STORE_NAME);
    const getReq = store.get(sessionId);

    getReq.onsuccess = () => {
      if (getReq.result && callback) {
        callback(getReq.result);
      }
    };
  };
}

export const INITIAL_SMART_BLOCK_STATE = {
  blocks: [],
  links: [],
  history: [], // Stack of Command Deltas
  historyIndex: -1,
};

export function smartBlockReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION': {
      return {
        ...state,
        blocks: action.payload.blocks || [],
        links: action.payload.links || [],
      };
    }

    case 'ADD_BLOCK': {
      const newBlocks = [...state.blocks, action.payload];
      return {
        ...state,
        blocks: newBlocks,
        history: [...state.history.slice(0, state.historyIndex + 1), { type: 'ADD_BLOCK', payload: action.payload }],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_BLOCK': {
      const blockId = action.payload;
      const targetBlock = state.blocks.find((b) => b.blockId === blockId);
      const newBlocks = state.blocks.filter((b) => b.blockId !== blockId);
      const newLinks = state.links.filter((l) => l.sourceBlockId !== blockId && l.targetBlockId !== blockId);

      return {
        ...state,
        blocks: newBlocks,
        links: newLinks,
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          { type: 'REMOVE_BLOCK', payload: { block: targetBlock, links: state.links } },
        ],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_BLOCK_POSITION': {
      const { blockId, position } = action.payload;
      const newBlocks = state.blocks.map((b) =>
        b.blockId === blockId ? { ...b, position } : b
      );

      return {
        ...state,
        blocks: newBlocks,
      };
    }

    case 'UPDATE_BLOCK_SIZE': {
      const { blockId, size } = action.payload;
      const newBlocks = state.blocks.map((b) =>
        b.blockId === blockId ? { ...b, size } : b
      );

      return {
        ...state,
        blocks: newBlocks,
      };
    }

    case 'UPDATE_BLOCK_CONTENT': {
      const { blockId, content } = action.payload;
      const newBlocks = state.blocks.map((b) =>
        b.blockId === blockId ? { ...b, content: { ...b.content, ...content } } : b
      );

      return {
        ...state,
        blocks: newBlocks,
      };
    }

    case 'LINK_BLOCKS': {
      const { sourceBlockId, targetBlockId, type = 'equation-to-graph', color = '#3B82F6' } = action.payload;
      const linkId = `link_${sourceBlockId}_${targetBlockId}`;

      // Check if link already exists
      if (state.links.some((l) => l.linkId === linkId)) return state;

      const newLink = { linkId, sourceBlockId, targetBlockId, type, color };
      const newLinks = [...state.links, newLink];

      // Update linkedBlockIds on blocks
      const newBlocks = state.blocks.map((b) => {
        if (b.blockId === sourceBlockId && !b.linkedBlockIds.includes(targetBlockId)) {
          return { ...b, linkedBlockIds: [...b.linkedBlockIds, targetBlockId] };
        }
        if (b.blockId === targetBlockId && !b.linkedBlockIds.includes(sourceBlockId)) {
          return { ...b, linkedBlockIds: [...b.linkedBlockIds, sourceBlockId] };
        }
        return b;
      });

      return {
        ...state,
        blocks: newBlocks,
        links: newLinks,
      };
    }

    case 'UNLINK_BLOCKS': {
      const { linkId } = action.payload;
      const targetLink = state.links.find((l) => l.linkId === linkId);
      if (!targetLink) return state;

      const newLinks = state.links.filter((l) => l.linkId !== linkId);
      const newBlocks = state.blocks.map((b) => {
        if (b.blockId === targetLink.sourceBlockId) {
          return { ...b, linkedBlockIds: b.linkedBlockIds.filter((id) => id !== targetLink.targetBlockId) };
        }
        if (b.blockId === targetLink.targetBlockId) {
          return { ...b, linkedBlockIds: b.linkedBlockIds.filter((id) => id !== targetLink.sourceBlockId) };
        }
        return b;
      });

      return {
        ...state,
        blocks: newBlocks,
        links: newLinks,
      };
    }

    default:
      return state;
  }
}
