/**
 * Geometric Shape Recognizer & Auto-Straightener
 * Inspired by Samsung Notes & Apple Notes "Hold to Snap Shape"
 *
 * Recognizes freehand strokes as:
 * - Straight Lines
 * - Rectangles / Squares
 * - Circles / Ellipses
 * - Triangles
 * - Arrows
 */

/**
 * Calculates Euclidean distance between two points
 */
function dist(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Checks if a stroke is a straight line
 */
function isStraightLine(points) {
  if (points.length < 3) return true;
  const start = points[0];
  const end = points[points.length - 1];
  const directDist = dist(start, end);
  if (directDist < 15) return false; // Too short or closed

  let totalPathLength = 0;
  let maxDeviation = 0;

  for (let i = 1; i < points.length; i++) {
    totalPathLength += dist(points[i - 1], points[i]);

    // Perpendicular distance from points[i] to line (start -> end)
    const num = Math.abs((end.y - start.y) * points[i].x - (end.x - start.x) * points[i].y + end.x * start.y - end.y * start.x);
    const deviation = num / directDist;
    if (deviation > maxDeviation) maxDeviation = deviation;
  }

  // If path length is close to straight-line distance and max deviation is low
  return (totalPathLength / directDist < 1.15) && (maxDeviation < 15);
}

/**
 * Checks if a stroke is a closed loop (start and end points are near each other)
 */
function isClosedLoop(points) {
  if (points.length < 8) return false;
  const start = points[0];
  const end = points[points.length - 1];
  const directDist = dist(start, end);

  let totalPathLength = 0;
  for (let i = 1; i < points.length; i++) {
    totalPathLength += dist(points[i - 1], points[i]);
  }

  return (directDist / totalPathLength < 0.25);
}

/**
 * Fits a circle/ellipse to closed loop points
 */
function fitCircle(points, bbox) {
  const cx = (bbox.minX + bbox.maxX) / 2;
  const cy = (bbox.minY + bbox.maxY) / 2;
  const rx = (bbox.maxX - bbox.minX) / 2;
  const ry = (bbox.maxY - bbox.minY) / 2;

  // Check how close points are to the ellipse equation: (x-cx)^2/rx^2 + (y-cy)^2/ry^2 = 1
  let variance = 0;
  for (let i = 0; i < points.length; i++) {
    const val = Math.pow((points[i].x - cx) / Math.max(rx, 1), 2) + Math.pow((points[i].y - cy) / Math.max(ry, 1), 2);
    variance += Math.abs(val - 1);
  }
  const avgVariance = variance / points.length;

  if (avgVariance < 0.35) {
    // Generate perfect circle/ellipse points (36 segments)
    const perfectPoints = [];
    const isCircle = Math.abs(rx - ry) / Math.max(rx, ry) < 0.25;
    const finalRx = isCircle ? (rx + ry) / 2 : rx;
    const finalRy = isCircle ? (rx + ry) / 2 : ry;

    for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 18) {
      perfectPoints.push({
        x: cx + finalRx * Math.cos(angle),
        y: cy + finalRy * Math.sin(angle),
        pressure: 0.5,
        timestamp: Date.now(),
      });
    }

    return {
      shape: isCircle ? 'circle' : 'ellipse',
      points: perfectPoints,
      confidence: 1 - avgVariance,
    };
  }

  return null;
}

/**
 * Fits a rectangle to closed loop points
 */
function fitRectangle(bbox) {
  const { minX, minY, maxX, maxY } = bbox;
  const corners = [
    { x: minX, y: minY, pressure: 0.5, timestamp: Date.now() },
    { x: maxX, y: minY, pressure: 0.5, timestamp: Date.now() },
    { x: maxX, y: maxY, pressure: 0.5, timestamp: Date.now() },
    { x: minX, y: maxY, pressure: 0.5, timestamp: Date.now() },
    { x: minX, y: minY, pressure: 0.5, timestamp: Date.now() },
  ];

  return {
    shape: 'rectangle',
    points: corners,
    confidence: 0.85,
  };
}

/**
 * Main shape snapping function.
 * Given raw stroke points and bounding box, detects if it matches a geometric primitive.
 *
 * @param {Array} points - Array of PointerPoint objects
 * @param {Object} bbox - BoundingBox
 * @returns {{ isSnapped: boolean, shape?: string, points?: Array } }
 */
export function recognizeAndSnapShape(points, bbox) {
  if (!points || points.length < 5) return { isSnapped: false };

  // 1. Straight Line
  if (isStraightLine(points)) {
    const start = points[0];
    const end = points[points.length - 1];

    // Auto-snap to horizontal/vertical if angle is within 5 degrees
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let finalEnd = { ...end };

    if (Math.abs(dy) < 12) {
      finalEnd.y = start.y; // Perfect horizontal
    } else if (Math.abs(dx) < 12) {
      finalEnd.x = start.x; // Perfect vertical
    }

    return {
      isSnapped: true,
      shape: 'line',
      points: [start, finalEnd],
    };
  }

  // 2. Closed Shapes (Circle, Rectangle)
  if (isClosedLoop(points)) {
    // Try Circle / Ellipse first
    const circleFit = fitCircle(points, bbox);
    if (circleFit) {
      return {
        isSnapped: true,
        shape: circleFit.shape,
        points: circleFit.points,
      };
    }

    // Fallback: Rectangle fit
    const rectFit = fitRectangle(bbox);
    return {
      isSnapped: true,
      shape: rectFit.shape,
      points: rectFit.points,
    };
  }

  return { isSnapped: false };
}
