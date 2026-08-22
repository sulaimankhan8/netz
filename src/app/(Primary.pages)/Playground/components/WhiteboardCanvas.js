'use client';

import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { extractPointerPoints, isPalmTouch } from '../utils/pointerEventsHandler';
import { drawSmoothStroke, calculateBoundingBox } from '../utils/strokeSmoother';
import { SpatialStrokeIndex } from '../utils/spatialIndexRTree';
import { detectScratchOutGesture } from '../utils/spatialClusterer';
import { recognizeAndSnapShape } from '../utils/shapeRecognizer';

const WhiteboardCanvas = forwardRef(function WhiteboardCanvas(
  {
    activeTool = 'pen',
    strokeColor = '#3B82F6',
    strokeWidth = 3,
    zoomLevel = 1,
    panOffset = { x: 0, y: 0 },
    width,
    height,
    snapShapes = false,
    onStrokeAdded,
    onStrokesErased,
    onStrokesUpdated,
    onDrawingStateChange,
  },
  ref
) {
  // Canvas Refs
  const staticCanvasRef = useRef(null);
  const activeCanvasRef = useRef(null);

  // Inking State Refs
  const isDrawingRef = useRef(false);
  const activePointsRef = useRef([]);
  const activePointerTypeRef = useRef(null);
  const strokesRef = useRef([]);
  const rtreeRef = useRef(new SpatialStrokeIndex());

  // Renders all committed strokes onto the Middle Static Offscreen Canvas Layer
  const redrawStaticLayer = useCallback(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Apply viewport transform matrix (Pan & Zoom)
    ctx.setTransform(zoomLevel, 0, 0, zoomLevel, panOffset.x, panOffset.y);

    const strokes = strokesRef.current;
    for (let i = 0; i < strokes.length; i++) {
      const stroke = strokes[i];
      drawSmoothStroke(ctx, stroke.points, {
        color: stroke.color,
        width: stroke.width,
        tool: stroke.tool,
      });
    }
  }, [width, height, zoomLevel, panOffset]);

  // Expose imperatively callable helper to erase specific stroke IDs & load/clear page strokes
  useImperativeHandle(ref, () => ({
    eraseStrokesByIds: (strokeIdsToErase) => {
      if (!strokeIdsToErase || strokeIdsToErase.length === 0) return;
      strokesRef.current = strokesRef.current.filter((s) => !strokeIdsToErase.includes(s.id));
      rtreeRef.current.clear();
      strokesRef.current.forEach((s) => rtreeRef.current.insert(s));
      redrawStaticLayer();
      if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
    },
    loadStrokes: (newStrokes = []) => {
      strokesRef.current = [...newStrokes];
      rtreeRef.current.clear();
      strokesRef.current.forEach((s) => rtreeRef.current.insert(s));
      redrawStaticLayer();
      if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
    },
    clearStrokes: () => {
      strokesRef.current = [];
      rtreeRef.current.clear();
      redrawStaticLayer();
      if (onStrokesUpdated) onStrokesUpdated([]);
    },
  }));

  // Initial setup & resize handling
  useEffect(() => {
    redrawStaticLayer();
  }, [redrawStaticLayer]);

  // Pointer Down Handler
  const handlePointerDown = (e) => {
    if (activeTool === 'pan') return;
    if (isPalmTouch(e.nativeEvent, activePointerTypeRef.current)) return;

    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    activePointerTypeRef.current = e.pointerType;

    if (onDrawingStateChange) onDrawingStateChange(true);

    const rect = canvas.getBoundingClientRect();
    const transform = { panOffset, zoomLevel };
    const points = extractPointerPoints(e.nativeEvent, rect, transform);

    activePointsRef.current = points;

    if (activeTool === 'eraser') {
      const pt = points[0];
      if (pt) {
        const hits = rtreeRef.current.queryPoint(pt.x, pt.y, strokeWidth * 3);
        if (hits.length > 0) {
          const hitIds = hits.map((s) => s.id);
          strokesRef.current = strokesRef.current.filter((s) => !hitIds.includes(s.id));
          rtreeRef.current.clear();
          strokesRef.current.forEach((s) => rtreeRef.current.insert(s));
          redrawStaticLayer();
          if (onStrokesErased) onStrokesErased(hitIds);
          if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
        }
      }
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, panOffset.x, panOffset.y);
        drawSmoothStroke(ctx, points, {
          color: strokeColor,
          width: strokeWidth,
          tool: activeTool,
        });
      }
    }
  };

  // Pointer Move Handler
  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    if (isPalmTouch(e.nativeEvent, activePointerTypeRef.current)) return;

    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const transform = { panOffset, zoomLevel };
    const newPoints = extractPointerPoints(e.nativeEvent, rect, transform);

    activePointsRef.current.push(...newPoints);

    if (activeTool === 'eraser') {
      let erasedAny = false;
      const hitIds = [];

      for (let i = 0; i < newPoints.length; i++) {
        const pt = newPoints[i];
        const hits = rtreeRef.current.queryPoint(pt.x, pt.y, strokeWidth * 3);
        for (let j = 0; j < hits.length; j++) {
          if (!hitIds.includes(hits[j].id)) {
            hitIds.push(hits[j].id);
            erasedAny = true;
          }
        }
      }

      if (erasedAny) {
        strokesRef.current = strokesRef.current.filter((s) => !hitIds.includes(s.id));
        rtreeRef.current.clear();
        strokesRef.current.forEach((s) => rtreeRef.current.insert(s));
        redrawStaticLayer();
        if (onStrokesErased) onStrokesErased(hitIds);
        if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
      }
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, panOffset.x, panOffset.y);

        drawSmoothStroke(ctx, activePointsRef.current, {
          color: strokeColor,
          width: strokeWidth,
          tool: activeTool,
        });
      }
    }
  };

  // Pointer Up Handler
  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = activeCanvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    isDrawingRef.current = false;
    activePointerTypeRef.current = null;

    if (onDrawingStateChange) onDrawingStateChange(false);

    if (activeTool !== 'eraser' && activePointsRef.current.length > 0) {
      let finalPoints = [...activePointsRef.current];
      let strokeBbox = calculateBoundingBox(finalPoints);

      // Auto-snap shape if shape snapping is enabled or requested
      if (snapShapes || activeTool === 'shape') {
        const snapResult = recognizeAndSnapShape(finalPoints, strokeBbox);
        if (snapResult.isSnapped && snapResult.points) {
          finalPoints = snapResult.points;
          strokeBbox = calculateBoundingBox(finalPoints);
        }
      }

      const newStroke = {
        id: `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        color: strokeColor,
        width: strokeWidth,
        tool: activeTool === 'shape' ? 'pen' : activeTool,
        points: finalPoints,
        bbox: strokeBbox,
      };

      const scratchResult = detectScratchOutGesture(newStroke, strokesRef.current);
      if (scratchResult.isScratch) {
        strokesRef.current = strokesRef.current.filter((s) => !scratchResult.targetIds.includes(s.id));
        rtreeRef.current.clear();
        strokesRef.current.forEach((s) => rtreeRef.current.insert(s));
        redrawStaticLayer();
        if (onStrokesErased) onStrokesErased(scratchResult.targetIds);
        if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
      } else {
        strokesRef.current.push(newStroke);
        rtreeRef.current.insert(newStroke);
        redrawStaticLayer();

        if (onStrokeAdded) onStrokeAdded(newStroke);
        if (onStrokesUpdated) onStrokesUpdated([...strokesRef.current]);
      }
    }

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
      }
    }

    activePointsRef.current = [];
  };

  return (
    <div className="relative w-full h-full">
      {/* Middle Layer: Static Ink Canvas (Offscreen Baked Strokes) */}
      <canvas
        ref={staticCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Top Layer: Active Scratchpad Canvas (O(1) Active Stroke Render & Pointer Events) */}
      <canvas
        ref={activeCanvasRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`absolute inset-0 z-20 touch-none ${
          activeTool === 'pan'
            ? 'cursor-grab active:cursor-grabbing'
            : activeTool === 'eraser'
            ? 'cursor-crosshair'
            : 'cursor-crosshair'
        }`}
      />
    </div>
  );
});

export default WhiteboardCanvas;
