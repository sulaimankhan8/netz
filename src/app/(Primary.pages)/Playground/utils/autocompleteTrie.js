/**
 * autocompleteTrie.js
 *
 * Production-grade in-memory Trie, IndexedDB-backed dictionary cache, and
 * frequency+recency-ranked "recently used words" engine for ghost-text
 * autocomplete.
 *
 * Source dictionary: https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_alpha.txt
 *
 * Design goals for this revision:
 *  - No unbounded global mutable state: everything lives on an AutocompleteEngine
 *    instance. A default singleton is still exported so this remains a
 *    drop-in replacement for the previous module-level API.
 *  - Resilient network I/O: fetch has a timeout, retry with backoff, and
 *    response validation (won't silently adopt a truncated/corrupt file).
 *  - Resilient storage I/O: IndexedDB wrapper handles blocked/upgrade/quota
 *    errors and degrades to in-memory-only mode instead of throwing.
 *  - Observability: engine emits lifecycle events (ready/error/progress) so
 *    host apps can show loading states or report to telemetry instead of
 *    polling a boolean.
 *  - Input hardening: word length caps, character validation, prefix length
 *    caps, and a real bounded queue for BFS (no Array#shift O(n) churn).
 *  - Cross-tab consistency: recent-word writes are broadcast so multiple
 *    open tabs don't clobber each other's LRU cache with last-write-wins.
 *  - Configurable: all constants can be overridden per-instance instead of
 *    hardcoded, and a pluggable logger replaces bare console.warn calls.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** @typedef {{ debug: Function, info: Function, warn: Function, error: Function }} Logger */

const DEFAULT_CONFIG = Object.freeze({
  dbName: 'netz_autocomplete_db',
  dbVersion: 2,
  storeName: 'dictionary_cache',
  cacheKey: 'english_words_alpha',
  trieCacheKey: 'english_trie_serialized',
  recentWordsKey: 'recent_words_list',
  maxRecentWords: 5000,
  cacheTtlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  dictionaryUrl:
    'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_alpha.txt',
  fetchTimeoutMs: 15000,
  fetchMaxRetries: 2,
  fetchRetryBaseDelayMs: 500,
  minAcceptableWordCount: 50000, // sanity floor to reject a truncated/corrupt download
  maxWordLength: 45, // longest real English word is ~45 chars; guards against garbage input
  minWordLength: 1,
  maxPrefixLength: 64, // guards against pathological input to getGhostSuggestion
  chunkSize: 20000,
  recentWordsSaveDebounceMs: 1000,
  // Unicode-aware by default so accented words (e.g. "café", "naïve") work.
  // Set to false to restore the original ASCII-only [a-zA-Z]+ behavior.
  unicodeAware: true,
});

const noopLogger = { debug() {}, info() {}, warn() {}, error() {} };

/** @returns {Logger} */
function makeLogger(custom) {
  if (!custom) return { ...noopLogger, warn: console.warn.bind(console), error: console.error.bind(console) };
  return { ...noopLogger, ...custom };
}

// ---------------------------------------------------------------------------
// Minimal event emitter (avoids pulling in a dependency, keeps this a
// zero-dependency module while still giving host apps something to
// subscribe to instead of polling isReady()).
// ---------------------------------------------------------------------------

class TinyEmitter {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }
  on(event, fn) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    this._listeners.get(event)?.delete(fn);
  }
  emit(event, payload) {
    for (const fn of this._listeners.get(event) || []) {
      try {
        fn(payload);
      } catch (err) {
        // Listener errors must never break the engine.
        console.error(`[AutocompleteTrie] listener for "${event}" threw:`, err);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Trie
// ---------------------------------------------------------------------------

class TrieNode {
  constructor() {
    /** @type {Map<string, TrieNode>} */
    this.children = new Map();
    this.isWord = false;
    this.word = null;
  }
}

export class AutocompleteTrie {
  /** @param {{ maxWordLength?: number, minWordLength?: number }} [opts] */
  constructor(opts = {}) {
    this.root = new TrieNode();
    this.wordCount = 0;
    this.maxWordLength = opts.maxWordLength ?? DEFAULT_CONFIG.maxWordLength;
    this.minWordLength = opts.minWordLength ?? DEFAULT_CONFIG.minWordLength;
  }

  insert(word) {
    if (!word || typeof word !== 'string') return false;
    const cleanWord = word.trim().toLowerCase();
    if (
      cleanWord.length < this.minWordLength ||
      cleanWord.length > this.maxWordLength
    ) {
      return false;
    }

    let node = this.root;
    for (let i = 0; i < cleanWord.length; i++) {
      const ch = cleanWord[i];
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    if (!node.isWord) {
      node.isWord = true;
      node.word = cleanWord;
      this.wordCount++;
    }
    return true;
  }

  /** @returns {number} number of words actually inserted (invalid entries are skipped, not thrown) */
  insertBatch(wordList) {
    let inserted = 0;
    for (let i = 0; i < wordList.length; i++) {
      if (this.insert(wordList[i])) inserted++;
    }
    return inserted;
  }

  /**
   * Bounded-queue BFS prefix search. Uses a head-pointer array instead of
   * Array#shift() (which is O(n) per call and made the original
   * implementation O(n^2) in the worst case for wide subtrees).
   */
  startsWith(prefix, limit = 5) {
    if (!prefix || typeof prefix !== 'string') return [];
    const cleanPrefix = prefix.trim().toLowerCase();
    if (!cleanPrefix) return [];

    let node = this.root;
    for (let i = 0; i < cleanPrefix.length; i++) {
      const next = node.children.get(cleanPrefix[i]);
      if (!next) return [];
      node = next;
    }

    const results = [];
    const queue = [node];
    let head = 0;
    // Hard cap on nodes visited so a pathological/adversarial prefix (or a
    // corrupted trie) can't turn a UI keystroke handler into a long-running loop.
    const maxVisits = Math.max(5000, limit * 500);
    let visited = 0;

    while (head < queue.length && results.length < limit && visited < maxVisits) {
      const cur = queue[head++];
      visited++;
      if (cur.isWord && cur.word !== cleanPrefix) {
        results.push(cur.word);
      }
      for (const child of cur.children.values()) {
        queue.push(child);
      }
    }
    return results;
  }

  /** Nested plain-object serialization. Depth is bounded by max word length, so recursion is safe. */
  serialize() {
    function serializeNode(node) {
      const obj = {};
      if (node.isWord) obj['$'] = node.word;
      for (const [ch, child] of node.children.entries()) {
        obj[ch] = serializeNode(child);
      }
      return obj;
    }
    return serializeNode(this.root);
  }

  deserialize(serializedRoot) {
    if (!serializedRoot || typeof serializedRoot !== 'object') {
      throw new Error('Invalid serialized trie payload');
    }
    let nodeCount = 0;
    const maxNodes = 5_000_000; // guard against a corrupted/malicious cache blob
    function deserializeNode(obj) {
      if (++nodeCount > maxNodes) throw new Error('Serialized trie exceeds safety limit');
      const node = new TrieNode();
      if (!obj) return node;
      if (obj['$']) {
        node.isWord = true;
        node.word = obj['$'];
      }
      for (const key of Object.keys(obj)) {
        if (key !== '$') node.children.set(key, deserializeNode(obj[key]));
      }
      return node;
    }
    this.root = deserializeNode(serializedRoot);
  }
}

// ---------------------------------------------------------------------------
// IndexedDB wrapper: connection reuse, structured errors, graceful
// degradation instead of throwing into caller code.
// ---------------------------------------------------------------------------

class IdbStore {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    /** @type {Promise<IDBDatabase>|null} */
    this._dbPromise = null;
    this.available = typeof window !== 'undefined' && !!window.indexedDB;
  }

  _open() {
    if (!this.available) return Promise.reject(new Error('IndexedDB not supported'));
    if (this._dbPromise) return this._dbPromise;

    this._dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.config.dbName, this.config.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          db.createObjectStore(this.config.storeName, { keyPath: 'key' });
        }
      };
      request.onblocked = () => {
        this.logger.warn('[AutocompleteTrie] IndexedDB open blocked by another tab; continuing in-memory only for this session.');
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          // Another tab is upgrading the DB; release our handle so it can proceed.
          db.close();
          this._dbPromise = null;
        };
        resolve(db);
      };
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    }).catch((err) => {
      this._dbPromise = null;
      throw err;
    });

    return this._dbPromise;
  }

  async get(key) {
    if (!this.available) return null;
    try {
      const db = await this._open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction([this.config.storeName], 'readonly');
        const store = tx.objectStore(this.config.storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      this.logger.warn(`[AutocompleteTrie] IDB read failed for "${key}":`, err);
      return null;
    }
  }

  async set(key, data) {
    if (!this.available) return false;
    try {
      const db = await this._open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction([this.config.storeName], 'readwrite');
        const store = tx.objectStore(this.config.storeName);
        const req = store.put({ key, ...data });
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      const isQuotaError = err && (err.name === 'QuotaExceededError' || err.name === 'QuotaExceededErrorLegacy');
      if (isQuotaError) {
        this.logger.warn(`[AutocompleteTrie] IDB quota exceeded writing "${key}"; skipping persistence for this session.`);
      } else {
        this.logger.warn(`[AutocompleteTrie] IDB write failed for "${key}":`, err);
      }
      return false;
    }
  }
}

// ---------------------------------------------------------------------------
// Networking: timeout + retry with exponential backoff + response validation
// ---------------------------------------------------------------------------

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDictionaryWithRetry(config, logger) {
  let lastError = null;
  for (let attempt = 0; attempt <= config.fetchMaxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(config.dictionaryUrl, config.fetchTimeoutMs);
      if (!response.ok) {
        throw new Error(`Dictionary fetch failed with status ${response.status}`);
      }
      const text = await response.text();
      const words = text
        .split(/\r?\n/)
        .map((w) => w.trim())
        .filter(Boolean);

      if (words.length < config.minAcceptableWordCount) {
        throw new Error(
          `Dictionary fetch returned suspiciously few words (${words.length}); rejecting as likely truncated/corrupt.`
        );
      }
      return words;
    } catch (err) {
      lastError = err;
      logger.warn(`[AutocompleteTrie] Dictionary fetch attempt ${attempt + 1} failed:`, err);
      if (attempt < config.fetchMaxRetries) {
        await delay(config.fetchRetryBaseDelayMs * 2 ** attempt);
      }
    }
  }
  throw lastError || new Error('Dictionary fetch failed');
}

// ---------------------------------------------------------------------------
// Non-blocking chunked insertion
// ---------------------------------------------------------------------------

function insertWordsInChunks(words, trie, chunkSize) {
  return new Promise((resolve) => {
    let index = 0;
    const total = words.length;

    function processChunk(deadline) {
      const startTime = performance.now();
      while (
        index < total &&
        (deadline ? deadline.timeRemaining() > 1 : performance.now() - startTime < 12)
      ) {
        const end = Math.min(index + chunkSize, total);
        for (; index < end; index++) trie.insert(words[index]);
      }
      if (index < total) {
        if (typeof window !== 'undefined' && window.requestIdleCallback) {
          window.requestIdleCallback(processChunk);
        } else {
          setTimeout(processChunk, 0);
        }
      } else {
        resolve();
      }
    }

    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(processChunk);
    } else {
      setTimeout(processChunk, 0);
    }
  });
}

// Instant seed list of common English words for frame-0 readiness, before
// IndexedDB/network have had a chance to resolve.
const INITIAL_SEED_WORDS = [
  'about', 'above', 'accept', 'account', 'across', 'action', 'activity', 'actually', 'address', 'admin',
  'after', 'again', 'against', 'agency', 'agent', 'agree', 'agreement', 'ahead', 'allow', 'almost',
  'alone', 'along', 'already', 'also', 'although', 'always', 'american', 'among', 'amount', 'analysis',
  'animal', 'another', 'answer', 'anyone', 'anything', 'appear', 'apply', 'approach', 'area', 'argue',
  'around', 'arrive', 'article', 'artist', 'assume', 'attack', 'attention', 'author', 'authority', 'available',
  'avoid', 'beautiful', 'because', 'become', 'before', 'begin', 'behavior', 'behind', 'believe', 'benefit',
  'better', 'between', 'beyond', 'billion', 'board', 'brother', 'budget', 'building', 'business', 'camera',
  'campaign', 'cancer', 'candidate', 'capital', 'career', 'century', 'certain', 'certainly', 'chair', 'challenge',
  'chance', 'change', 'character', 'charge', 'check', 'child', 'choice', 'choose', 'church', 'citizen',
  'classroom', 'clearly', 'college', 'commercial', 'common', 'community', 'company', 'compare', 'computer', 'concern',
  'condition', 'conference', 'consider', 'consumer', 'contain', 'continue', 'control', 'cost', 'could', 'country',
  'couple', 'course', 'court', 'create', 'culture', 'current', 'customer', 'daughter', 'decision', 'defense',
  'degree', 'democrat', 'describe', 'design', 'despite', 'detail', 'determine', 'develop', 'development', 'difference',
  'different', 'difficult', 'direction', 'director', 'discover', 'discuss', 'discussion', 'disease', 'doctor', 'during',
  'economic', 'economy', 'education', 'effect', 'effort', 'eight', 'either', 'election', 'employee', 'energy',
  'enough', 'entire', 'environment', 'environmental', 'especially', 'establish', 'evening', 'everybody', 'everyone', 'everything',
  'evidence', 'exactly', 'example', 'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'factor',
  'family', 'father', 'federal', 'feeling', 'fellow', 'figure', 'financial', 'finger', 'finish', 'flight',
  'flower', 'follow', 'foreign', 'forest', 'forget', 'former', 'forward', 'friend', 'future', 'general',
  'generation', 'government', 'growth', 'happen', 'health', 'history', 'hospital', 'however', 'identify', 'impact',
  'important', 'improve', 'include', 'including', 'increase', 'indicate', 'individual', 'industry', 'information', 'inside',
  'instead', 'institution', 'interest', 'interesting', 'international', 'interview', 'investment', 'involve', 'knowledge', 'language',
  'leader', 'leadership', 'learning', 'letter', 'likely', 'listen', 'little', 'location', 'machine', 'magazine',
  'maintain', 'majority', 'management', 'manager', 'market', 'marriage', 'material', 'matter', 'measure', 'media',
  'medical', 'meeting', 'member', 'memory', 'mention', 'message', 'method', 'middle', 'military', 'million',
  'minute', 'mission', 'modern', 'moment', 'money', 'month', 'morning', 'mother', 'mouth', 'movement',
  'nation', 'national', 'natural', 'nature', 'nearly', 'necessary', 'network', 'newspaper', 'nothing', 'number',
  'object', 'operation', 'opportunity', 'option', 'organization', 'others', 'outside', 'parent', 'participant', 'particular',
  'particularly', 'partner', 'patient', 'pattern', 'people', 'perceive', 'perform', 'performance', 'perhaps', 'period',
  'person', 'personal', 'phone', 'physical', 'picture', 'player', 'police', 'policy', 'political', 'politics',
  'popular', 'population', 'position', 'positive', 'possible', 'practice', 'prepare', 'present', 'president', 'pressure',
  'pretty', 'prevent', 'private', 'probably', 'problem', 'process', 'produce', 'product', 'production', 'professional',
  'professor', 'program', 'project', 'property', 'protect', 'prove', 'provide', 'public', 'purpose', 'question',
  'quickly', 'rather', 'reach', 'ready', 'reality', 'realize', 'really', 'reason', 'receive', 'recent',
  'recently', 'recognize', 'record', 'reduce', 'reflect', 'region', 'relate', 'relations', 'relationship', 'religious',
  'remain', 'remember', 'remove', 'report', 'represent', 'require', 'research', 'resource', 'respond', 'response',
  'responsibility', 'result', 'return', 'reveal', 'school', 'science', 'scientist', 'section', 'security', 'segment',
  'service', 'several', 'shoulder', 'significant', 'similar', 'simple', 'simply', 'situation', 'society', 'soldier',
  'somebody', 'someone', 'something', 'sometimes', 'source', 'southern', 'special', 'specific', 'specifically', 'speech',
  'standard', 'statement', 'station', 'strategy', 'street', 'strong', 'structure', 'student', 'study', 'stuff',
  'subject', 'success', 'successful', 'suddenly', 'suggest', 'support', 'surface', 'system', 'teacher', 'technology',
  'television', 'theory', 'thought', 'thousand', 'through', 'throughout', 'together', 'tonight', 'toward', 'traditional',
  'training', 'travel', 'treatment', 'understand', 'understanding', 'university', 'various', 'victim', 'violence', 'weapon',
  'whatever', 'whether', 'window', 'without', 'worker', 'working', 'writer', 'writing', 'yellow', 'yourself',
];

// Common chat/internet abbreviations and short informal words. These are
// deliberately NOT in formal dictionaries like words_alpha.txt, so without
// seeding them explicitly, typing "brb" will only ever suggest real
// dictionary words ("bro", "bring", ...) and never "brb" itself.
const COMMON_ABBREVIATIONS = [
  'brb', 'btw', 'lol', 'lmao', 'omg', 'idk', 'imo', 'imho', 'tbh', 'ttyl',
  'np', 'nvm', 'afaik', 'irl', 'faq', 'diy', 'rsvp', 'eta', 'aka', 'asap',
  'fyi', 'fwiw', 'iirc', 'jk', 'wfh', 'ooo', 'dm', 'gg', 'thx', 'pls',
  'gr8', 'wyd', 'hbu', 'ily', 'smh', 'tmi', 'ftw', 'yolo', 'rn', 'cya',
];

// ---------------------------------------------------------------------------
// Next-word (bigram) prediction: baseline model + personalization
// ---------------------------------------------------------------------------

/**
 * Small curated baseline of common English word -> likely-next-word
 * transitions, ordered most-likely-first. This exists purely so next-word
 * prediction isn't blank on a brand-new session before any personal
 * typing history has accumulated. It intentionally covers high-frequency
 * function words rather than trying to be exhaustive — a full n-gram
 * corpus is out of scope for a lightweight client-side engine, and
 * personalization (below) is what actually makes suggestions feel sharp
 * for a given user.
 */
const BASELINE_BIGRAMS = {
  i: ['am', 'think', 'have', 'was', 'll'],
  you: ['are', 'can', 'have', 'll', 'know'],
  he: ['is', 'was', 'said', 'has'],
  she: ['is', 'was', 'said', 'has'],
  we: ['are', 'have', 'need', 'should'],
  they: ['are', 'have', 'were', 'will'],
  it: ['is', 'was', 'would', 's'],
  the: ['same', 'first', 'best', 'only', 'most'],
  a: ['few', 'lot', 'little', 'new', 'good'],
  to: ['be', 'the', 'get', 'see', 'do'],
  of: ['the', 'a', 'this', 'course'],
  in: ['the', 'a', 'this', 'order', 'fact'],
  on: ['the', 'a', 'this', 'my'],
  for: ['the', 'a', 'example', 'your', 'this'],
  with: ['the', 'a', 'you', 'my'],
  is: ['a', 'the', 'not', 'this'],
  was: ['a', 'the', 'not', 'going'],
  will: ['be', 'not', 'have', 'need'],
  can: ['be', 'you', 'i', 'also'],
  have: ['a', 'to', 'been', 'the'],
  and: ['the', 'i', 'then', 'a'],
  that: ['is', 'was', 'the', 'you'],
  this: ['is', 'was', 'means', 'will'],
  as: ['well', 'soon', 'a', 'the'],
  so: ['i', 'that', 'much', 'far'],
  just: ['a', 'the', 'in', 'want'],
  let: ['me', 'us', 's'],
  please: ['let', 'find', 'note', 'see'],
  thank: ['you'],
  looking: ['forward', 'for', 'at'],
  thanks: ['for', 'a', 'again'],
};

/**
 * Tracks (previousWord -> nextWord) frequency from the user's own typing,
 * persisted to IndexedDB, capped in size, and merged on top of the
 * baseline model at query time (personal history wins ties).
 */
class BigramModel {
  constructor(config, idb, logger) {
    this.config = config;
    this.idb = idb;
    this.logger = logger;
    /** @type {Map<string, Map<string, number>>} */
    this.contexts = new Map();
    this._saveTimer = null;
    this._channel = null;
    this._loaded = false;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this._channel = new BroadcastChannel(`${config.dbName}:bigram_model`);
        this._channel.onmessage = (ev) => {
          if (ev?.data?.type === 'bigram' && ev.data.prev && ev.data.next) {
            this._bump(ev.data.prev, ev.data.next, { broadcast: false });
          }
        };
      } catch (err) {
        this.logger.warn('[AutocompleteTrie] BroadcastChannel unavailable for bigram model:', err);
      }
    }
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const flush = () => this._flushNow();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush();
      });
      window.addEventListener('pagehide', flush);
    }
  }

  async load() {
    if (this._loaded) return;
    try {
      const res = await this.idb.get('bigram_model');
      if (res && Array.isArray(res.entries)) {
        for (const [prev, nextCounts] of res.entries) {
          this.contexts.set(prev, new Map(nextCounts));
        }
      }
    } catch (err) {
      this.logger.warn('[AutocompleteTrie] Failed to load bigram model:', err);
    } finally {
      this._loaded = true;
    }
  }

  record(prevWord, nextWord) {
    if (!prevWord || !nextWord) return;
    this._bump(prevWord, nextWord, { broadcast: true });
  }

  _bump(prevWord, nextWord, { broadcast }) {
    const maxContexts = this.config.maxBigramContexts ?? 3000;
    const maxNextPerContext = this.config.maxNextWordsPerContext ?? 8;

    let nextMap = this.contexts.get(prevWord);
    if (!nextMap) {
      if (this.contexts.size >= maxContexts) {
        // Evict the least-recently-touched context (Map preserves insertion order).
        const oldestKey = this.contexts.keys().next().value;
        if (oldestKey !== undefined) this.contexts.delete(oldestKey);
      }
      nextMap = new Map();
      this.contexts.set(prevWord, nextMap);
    } else {
      // Re-insert to mark as recently touched (for the eviction policy above).
      this.contexts.delete(prevWord);
      this.contexts.set(prevWord, nextMap);
    }

    nextMap.set(nextWord, (nextMap.get(nextWord) || 0) + 1);
    if (nextMap.size > maxNextPerContext) {
      const sorted = [...nextMap.entries()].sort((a, b) => b[1] - a[1]);
      nextMap.clear();
      for (const [w, c] of sorted.slice(0, maxNextPerContext)) nextMap.set(w, c);
    }

    this._scheduleSave();
    if (broadcast && this._channel) {
      try {
        this._channel.postMessage({ type: 'bigram', prev: prevWord, next: nextWord });
      } catch {
        // Best-effort only.
      }
    }
  }

  /**
   * Returns up to `limit` likely next words for `prevWord`. Personal
   * history is merged on top of (and ranked above) the baseline model.
   */
  suggest(prevWord, limit = 1) {
    if (!prevWord) return [];
    const personal = this.contexts.get(prevWord);
    const personalSorted = personal
      ? [...personal.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w)
      : [];

    if (personalSorted.length >= limit) return personalSorted.slice(0, limit);

    const baseline = BASELINE_BIGRAMS[prevWord] || [];
    const merged = [...personalSorted];
    for (const w of baseline) {
      if (!merged.includes(w)) merged.push(w);
      if (merged.length >= limit) break;
    }
    return merged.slice(0, limit);
  }

  _scheduleSave() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._flushNow(), this.config.recentWordsSaveDebounceMs);
  }

  _flushNow() {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    const entries = [...this.contexts.entries()].map(([prev, nextMap]) => [prev, [...nextMap.entries()]]);
    this.idb.set('bigram_model', { entries, updatedAt: Date.now() });
  }

  dispose() {
    this._flushNow();
    this._channel?.close?.();
  }
}

// ---------------------------------------------------------------------------
// Recently used words: frequency + recency ranking, cross-tab sync
// ---------------------------------------------------------------------------

class RecentWordsManager {
  constructor(config, idb, logger) {
    this.config = config;
    this.idb = idb;
    this.logger = logger;
    this.trie = new AutocompleteTrie({ maxWordLength: config.maxWordLength, minWordLength: 2 });
    /** @type {Map<string, { count: number, lastUsedAt: number }>} */
    this.stats = new Map();
    /** @type {string[]} most-recent-first list, capped at maxRecentWords */
    this.order = [];
    this._saveTimer = null;
    this._channel = null;
    this._loaded = false;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this._channel = new BroadcastChannel(`${config.dbName}:${config.recentWordsKey}`);
        this._channel.onmessage = (ev) => {
          if (ev?.data?.type === 'record' && typeof ev.data.word === 'string') {
            this._applyRecord(ev.data.word, { broadcast: false });
          }
        };
      } catch (err) {
        this.logger.warn('[AutocompleteTrie] BroadcastChannel unavailable, cross-tab sync disabled:', err);
      }
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const flush = () => this._flushNow();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush();
      });
      window.addEventListener('pagehide', flush);
    }
  }

  async load() {
    if (this._loaded) return;
    try {
      const res = await this.idb.get(this.config.recentWordsKey);
      if (res && Array.isArray(res.words)) {
        this.order = res.words.slice(0, this.config.maxRecentWords);
        const now = Date.now();
        for (let i = 0; i < this.order.length; i++) {
          // Earlier entries in the persisted list are more recent; seed stats
          // with a decaying synthetic timestamp/count so ranking is sane
          // immediately after load, before any new activity happens.
          this.stats.set(this.order[i], { count: 1, lastUsedAt: now - i });
        }
        this.trie.insertBatch(this.order);
      }
    } catch (err) {
      this.logger.warn('[AutocompleteTrie] Failed to load recent words:', err);
    } finally {
      this._loaded = true;
    }
  }

  record(word) {
    if (!word || typeof word !== 'string') return;
    const clean = word.trim().toLowerCase();
    if (clean.length < 2 || clean.length > this.config.maxWordLength) return;
    this._applyRecord(clean, { broadcast: true });
  }

  _applyRecord(clean, { broadcast }) {
    this.trie.insert(clean);

    const existing = this.stats.get(clean);
    this.stats.set(clean, {
      count: (existing?.count || 0) + 1,
      lastUsedAt: Date.now(),
    });

    const idx = this.order.indexOf(clean);
    if (idx !== -1) this.order.splice(idx, 1);
    this.order.unshift(clean);
    if (this.order.length > this.config.maxRecentWords) {
      const evicted = this.order.splice(this.config.maxRecentWords);
      for (const w of evicted) this.stats.delete(w);
    }

    this._scheduleSave();

    if (broadcast && this._channel) {
      try {
        this._channel.postMessage({ type: 'record', word: clean });
      } catch {
        // Non-fatal: cross-tab sync is best-effort.
      }
    }
  }

  /** Ranks by recency-weighted frequency rather than pure LRU order. */
  suggest(prefix, limit = 1) {
    const candidates = this.trie.startsWith(prefix, Math.max(limit * 5, 10));
    if (candidates.length <= 1) return candidates.slice(0, limit);

    const now = Date.now();
    const scored = candidates.map((word) => {
      const s = this.stats.get(word);
      const recencyMs = s ? now - s.lastUsedAt : Infinity;
      // Simple decay: recent + frequent wins. Half-life-ish weighting.
      const recencyScore = 1 / (1 + recencyMs / (60 * 60 * 1000)); // hours
      const freqScore = Math.log2((s?.count || 1) + 1);
      return { word, score: recencyScore * 0.7 + freqScore * 0.3 };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.word);
  }

  _scheduleSave() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._flushNow(), this.config.recentWordsSaveDebounceMs);
  }

  _flushNow() {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    // Fire-and-forget; IdbStore already swallows/logs its own errors.
    this.idb.set(this.config.recentWordsKey, { words: this.order, updatedAt: Date.now() });
  }

  dispose() {
    this._flushNow();
    this._channel?.close?.();
  }
}

// ---------------------------------------------------------------------------
// Engine: ties everything together, owns lifecycle state, emits events.
// ---------------------------------------------------------------------------

export const AutocompleteState = Object.freeze({
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
});

export class AutocompleteEngine {
  /**
   * @param {Partial<typeof DEFAULT_CONFIG>} [configOverrides]
   * @param {Logger} [logger]
   */
  constructor(configOverrides = {}, logger = null) {
    this.config = { ...DEFAULT_CONFIG, ...configOverrides };
    this.logger = makeLogger(logger);
    this.emitter = new TinyEmitter();

    this.idb = new IdbStore(this.config, this.logger);
    this.globalTrie = new AutocompleteTrie({ maxWordLength: this.config.maxWordLength });
    this.globalTrie.insertBatch(INITIAL_SEED_WORDS);
    this.globalTrie.insertBatch(COMMON_ABBREVIATIONS);
    this.recentWords = new RecentWordsManager(this.config, this.idb, this.logger);
    this.bigramModel = new BigramModel(this.config, this.idb, this.logger);

    this.state = AutocompleteState.IDLE;
    this.lastError = null;
    this._initPromise = null;
    // Tracks the last completed word so recordRecentWord() calls, which the
    // host app fires in typing order, can be turned into (prev -> next)
    // bigram observations automatically without any extra integration work.
    this._lastRecordedWord = null;

    this._prefixRegex = this.config.unicodeAware ? /([\p{L}]+)$/u : /([a-zA-Z]+)$/;
  }

  on(event, fn) {
    return this.emitter.on(event, fn);
  }

  getState() {
    return this.state;
  }

  isReady() {
    return this.state === AutocompleteState.READY;
  }

  _setState(state, payload) {
    this.state = state;
    this.emitter.emit(state, payload);
    this.emitter.emit('stateChange', { state, payload });
  }

  /**
   * Initializes the trie:
   *  1. Loads recent words from IndexedDB.
   *  2. Restores a cached constructed trie if fresh (< TTL).
   *  3. Otherwise restores a cached raw word list if fresh, and rebuilds+recaches the trie.
   *  4. Otherwise fetches the dictionary (with retry/timeout/validation), builds, and caches.
   * Safe to call multiple times concurrently — subsequent calls await the same in-flight promise.
   */
  async init() {
    if (this.state === AutocompleteState.READY) return this.globalTrie;
    if (this._initPromise) return this._initPromise;

    this._initPromise = this._doInit();
    return this._initPromise;
  }

  async _doInit() {
    if (typeof window === 'undefined') {
      // SSR / non-browser environment: seed words only, no persistence.
      this._setState(AutocompleteState.READY);
      return this.globalTrie;
    }

    this._setState(AutocompleteState.INITIALIZING);
    this.emitter.emit('progress', { phase: 'loading-recent-words' });

    try {
      await Promise.all([this.recentWords.load(), this.bigramModel.load()]);

      const now = Date.now();
      const cachedTrie = await this.idb.get(this.config.trieCacheKey);
      const isTrieValid = cachedTrie && cachedTrie.root && now - cachedTrie.lastFetchedAt < this.config.cacheTtlMs;

      if (isTrieValid) {
        this.emitter.emit('progress', { phase: 'restoring-cached-trie' });
        this.globalTrie.deserialize(cachedTrie.root);
        this._setState(AutocompleteState.READY);
        return this.globalTrie;
      }

      const cachedWords = await this.idb.get(this.config.cacheKey);
      const isWordsValid =
        cachedWords && Array.isArray(cachedWords.words) && now - cachedWords.lastFetchedAt < this.config.cacheTtlMs;

      if (isWordsValid) {
        this.emitter.emit('progress', { phase: 'rebuilding-trie-from-cached-words' });
        await insertWordsInChunks(cachedWords.words, this.globalTrie, this.config.chunkSize);
        this._cacheSerializedTrie(cachedWords.lastFetchedAt); // fire-and-forget
        this._setState(AutocompleteState.READY);
        return this.globalTrie;
      }

      this.emitter.emit('progress', { phase: 'fetching-dictionary' });
      const words = await fetchDictionaryWithRetry(this.config, this.logger);

      this.emitter.emit('progress', { phase: 'building-trie' });
      await insertWordsInChunks(words, this.globalTrie, this.config.chunkSize);

      // Persist word list and serialized trie; failures here are non-fatal
      // (handled inside IdbStore) — the trie is already usable in memory.
      await this.idb.set(this.config.cacheKey, { words, lastFetchedAt: now });
      await this._cacheSerializedTrie(now);

      this._setState(AutocompleteState.READY);
      return this.globalTrie;
    } catch (err) {
      this.logger.error('[AutocompleteTrie] Initialization failed, falling back to seed words only:', err);
      this.lastError = err;
      // Degrade gracefully: seed words + any recent words already loaded
      // still give a usable (if smaller) autocomplete experience.
      this._setState(AutocompleteState.ERROR, { error: err });
      this._setState(AutocompleteState.READY);
      return this.globalTrie;
    } finally {
      this._initPromise = null;
    }
  }

  async _cacheSerializedTrie(lastFetchedAt) {
    try {
      const serialized = this.globalTrie.serialize();
      await this.idb.set(this.config.trieCacheKey, { root: serialized, lastFetchedAt });
    } catch (err) {
      this.logger.warn('[AutocompleteTrie] Failed to cache serialized trie:', err);
    }
  }

  recordRecentWord(word) {
    this.recentWords.record(word);

    // Feed the bigram model from the same call, in typing order, so host
    // apps get next-word prediction "for free" just by calling
    // recordRecentWord() per completed word the way they already do.
    const clean = typeof word === 'string' ? word.trim().toLowerCase() : '';
    if (clean.length >= 2 && clean.length <= this.config.maxWordLength) {
      if (this._lastRecordedWord && this._lastRecordedWord !== clean) {
        this.bigramModel.record(this._lastRecordedWord, clean);
      }
      this._lastRecordedWord = clean;
    }
  }

  /**
   * Call this when the typing sequence is no longer contiguous — e.g. the
   * user clicked elsewhere in the document, loaded a different file, or a
   * large paste happened. Prevents an unrelated (prevWord -> nextWord)
   * pair from being recorded into the bigram model.
   */
  resetSequenceContext() {
    this._lastRecordedWord = null;
  }

  /**
   * Extracts a ghost-text suggestion for the current cursor position.
   *
   * Two modes, chosen automatically based on cursor position:
   *  - Mid-word (cursor right after letters): completes the word being
   *    typed, prioritizing recent words (frequency+recency ranked) and
   *    falling back to the full dictionary trie. This intentionally does
   *    NOT fire next-word prediction, since a word like "hat" could still
   *    extend to "hats"/"hate" — matching standard predictive-keyboard
   *    behavior.
   *  - Word boundary (cursor right after whitespace): predicts the next
   *    word using (previous word -> next word) history, personalized from
   *    this user's own typing and falling back to a small baseline model.
   *
   * Returns null inside math/LaTeX regions or when no valid suggestion exists.
   * The returned shape is the same for both modes (`prefix`/`suffix`/
   * `fullWord`/`startPos`/`endPos`) so existing ghost-text rendering code
   * needs no changes; `type` additionally distinguishes the two if useful.
   *
   * @param {string} fullText
   * @param {number} cursorIndex
   */
  getGhostSuggestion(fullText, cursorIndex) {
    if (!fullText || typeof cursorIndex !== 'number' || cursorIndex < 1) return null;
    if (cursorIndex > fullText.length) return null;

    const textBeforeCursor = fullText.substring(0, cursorIndex);

    // Math exclusion: inside inline KaTeX math ($...$)
    const dollarCount = (textBeforeCursor.match(/\$/g) || []).length;
    if (dollarCount % 2 === 1) return null;

    const lineStart = textBeforeCursor.lastIndexOf('\n') + 1;
    const currentLineBefore = textBeforeCursor.substring(lineStart);

    // Skip if current line has an in-progress LaTeX slash command.
    if (/\\[a-zA-Z]*$/.test(currentLineBefore)) return null;

    const atWordBoundary = currentLineBefore.length === 0 || /\s$/.test(currentLineBefore);
    if (atWordBoundary) {
      return this._getNextWordSuggestion(currentLineBefore, cursorIndex);
    }
    return this._getCompletionSuggestion(currentLineBefore, cursorIndex);
  }

  _getCompletionSuggestion(currentLineBefore, cursorIndex) {
    const match = currentLineBefore.match(this._prefixRegex);
    if (!match) return null;

    const rawPrefix = match[1];
    if (rawPrefix.length > this.config.maxPrefixLength) return null;

    const isAllUpper = rawPrefix === rawPrefix.toUpperCase() && rawPrefix.length > 1;
    const isCapitalized = !isAllUpper && rawPrefix[0] === rawPrefix[0].toUpperCase();
    const lowerPrefix = rawPrefix.toLowerCase();

    let suggestions = this.recentWords.suggest(lowerPrefix, 1);
    if (!suggestions || suggestions.length === 0) {
      suggestions = this.globalTrie.startsWith(lowerPrefix, 1);
    }
    if (!suggestions || suggestions.length === 0) return null;

    const matchedWord = suggestions[0];
    if (matchedWord.toLowerCase() === lowerPrefix) return null;

    const rawSuffix = matchedWord.slice(rawPrefix.length);
    if (!rawSuffix) return null;

    let formattedSuffix = rawSuffix;
    let formattedFullWord = matchedWord;

    if (isAllUpper) {
      formattedSuffix = rawSuffix.toUpperCase();
      formattedFullWord = matchedWord.toUpperCase();
    } else if (isCapitalized) {
      formattedFullWord = rawPrefix[0] + matchedWord.slice(1);
      formattedSuffix = rawSuffix;
    }

    return {
      type: 'completion',
      prefix: rawPrefix,
      suffix: formattedSuffix,
      fullWord: formattedFullWord,
      startPos: cursorIndex - rawPrefix.length,
      endPos: cursorIndex,
    };
  }

  _getNextWordSuggestion(currentLineBefore, cursorIndex) {
    // Find the word immediately before the trailing whitespace, e.g. for
    // "the blue hat " this pulls out "hat".
    const trimmed = currentLineBefore.replace(/\s+$/, '');
    const match = trimmed.match(this._prefixRegex);
    if (!match) return null;

    const prevWord = match[1].toLowerCase();
    const suggestions = this.bigramModel.suggest(prevWord, 1);
    if (!suggestions || suggestions.length === 0) return null;

    const nextWord = suggestions[0];
    if (!nextWord) return null;

    return {
      type: 'next-word',
      prefix: '',
      suffix: nextWord,
      fullWord: nextWord,
      startPos: cursorIndex,
      endPos: cursorIndex,
    };
  }

  /** Releases timers/channels. Call on app teardown or in test cleanup. */
  dispose() {
    this.recentWords.dispose();
    this.bigramModel.dispose();
  }
}

// ---------------------------------------------------------------------------
// Default singleton + backward-compatible functional API
// (matches the original module's exports so existing call sites don't break)
// ---------------------------------------------------------------------------

let defaultEngine = new AutocompleteEngine();

/** Overrides the default singleton's config/logger. Call before any other API use. */
export function configureAutocomplete(configOverrides, logger) {
  defaultEngine.dispose();
  defaultEngine = new AutocompleteEngine(configOverrides, logger);
  return defaultEngine;
}

export function getDefaultEngine() {
  return defaultEngine;
}

export function getGlobalTrie() {
  return defaultEngine.globalTrie;
}

export function getRecentWordsTrie() {
  return defaultEngine.recentWords.trie;
}

export async function loadRecentWords() {
  return defaultEngine.recentWords.load();
}

export function recordRecentWord(word) {
  return defaultEngine.recordRecentWord(word);
}

export async function initAutocompleteTrie() {
  return defaultEngine.init();
}

export function getGhostSuggestion(fullText, cursorIndex) {
  return defaultEngine.getGhostSuggestion(fullText, cursorIndex);
}

export function getAutocompleteState() {
  return defaultEngine.getState();
}

/**
 * Call this whenever the typing sequence is no longer contiguous — e.g. the
 * user focused a different note/block, or the cursor jumped somewhere
 * unrelated. Prevents the bigram model from learning a nonsense (prevWord ->
 * nextWord) pair stitched across two unrelated pieces of text.
 */
export function resetSequenceContext() {
  return defaultEngine.resetSequenceContext();
}

export function onAutocompleteEvent(event, fn) {
  return defaultEngine.on(event, fn);
}