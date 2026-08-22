/**
 * Stroke Rasterizer — Converts InkStroke arrays into bitmap PNG images
 * for submission to OCR/Vision API recognition engines.
 *
 * Renders stroke points as black lines on a white background with proper
 * line widths, coordinate normalization, and padding.
 */

const RASTER_PADDING = 24;
const RASTER_MIN_SIZE = 64;
const RASTER_MAX_SIZE = 1024;
const RASTER_STROKE_COLOR = '#000000';
const RASTER_BG_COLOR = '#FFFFFF';

/**
 * Rasterizes an array of InkStroke objects to a base64-encoded PNG data URL.
 *
 * @param {Array} strokes - Array of InkStroke objects with .points[], .width, .color
 * @param {Object} bbox - Bounding box { minX, minY, maxX, maxY } of the cluster
 * @param {Object} options - Optional overrides: { padding, maxSize, strokeScale }
 * @returns {{ dataUrl: string, width: number, height: number }} Rasterized image result
 */
export function rasterizeStrokesToDataUrl(strokes, bbox, options = {}) {
  const padding = options.padding ?? RASTER_PADDING;
  const maxSize = options.maxSize ?? RASTER_MAX_SIZE;
  const strokeScale = options.strokeScale ?? 1.0;

  if (!strokes || strokes.length === 0 || !bbox) {
    return null;
  }

  // Calculate cluster dimensions
  const rawWidth = bbox.maxX - bbox.minX;
  const rawHeight = bbox.maxY - bbox.minY;

  // Add padding
  let canvasWidth = Math.max(rawWidth + padding * 2, RASTER_MIN_SIZE);
  let canvasHeight = Math.max(rawHeight + padding * 2, RASTER_MIN_SIZE);

  // Scale down if exceeding max size while preserving aspect ratio
  let scale = 1.0;
  if (canvasWidth > maxSize || canvasHeight > maxSize) {
    scale = maxSize / Math.max(canvasWidth, canvasHeight);
    canvasWidth = Math.round(canvasWidth * scale);
    canvasHeight = Math.round(canvasHeight * scale);
  }

  // Create canvas
  let canvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  } else {
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fill white background
  ctx.fillStyle = RASTER_BG_COLOR;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw each stroke as black lines
  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];
    const points = stroke.points;
    if (!points || points.length < 2) continue;

    ctx.beginPath();
    ctx.strokeStyle = RASTER_STROKE_COLOR;
    ctx.lineWidth = Math.max(2, (stroke.width || 3) * strokeScale * scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Translate points: subtract bbox origin, add padding, apply scale
    const x0 = (points[0].x - bbox.minX + padding) * scale;
    const y0 = (points[0].y - bbox.minY + padding) * scale;
    ctx.moveTo(x0, y0);

    for (let j = 1; j < points.length; j++) {
      const x = (points[j].x - bbox.minX + padding) * scale;
      const y = (points[j].y - bbox.minY + padding) * scale;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  // Export to base64 data URL
  if (canvas instanceof OffscreenCanvas) {
    // OffscreenCanvas doesn't have toDataURL, convert synchronously via transferToImageBitmap
    // Fallback: use a regular canvas to extract
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.drawImage(canvas, 0, 0);
    return {
      dataUrl: exportCanvas.toDataURL('image/png'),
      width: canvasWidth,
      height: canvasHeight,
    };
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: canvasWidth,
    height: canvasHeight,
  };
}

/**
 * Extracts just the base64 payload from a data URL (strips the data:image/png;base64, prefix).
 * Required by Gemini Vision API which expects raw base64 without the data URL prefix.
 *
 * @param {string} dataUrl - Full data URL string
 * @returns {string} Raw base64 string
 */
export function extractBase64FromDataUrl(dataUrl) {
  if (!dataUrl) return '';
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return dataUrl;
  return dataUrl.substring(commaIndex + 1);
}
