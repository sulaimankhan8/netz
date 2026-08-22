/**
 * Pointer Events Handler Utility for NETZ Smart Whiteboard Playground
 * Normalizes Pen, Touch, and Mouse inputs, enforces palm rejection,
 * extracts hardware coalesced events (120Hz-240Hz digitizer sampling),
 * and maps viewport client coordinates to infinite canvas space.
 */

/**
 * Transforms screen client coordinates (e.clientX, e.clientY)
 * into transformed Infinite Canvas space coordinates.
 */
export function getCanvasCoordinates(clientX, clientY, rect, transform) {
  // Relative position inside the canvas bounding rect
  const screenX = clientX - rect.left;
  const screenY = clientY - rect.top;

  // Apply inverse viewport transform: (Screen - Pan) / Zoom
  const canvasX = (screenX - transform.panOffset.x) / transform.zoomLevel;
  const canvasY = (screenY - transform.panOffset.y) / transform.zoomLevel;

  return { x: canvasX, y: canvasY };
}

/**
 * Enforces Palm Rejection rules for touch & stylus input.
 * Rejects accidental palm touches when active stylus pen is detected.
 */
export function isPalmTouch(e, activePointerType) {
  // If user is drawing with a stylus pen, reject touch inputs (palm resting on screen)
  if (activePointerType === 'pen' && e.pointerType === 'touch') {
    return true;
  }

  // Reject multi-touch palm contacts (large contact area)
  if (e.pointerType === 'touch' && (e.width > 25 || e.height > 25)) {
    return true;
  }

  return false;
}

/**
 * Extracts all point data from a PointerEvent, including hardware coalesced events
 * (sub-frame digitizer points sampled between browser animation frames).
 */
export function extractPointerPoints(e, canvasRect, transform) {
  const points = [];

  // Try extracting coalesced events if supported by hardware/browser
  const coalescedEvents = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];

  for (let i = 0; i < coalescedEvents.length; i++) {
    const ev = coalescedEvents[i];
    const coords = getCanvasCoordinates(ev.clientX, ev.clientY, canvasRect, transform);

    // Normalize pressure: stylus provides 0.0-1.0; mouse/touch defaults to 0.5 if unsupported
    let pressure = ev.pressure;
    if (pressure === 0 || pressure === undefined) {
      pressure = 0.5;
    }

    points.push({
      x: coords.x,
      y: coords.y,
      pressure,
      timestamp: ev.timeStamp || performance.now(),
      pointerType: ev.pointerType || 'mouse',
    });
  }

  return points;
}
