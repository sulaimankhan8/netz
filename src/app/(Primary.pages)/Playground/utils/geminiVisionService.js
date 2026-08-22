/**
 * Gemini Vision API Service Layer
 *
 * Handles sending rasterized handwriting images to the Gemini 2.0 Flash Vision API
 * for text/math recognition. Manages API key, rate limiting, retries, and error fallback.
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Recognition mode prompts
const TEXT_RECOGNITION_PROMPT = `You are a handwriting recognition engine. Look at this image of handwritten text and read it exactly as written.

Rules:
- Return ONLY the recognized text, nothing else.
- Preserve the original casing, spacing, and punctuation.
- If you see multiple words, return them separated by spaces in natural reading order (left to right, top to bottom).
- If you cannot read a word clearly, make your best guess.
- Do NOT add explanations, labels, or formatting — just the raw recognized text.`;

const MATH_RECOGNITION_PROMPT = `You are a mathematical handwriting recognition engine. Look at this image of a handwritten mathematical expression and convert it to LaTeX notation.

Rules:
- Return ONLY the LaTeX string, nothing else.
- Use standard LaTeX math notation (e.g., \\frac{}{}, \\sqrt{}, ^{}, _{}, \\int, \\sum).
- For simple arithmetic like "12 + 45 =", return it as plain math: "12 + 45 ="
- For variables and equations like "y = x^2 - 4", return: "y = x^2 - 4"
- Do NOT wrap in $ delimiters or \\[ \\] brackets.
- Do NOT add explanations or labels — just the raw LaTeX expression.`;

const AUTO_CLASSIFY_PROMPT = `Look at this image of handwriting. Determine if it contains:
1. A mathematical expression or equation (numbers, operators, variables, math symbols)
2. Regular text (words, names, sentences)

Then recognize and return the content.

Return your response in this exact JSON format (no markdown, no code blocks):
{"type": "math", "content": "LaTeX expression here"}
or
{"type": "text", "content": "recognized text here"}

Rules for content:
- For math: use standard LaTeX notation without $ delimiters
- For text: return the exact text as written, preserving spacing and casing
- Do NOT add any explanation outside the JSON`;

/**
 * Cache for recognized results to avoid re-processing unchanged clusters.
 * Key: cluster stroke signature (sorted stroke IDs joined), Value: recognition result
 */
const recognitionCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Get the Gemini API key from environment or localStorage.
 * @returns {string|null}
 */
function getApiKey() {
  // Check Next.js public env var first
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }

  // Check localStorage fallback (user-configured)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('netz_gemini_api_key');
    if (stored) return stored;
  }

  return null;
}

/**
 * Sends a base64-encoded image to Gemini Vision API for recognition.
 *
 * @param {string} base64Image - Raw base64 image data (no data URL prefix)
 * @param {string} mode - 'text' | 'math' | 'auto' — determines the recognition prompt
 * @param {AbortSignal} signal - Optional AbortController signal for cancellation
 * @returns {Promise<{ text: string, isMath: boolean, confidence: number }>}
 */
export async function recognizeHandwriting(base64Image, mode = 'auto', signal = null) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('[GeminiVision] No API key configured. Set NEXT_PUBLIC_GEMINI_API_KEY or configure in settings.');
    return {
      text: '',
      isMath: false,
      confidence: 0,
      error: 'NO_API_KEY',
    };
  }

  // Select prompt based on mode
  let prompt;
  if (mode === 'text') {
    prompt = TEXT_RECOGNITION_PROMPT;
  } else if (mode === 'math') {
    prompt = MATH_RECOGNITION_PROMPT;
  } else {
    prompt = AUTO_CLASSIFY_PROMPT;
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 512,
    },
  };

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`[GeminiVision] API error ${response.status}:`, errorText);
      return {
        text: '',
        isMath: false,
        confidence: 0,
        error: `API_ERROR_${response.status}`,
      };
    }

    const data = await response.json();

    // Extract generated text from Gemini response structure
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!generatedText) {
      return { text: '', isMath: false, confidence: 0.3, error: 'EMPTY_RESPONSE' };
    }

    // Parse response based on mode
    if (mode === 'auto') {
      return parseAutoClassifyResponse(generatedText);
    } else {
      return {
        text: generatedText,
        isMath: mode === 'math',
        confidence: 0.85,
        error: null,
      };
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return { text: '', isMath: false, confidence: 0, error: 'ABORTED' };
    }
    console.error('[GeminiVision] Network error:', err);
    return {
      text: '',
      isMath: false,
      confidence: 0,
      error: 'NETWORK_ERROR',
    };
  }
}

/**
 * Parses the auto-classify JSON response from Gemini.
 */
function parseAutoClassifyResponse(rawText) {
  try {
    // Try to extract JSON from the response (Gemini sometimes wraps in markdown)
    let jsonStr = rawText;

    // Strip markdown code blocks if present
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    return {
      text: parsed.content || '',
      isMath: parsed.type === 'math',
      confidence: 0.85,
      error: null,
    };
  } catch {
    // If JSON parse fails, treat the entire response as plain text
    return {
      text: rawText,
      isMath: false,
      confidence: 0.5,
      error: null,
    };
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
 * Checks if a recognition result is cached for the given stroke IDs.
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

  // Evict oldest entries if cache is full
  if (recognitionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = recognitionCache.keys().next().value;
    recognitionCache.delete(firstKey);
  }

  recognitionCache.set(key, result);
}

/**
 * Clears the entire recognition cache.
 */
export function clearRecognitionCache() {
  recognitionCache.clear();
}

/**
 * Sets the Gemini API key in localStorage for user-configured keys.
 */
export function setGeminiApiKey(key) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('netz_gemini_api_key', key);
  }
}

/**
 * Gets the currently configured API key (masked for display).
 */
export function getMaskedApiKey() {
  const key = getApiKey();
  if (!key) return null;
  if (key.length <= 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}
