/**
 * Catmull-Rom Spline Curve Fitting & Stroke Smoother
 * Converts raw discrete pointer trajectory points into hardware-accelerated
 * smooth cubic Bézier curves for 2D HTML5 canvas rendering.
 */

/**
 * Calculates bounding box { minX, minY, maxX, maxY } for a set of points.
 */
export function calculateBoundingBox(points) {
  if (!points || points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Draws a smooth Catmull-Rom / Quadratic curve through trajectory points onto a 2D Canvas context.
 * Uses midpoint quadratic Bézier curve rendering for sub-millisecond execution.
 */
export function drawSmoothStroke(ctx, points, style = {}) {
  if (!points || points.length === 0) return;

  const {
    color = '#3B82F6',
    width = 3,
    tool = 'pen',
    opacity = 1.0,
  } = style;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.globalAlpha = tool === 'highlighter' ? 0.35 : opacity;
  ctx.lineWidth = tool === 'highlighter' ? width * 4 : width;

  if (tool === 'highlighter') {
    ctx.globalCompositeOperation = 'source-over';
  } else if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }

  if (points.length === 1) {
    // Single tap dot
    const pt = points[0];
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (tool === 'highlighter' ? width * 2 : width) / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return;
  }

  if (points.length === 2) {
    // Straight line between two points
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Smooth curve through point array using quadratic midpoint interpolation
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const currentPt = points[i];
    const nextPt = points[i + 1];
    
    // Midpoint between current and next point acts as control point
    const midX = (currentPt.x + nextPt.x) / 2;
    const midY = (currentPt.y + nextPt.y) / 2;

    ctx.quadraticCurveTo(currentPt.x, currentPt.y, midX, midY);
  }

  // Connect to the final point
  const lastIndex = points.length - 1;
  ctx.lineTo(points[lastIndex].x, points[lastIndex].y);
  ctx.stroke();

  ctx.restore();
}
