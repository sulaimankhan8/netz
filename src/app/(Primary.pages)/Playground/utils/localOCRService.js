/**
 * Local Browser-Native OCR Service (Tesseract.js WASM)
 *
 * 100% browser-native, zero API cost handwriting recognition.
 * Runs Tesseract WASM engine in a WebWorker — never blocks the UI thread.
 *
 * Replaces the previous geminiVisionService.js which used cloud API calls.
 *
 * Architecture:
 *   1. Singleton Tesseract worker (initialized once, reused for all recognition)
 *   2. Stroke bitmap → Tesseract WASM → recognized text
 *   3. Post-recognition heuristics classify math vs text
 *   4. Results cached per cluster stroke signature
 */

import Tesseract from 'tesseract.js';

/**
 * Singleton worker instance — initialized once, reused for all calls.
 * The WASM model (~3MB) is downloaded on first use and browser-cached.
 */
let workerInstance = null;
let workerInitPromise = null;
let workerStatus = 'idle'; // 'idle' | 'initializing' | 'ready' | 'error'

/**
 * Recognition result cache.
 * Key: sorted stroke IDs joined, Value: recognition result.
 */
const recognitionCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Initializes the Tesseract WASM worker (singleton pattern).
 * Downloads the WASM model on first call (~3MB), browser-cached after that.
 *
 * @returns {Promise<Tesseract.Worker>} The initialized worker
 */
async function getWorker() {
  if (workerInstance && workerStatus === 'ready') {
    return workerInstance;
  }

  if (workerInitPromise) {
    return workerInitPromise;
  }

  workerStatus = 'initializing';

  workerInitPromise = (async () => {
    try {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          // Silent in production — uncomment for debug:
          // console.log('[Tesseract]', m.status, Math.round((m.progress || 0) * 100) + '%');
        },
      });

      // Configure for handwriting-optimized recognition
      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 +-*/=()^.,;:!?\'\"{}[]<>|\\@#$%&_~`',
      });

      workerInstance = worker;
      workerStatus = 'ready';
      workerInitPromise = null;
      return worker;
    } catch (err) {
      console.error('[LocalOCR] Failed to initialize Tesseract worker:', err);
      workerStatus = 'error';
      workerInitPromise = null;
      throw err;
    }
  })();

  return workerInitPromise;
}

/**
 * Regex patterns for detecting math content in recognized text.
 */
const MATH_PATTERNS = [
  /^\s*[\d\s+\-*/^=().]+\s*$/,                          // Pure arithmetic: "12 + 45 ="
  /[a-zA-Z]\s*=\s*[\d\s+\-*/^().]+/,                    // Variable assignment: "a = 5"
  /[a-zA-Z]\s*\(\s*[a-zA-Z]\s*\)/,                      // Function notation: "f(x)"
  /\b(sin|cos|tan|log|ln|sqrt|lim|sum|int)\b/i,          // Math functions
  /[∫∑∏√±∞π]/,                                           // Math Unicode symbols
  /\d+\s*[+\-*/^]\s*\d+/,                                // Binary operation: "3 + 5"
  /[a-zA-Z]\^[\d{]/,                                     // Exponent: "x^2"
  /\d+\s*\/\s*\d+/,                                      // Fraction: "1/3"
];

/**
 * Determines if recognized text is a math expression based on content heuristics.
 *
 * @param {string} text - Recognized text
 * @returns {boolean} True if the text appears to be mathematical
 */
function classifyAsMath(text) {
  if (!text || text.trim().length === 0) return false;

  const trimmed = text.trim();

  // If it's mostly numbers and operators, it's math
  const mathChars = trimmed.replace(/[\d\s+\-*/^=().{}[\]<>]/g, '');
  const nonMathRatio = mathChars.length / trimmed.length;
  if (nonMathRatio < 0.2 && trimmed.length > 1) return true;

  // Check against math patterns
  for (const pattern of MATH_PATTERNS) {
    if (pattern.test(trimmed)) return true;
  }

  return false;
}

/**
 * Post-processes Tesseract output for cleaner results.
 * Fixes common OCR artifacts in handwriting.
 *
 * @param {string} rawText - Raw Tesseract output
 * @returns {string} Cleaned text
 */
function postProcessText(rawText) {
  if (!rawText) return '';

  let text = rawText.trim();

  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ');

  // Remove common OCR noise characters at start/end
  text = text.replace(/^[|_\-~`]+/, '').replace(/[|_\-~`]+$/, '');

  // Trim again after cleanup
  text = text.trim();

  return text;
}

/**
 * Converts recognized text to basic LaTeX if classified as math.
 *
 * @param {string} text - Recognized math text
 * @returns {string} LaTeX-formatted string
 */
function textToBasicLatex(text) {
  if (!text) return '';

  let latex = text.trim();

  // Common substitutions for handwriting OCR artifacts
  latex = latex.replace(/×/g, '\\times ');
  latex = latex.replace(/÷/g, '\\div ');
  latex = latex.replace(/√/g, '\\sqrt{');
  latex = latex.replace(/π/g, '\\pi ');
  latex = latex.replace(/∞/g, '\\infty ');
  latex = latex.replace(/±/g, '\\pm ');

  return latex;
}

/**
 * Recognizes handwriting from a base64-encoded image using browser-native Tesseract WASM.
 *
 * @param {string} base64Image - Raw base64 image data (no data URL prefix)
 * @param {string} mode - 'text' | 'math' | 'auto' — recognition mode hint
 * @param {AbortSignal} signal - Optional AbortController signal for cancellation
 * @returns {Promise<{ text: string, isMath: boolean, confidence: number, error: string|null }>}
 */
export async function recognizeHandwriting(base64Image, mode = 'auto', signal = null) {
  if (!base64Image) {
    return { text: '', isMath: false, confidence: 0, error: 'EMPTY_IMAGE' };
  }

  try {
    // Check if aborted before starting
    if (signal?.aborted) {
      return { text: '', isMath: false, confidence: 0, error: 'ABORTED' };
    }

    // Get or initialize the Tesseract worker
    const worker = await getWorker();

    // Check abort again after worker init (which may take a few seconds on first load)
    if (signal?.aborted) {
      return { text: '', isMath: false, confidence: 0, error: 'ABORTED' };
    }

    // Reconstruct data URL for Tesseract
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Run recognition
    const result = await worker.recognize(dataUrl);

    if (signal?.aborted) {
      return { text: '', isMath: false, confidence: 0, error: 'ABORTED' };
    }

    const rawText = result?.data?.text || '';
    const ocrConfidence = (result?.data?.confidence || 0) / 100; // Tesseract returns 0-100, normalize to 0-1

    // Post-process the recognized text
    const cleanedText = postProcessText(rawText);

    if (!cleanedText) {
      return { text: '', isMath: false, confidence: ocrConfidence, error: null };
    }

    // Classify as math or text
    let isMath = false;
    let finalText = cleanedText;

    if (mode === 'math') {
      isMath = true;
      finalText = textToBasicLatex(cleanedText);
    } else if (mode === 'text') {
      isMath = false;
    } else {
      // Auto-classify based on content
      isMath = classifyAsMath(cleanedText);
      if (isMath) {
        finalText = textToBasicLatex(cleanedText);
      }
    }

    return {
      text: finalText,
      isMath,
      confidence: ocrConfidence,
      error: null,
    };
  } catch (err) {
    if (err.name === 'AbortError' || signal?.aborted) {
      return { text: '', isMath: false, confidence: 0, error: 'ABORTED' };
    }

    console.error('[LocalOCR] Recognition error:', err);
    return {
      text: '',
      isMath: false,
      confidence: 0,
      error: workerStatus === 'error' ? 'WASM_LOAD_FAILED' : 'RECOGNITION_ERROR',
    };
  }
}

/**
 * Returns the current status of the OCR engine.
 * @returns {'idle' | 'initializing' | 'ready' | 'error'}
 */
export function getOCREngineStatus() {
  return workerStatus;
}

/**
 * Pre-warms the Tesseract worker so the first recognition call is faster.
 * Call this early (e.g., when the Playground page loads) to trigger WASM download in background.
 */
export async function preloadOCREngine() {
  try {
    await getWorker();
  } catch {
    // Silent failure — worker will be retried on next recognition call
  }
}

/**
 * Generates a cache key from cluster stroke IDs.
 */
export function generateCacheKey(strokeIds) {
  if (!strokeIds || strokeIds.length === 0) return '';
  return strokeIds.slice().sort().join('|');
}

/**
 * Checks if a recognition result is cached.
 */
export function getCachedResult(strokeIds) {
  const key = generateCacheKey(strokeIds);
  return recognitionCache.get(key) || null;
}

/**
 * Stores a recognition result in the cache.
 */
export function setCachedResult(strokeIds, result) {
  const key = generateCacheKey(strokeIds);

  if (recognitionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = recognitionCache.keys().next().value;
    recognitionCache.delete(firstKey);
  }

  recognitionCache.set(key, result);
}

/**
 * Clears the recognition cache.
 */
export function clearRecognitionCache() {
  recognitionCache.clear();
}

/**
 * Terminates the Tesseract worker to free memory.
 * Call when navigating away from the Playground.
 */
export async function terminateOCREngine() {
  if (workerInstance) {
    try {
      await workerInstance.terminate();
    } catch {
      // Silent
    }
    workerInstance = null;
    workerStatus = 'idle';
  }
}
