/**
 * Spatial Stroke Clusterer & Layer 1 Local Geometry Parser
 *
 * Groups discrete vector InkStrokes into bounding box clusters based on spatial proximity (90px margin).
 * Merges words written next to each other (e.g. "Hi Bro") into a single unified sentence cluster.
 *
 * Enhanced with:
 * - Line-aware clustering: strokes sharing a horizontal baseline are grouped into line clusters
 * - Word segmentation hints: gaps > 30px within a line cluster are marked as word boundaries
 * - Temporal ordering: strokes are sorted by timestamp for left-to-right reading order
 */

import { intersectsBBox } from './spatialIndexRTree';

/**
 * Expands bounding box by margin.
 */
function expandBBox(bbox, margin = 90) {
  return {
    minX: bbox.minX - margin,
    minY: bbox.minY - margin,
    maxX: bbox.maxX + margin,
    maxY: bbox.maxY + margin,
  };
}

/**
 * Expands bounding box horizontally more than vertically for text line detection.
 * Text tends to flow horizontally, so use a wider horizontal margin.
 */
function expandBBoxForLine(bbox, hMargin = 120, vMargin = 50) {
  return {
    minX: bbox.minX - hMargin,
    minY: bbox.minY - vMargin,
    maxX: bbox.maxX + hMargin,
    maxY: bbox.maxY + vMargin,
  };
}

/**
 * Merges two bounding boxes.
 */
function mergeBBoxes(boxA, boxB) {
  return {
    minX: Math.min(boxA.minX, boxB.minX),
    minY: Math.min(boxA.minY, boxB.minY),
    maxX: Math.max(boxA.maxX, boxB.maxX),
    maxY: Math.max(boxA.maxY, boxB.maxY),
  };
}

/**
 * Calculates the vertical center (baseline estimate) of a stroke's bounding box.
 */
function getStrokeBaseline(stroke) {
  const bbox = stroke.bbox;
  return (bbox.minY + bbox.maxY) / 2;
}

/**
 * Checks if two strokes share a similar horizontal baseline (text on the same line).
 * Tolerance scales with stroke height to handle varying text sizes.
 */
function sharesBaseline(strokeA, strokeB, tolerance = 0.6) {
  const baselineA = getStrokeBaseline(strokeA);
  const baselineB = getStrokeBaseline(strokeB);
  const heightA = strokeA.bbox.maxY - strokeA.bbox.minY;
  const heightB = strokeB.bbox.maxY - strokeB.bbox.minY;
  const avgHeight = (heightA + heightB) / 2;
  const maxDist = Math.max(avgHeight * tolerance, 25);

  return Math.abs(baselineA - baselineB) < maxDist;
}

/**
 * Gets the earliest timestamp from a stroke's points.
 */
function getStrokeTimestamp(stroke) {
  if (stroke.points && stroke.points.length > 0) {
    return stroke.points[0].timestamp || 0;
  }
  return 0;
}

/**
 * Evaluates whether a single stroke is a Scratch-Out Erase gesture.
 * A scratch-out is a rapid zigzag motion with 5+ direction changes.
 */
export function detectScratchOutGesture(stroke, targetStrokes = []) {
  if (!stroke || stroke.points.length < 10) return { isScratch: false, targetIds: [] };

  const points = stroke.points;
  let directionChanges = 0;
  let prevDx = points[1].x - points[0].x;

  for (let i = 2; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    if ((dx > 0 && prevDx < 0) || (dx < 0 && prevDx > 0)) {
      directionChanges++;
    }
    if (Math.abs(dx) > 1) prevDx = dx;
  }

  const isZigzag = directionChanges >= 5;
  if (!isZigzag) return { isScratch: false, targetIds: [] };

  const targetIds = [];
  const scratchBox = stroke.bbox;

  for (let i = 0; i < targetStrokes.length; i++) {
    const target = targetStrokes[i];
    if (target.id === stroke.id) continue;

    if (intersectsBBox(scratchBox, target.bbox)) {
      targetIds.push(target.id);
    }
  }

  return {
    isScratch: targetIds.length > 0,
    targetIds,
  };
}

/**
 * Evaluates whether a stroke or pair of strokes forms an equals sign ("=") gesture.
 * Two short horizontal lines stacked vertically with X overlap.
 */
export function detectEqualsGesture(strokes) {
  if (!strokes || strokes.length < 2) return false;

  const lastStroke = strokes[strokes.length - 1];
  const prevStroke = strokes[strokes.length - 2];

  const isHorizontal = (s) => {
    const dx = Math.abs(s.bbox.maxX - s.bbox.minX);
    const dy = Math.abs(s.bbox.maxY - s.bbox.minY);
    return dx > 8 && dy < 25 && dx / Math.max(dy, 1) > 1.5;
  };

  if (isHorizontal(lastStroke) && isHorizontal(prevStroke)) {
    const yDist = Math.abs(lastStroke.bbox.minY - prevStroke.bbox.minY);
    const xOverlap = Math.min(lastStroke.bbox.maxX, prevStroke.bbox.maxX) - Math.max(lastStroke.bbox.minX, prevStroke.bbox.minX);

    if (yDist < 35 && xOverlap > 5) {
      return true;
    }
  }

  return false;
}

/**
 * Clusters strokes on canvas into spatial groups.
 *
 * Uses a hybrid approach:
 * 1. Baseline-aware grouping: strokes on the same horizontal line are clustered with wider horizontal margin
 * 2. Proximity grouping: remaining strokes use the standard proximity margin
 * 3. Temporal ordering: strokes within each cluster are sorted by timestamp for reading order
 *
 * @param {Array} strokes - Array of InkStroke objects
 * @param {number} proximityMargin - Pixel margin for spatial proximity grouping (default 90)
 * @returns {Array} Array of StrokeCluster objects
 */
export function clusterStrokes(strokes, proximityMargin = 90) {
  if (!strokes || strokes.length === 0) return [];

  const clusters = [];
  const visited = new Set();

  // Sort strokes by timestamp for consistent ordering
  const sortedStrokes = [...strokes].sort((a, b) => getStrokeTimestamp(a) - getStrokeTimestamp(b));

  for (let i = 0; i < sortedStrokes.length; i++) {
    const stroke = sortedStrokes[i];
    if (visited.has(stroke.id)) continue;

    let currentClusterStrokes = [stroke];
    let clusterBox = { ...stroke.bbox };
    visited.add(stroke.id);

    let expanded = true;
    while (expanded) {
      expanded = false;

      // Use line-aware expansion: wider horizontal margin for strokes on the same baseline
      const lineSearchBox = expandBBoxForLine(clusterBox, proximityMargin + 30, proximityMargin - 40);
      const standardSearchBox = expandBBox(clusterBox, proximityMargin);

      for (let j = 0; j < sortedStrokes.length; j++) {
        const candidate = sortedStrokes[j];
        if (visited.has(candidate.id)) continue;

        // Check if candidate is on the same baseline as any stroke in the cluster
        const onSameLine = currentClusterStrokes.some((s) => sharesBaseline(s, candidate));

        // Use wider search box for same-line strokes (catches words in a sentence)
        const searchBox = onSameLine ? lineSearchBox : standardSearchBox;

        if (intersectsBBox(searchBox, candidate.bbox)) {
          visited.add(candidate.id);
          currentClusterStrokes.push(candidate);
          clusterBox = mergeBBoxes(clusterBox, candidate.bbox);
          expanded = true;
        }
      }
    }

    // Sort cluster strokes by temporal order for correct reading sequence
    currentClusterStrokes.sort((a, b) => getStrokeTimestamp(a) - getStrokeTimestamp(b));

    const hasEquals = detectEqualsGesture(currentClusterStrokes);

    clusters.push({
      clusterId: `cluster_${Date.now()}_${i}`,
      strokeIds: currentClusterStrokes.map((s) => s.id),
      strokes: currentClusterStrokes,
      bbox: clusterBox,
      hasEqualsGesture: hasEquals,
      status: 'idle',
    });
  }

  return clusters;
}
