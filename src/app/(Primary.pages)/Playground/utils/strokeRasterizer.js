/**
 * Stroke Rasterizer — Converts InkStroke arrays into optimized bitmap PNG images
 * for Tesseract.js OCR engine.
 *
 * Optimizations for handwriting accuracy:
 * - Upscales small strokes to an optimal character height (~180px - 240px)
 * - Renders thicker anti-aliased strokes (6-10px) with round caps/joins
 * - Adds generous margins so character boundaries aren't clipped
 */

const TARGET_MIN_HEIGHT = 160;
const TARGET_MAX_HEIGHT = 400;
const RASTER_PADDING = 32;
const RASTER_STROKE_COLOR = '#000000';
const RASTER_BG_COLOR = '#FFFFFF';

/**
 * Rasterizes an array of InkStroke objects to a base64-encoded PNG data URL.
 *
 * @param {Array} strokes - Array of InkStroke objects with .points[], .width, .color
 * @param {Object} bbox - Bounding box { minX, minY, maxX, maxY } of the cluster
 * @param {Object} options - Optional overrides: { padding, targetHeight }
 * @returns {{ dataUrl: string, width: number, height: number }} Rasterized image result
 */
export function rasterizeStrokesToDataUrl(strokes, bbox, options = {}) {
  const padding = options.padding ?? RASTER_PADDING;

  if (!strokes || strokes.length === 0 || !bbox) {
    return null;
  }

  // Calculate raw cluster dimensions
  const rawWidth = Math.max(bbox.maxX - bbox.minX, 20);
  const rawHeight = Math.max(bbox.maxY - bbox.minY, 20);

  // Calculate scaling factor so handwriting is at optimal OCR resolution (height ~180-240px)
  let scale = 1.0;
  if (rawHeight < TARGET_MIN_HEIGHT) {
    scale = Math.min(TARGET_MIN_HEIGHT / rawHeight, 3.5);
  } else if (rawHeight > TARGET_MAX_HEIGHT) {
    scale = TARGET_MAX_HEIGHT / rawHeight;
  }

  const scaledWidth = Math.round(rawWidth * scale);
  const scaledHeight = Math.round(rawHeight * scale);

  const canvasWidth = scaledWidth + padding * 2;
  const canvasHeight = scaledHeight + padding * 2;

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

  // Fill crisp white background
  ctx.fillStyle = RASTER_BG_COLOR;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw each stroke as bold black lines
  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];
    const points = stroke.points;
    if (!points || points.length === 0) continue;

    ctx.beginPath();
    ctx.strokeStyle = RASTER_STROKE_COLOR;
    // Thicken stroke for OCR recognition (optimal 6-8px on scaled canvas)
    ctx.lineWidth = Math.max(5, (stroke.width || 3) * scale * 1.3);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length === 1) {
      // Single point dot (e.g. dot on 'i' or period '.')
      const ptX = (points[0].x - bbox.minX) * scale + padding;
      const ptY = (points[0].y - bbox.minY) * scale + padding;
      ctx.arc(ptX, ptY, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = RASTER_STROKE_COLOR;
      ctx.fill();
      continue;
    }

    const x0 = (points[0].x - bbox.minX) * scale + padding;
    const y0 = (points[0].y - bbox.minY) * scale + padding;
    ctx.moveTo(x0, y0);

    for (let j = 1; j < points.length; j++) {
      const x = (points[j].x - bbox.minX) * scale + padding;
      const y = (points[j].y - bbox.minY) * scale + padding;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  // Export to base64 data URL
  if (canvas instanceof OffscreenCanvas) {
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
 * Extracts raw base64 payload from data URL
 */
export function extractBase64FromDataUrl(dataUrl) {
  if (!dataUrl) return '';
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return dataUrl;
  return dataUrl.substring(commaIndex + 1);
}
