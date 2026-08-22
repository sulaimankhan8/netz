'use client';

import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import CanvasGridBackground from './CanvasGridBackground';
import WhiteboardCanvas from './WhiteboardCanvas';
import PlaygroundDock from './PlaygroundDock';
import LiveMathPreviewOverlay from './LiveMathPreviewOverlay';
import BlockLinkRenderer from './BlockLinkRenderer';
import InkToBlockConverterModal from './InkToBlockConverterModal';
import SmartBlockWrapper from './blocks/SmartBlockWrapper';
import EquationBlock from './blocks/EquationBlock';
import GraphBlock from './blocks/GraphBlock';
import TheoryBlock from './blocks/TheoryBlock';
import SketchBlock from './blocks/SketchBlock';
import AudioMemoBlock from './blocks/AudioMemoBlock';
import ImageBlock from './blocks/ImageBlock';
import PageManager from './PageManager';
import { startAudioRecording, stopAudioRecording } from '../utils/audioRecorder';

import { clusterStrokes } from '../utils/spatialClusterer';
import { processClusterOCR } from '../utils/handwritingOCR';
import { preloadOCREngine } from '../utils/localOCRService';
import { initAutocompleteTrie } from '../utils/autocompleteTrie';
import { generateGraphDatasetFromLatex } from '../utils/equationToGraph';
import { exportCanvasToPng, exportCanvasToSvg, exportCanvasToPdf } from '../utils/exportEngine';
import {
  differentiateExpression,
  integrateExpression,
  solveRootsExpression,
} from '../utils/mathASTEvaluator';
import {
  smartBlockReducer,
  INITIAL_SMART_BLOCK_STATE,
  saveSessionToIndexedDB,
  loadSessionFromIndexedDB,
} from '../utils/smartBlockStore';

export default function PlaygroundCanvasContainer() {
  // Viewport Dimensions
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Viewport Transform Matrix State
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Inking Tool State
  const [activeTool, setActiveTool] = useState('pen');
  const [strokeColor, setStrokeColor] = useState('#3B82F6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [gridStyle, setGridStyle] = useState('dots');

  // Drawing & Live OCR Opt-In State (Default false = quiet, clean canvas!)
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLiveOcr, setShowLiveOcr] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState(null);

  // Notes Mode State — when true, enables lined paper, auto-OCR, and note-taking UI
  const [notesMode, setNotesMode] = useState(false);

  // Multi-Page Notebook State (Samsung Notes / Apple Notes parity)
  const [pages, setPages] = useState([{ id: 'page_1', title: 'Page 1', strokes: [], blocks: [], links: [] }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Audio Voice Memo State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Smart Block & Link Store (Reducer)
  const [blockState, dispatch] = useReducer(smartBlockReducer, INITIAL_SMART_BLOCK_STATE);

  // OCR Clusters State
  const [clusters, setClusters] = useState([]);

  // Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Pan State & Debounce Refs
  const containerRef = useRef(null);
  const isMiddlePanRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const ocrDebounceTimerRef = useRef(null);
  const whiteboardCanvasRef = useRef(null);

  // Load Session from IndexedDB on Mount
  useEffect(() => {
    loadSessionFromIndexedDB('default_session', (saved) => {
      if (saved) {
        dispatch({ type: 'SET_SESSION', payload: saved });
      }
    });

    // Pre-warm the Tesseract WASM OCR engine in background
    // Downloads ~3MB model on first visit (browser-cached after that)
    preloadOCREngine();

    // Pre-warm English word Trie with 7-day IndexedDB cache in background
    initAutocompleteTrie();
  }, []);

  // Save Session to IndexedDB when blocks or links change
  useEffect(() => {
    saveSessionToIndexedDB('default_session', {
      blocks: blockState.blocks,
      links: blockState.links,
    });
  }, [blockState.blocks, blockState.links]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Clipboard Paste Handler (Ctrl+V / Cmd+V for images)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              handleInsertImage(event.target.result);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [panOffset, dimensions, zoomLevel]);

  // Stroke Updates Listener
  const handleStrokesUpdated = useCallback((allStrokes) => {
    if (ocrDebounceTimerRef.current) {
      clearTimeout(ocrDebounceTimerRef.current);
    }

    const rawClusters = clusterStrokes(allStrokes, 90);
    const hasInstantEquals = rawClusters.some((c) => c.hasEqualsGesture);
    const delay = hasInstantEquals ? 100 : 800;

    // Immediately show clusters in 'pending' state so preview pills render with spinners
    const pendingClusters = rawClusters.map((c) => ({
      ...c,
      detectedText: '',
      isMath: false,
      evaluatedResult: null,
      confidence: 0,
      ocrStatus: 'pending', // 'pending' | 'recognized' | 'error' | 'no_api_key'
    }));
    setClusters(pendingClusters);

    ocrDebounceTimerRef.current = setTimeout(async () => {
      const processed = await Promise.all(
        rawClusters.map(async (c) => {
          const res = await processClusterOCR(c);
          return {
            ...c,
            detectedText: res ? res.detectedText : '',
            isMath: res ? res.isMath : false,
            evaluatedResult: res ? res.evaluatedResult : null,
            confidence: res ? res.confidence : 0,
            ocrStatus: res ? (res.status || 'recognized') : 'error',
            ocrError: res ? res.error : null,
          };
        })
      );

      // Show ALL clusters — including those with empty text (they get 'error' or 'no_api_key' status)
      setClusters(processed);

      // Auto-select latest recognized cluster if Lasso tool is active
      const recognizedClusters = processed.filter((c) => c.detectedText);
      if (recognizedClusters.length > 0 && activeTool === 'lasso') {
        setSelectedClusterId(recognizedClusters[recognizedClusters.length - 1].clusterId);
      }
    }, delay);
  }, [activeTool]);

  // Spawn New Smart Block
  const handleAddBlock = (type) => {
    const newBlockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const spawnX = Math.round((-panOffset.x + dimensions.width / 2 - 190) / zoomLevel);
    const spawnY = Math.round((-panOffset.y + dimensions.height / 2 - 100) / zoomLevel);

    let defaultContent = {};
    if (type === 'equation') {
      defaultContent = { latex: 'y = x^2 - 4x + 3' };
    } else if (type === 'graph') {
      const graphDataset = generateGraphDatasetFromLatex('y = x^2 - 4x + 3', 'f(x)', [-10, 10], 0);
      defaultContent = {
        graphData: {
          labels: graphDataset ? graphDataset.data.map((p) => p.x) : [],
          datasets: graphDataset ? [graphDataset] : [],
        },
      };
    } else if (type === 'theory') {
      defaultContent = { text: 'Class Notes: Tap anywhere on this text to edit or correct words.' };
    }

    const newBlock = {
      blockId: newBlockId,
      type,
      content: defaultContent,
      linkedBlockIds: [],
      position: { x: spawnX, y: spawnY },
      size: { width: 380, height: 260 },
      status: 'active',
      isMinimal: false,
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
  };

  // Handle Image Insertion onto Canvas
  const handleInsertImage = (dataUrl) => {
    if (!dataUrl) return;
    const spawnX = Math.round((-panOffset.x + dimensions.width / 2 - 180) / zoomLevel);
    const spawnY = Math.round((-panOffset.y + dimensions.height / 2 - 140) / zoomLevel);

    const imageBlockId = `block_img_${Date.now()}`;
    const imageBlock = {
      blockId: imageBlockId,
      type: 'image',
      content: {
        imageUrl: dataUrl,
        caption: 'Inserted image',
      },
      linkedBlockIds: [],
      position: { x: spawnX, y: spawnY },
      size: { width: 360, height: 280 },
      status: 'active',
      isMinimal: false,
    };

    dispatch({ type: 'ADD_BLOCK', payload: imageBlock });
  };

  // Handle Voice Memo Recording Toggle
  const handleToggleRecordAudio = async () => {
    if (isRecordingAudio) {
      try {
        const audioResult = await stopAudioRecording();
        setIsRecordingAudio(false);

        if (audioResult && audioResult.dataUrl) {
          const spawnX = Math.round((-panOffset.x + dimensions.width / 2 - 160) / zoomLevel);
          const spawnY = Math.round((-panOffset.y + dimensions.height / 2 - 60) / zoomLevel);

          const audioBlockId = `block_audio_${Date.now()}`;
          const audioBlock = {
            blockId: audioBlockId,
            type: 'audio',
            content: {
              audioUrl: audioResult.dataUrl,
              durationSec: Math.round(audioResult.durationMs / 1000),
              title: `Lecture Audio (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            },
            linkedBlockIds: [],
            position: { x: spawnX, y: spawnY },
            size: { width: 320, height: 110 },
            status: 'active',
            isMinimal: false,
          };

          dispatch({ type: 'ADD_BLOCK', payload: audioBlock });
        }
      } catch (err) {
        console.error('Failed to stop audio recording:', err);
        setIsRecordingAudio(false);
      }
    } else {
      try {
        await startAudioRecording();
        setIsRecordingAudio(true);
      } catch (err) {
        alert(err.message || 'Microphone access is required for audio recording.');
        setIsRecordingAudio(false);
      }
    }
  };

  // Multi-Page Actions
  const handleSelectPage = (newIdx) => {
    if (newIdx === currentPageIndex) return;
    // Save current page state
    setPages((prev) => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: blockState.blocks,
        links: blockState.links,
      };
      return updated;
    });

    const targetPage = pages[newIdx];
    setCurrentPageIndex(newIdx);

    // Load target page blocks
    dispatch({
      type: 'SET_SESSION',
      payload: {
        blocks: targetPage.blocks || [],
        links: targetPage.links || [],
      },
    });

    // Load target page strokes
    if (whiteboardCanvasRef.current) {
      whiteboardCanvasRef.current.loadStrokes(targetPage.strokes || []);
    }
  };

  const handleAddPage = () => {
    const newPageNum = pages.length + 1;
    const newPage = {
      id: `page_${Date.now()}`,
      title: `Page ${newPageNum}`,
      strokes: [],
      blocks: [],
      links: [],
    };

    setPages((prev) => [...prev, newPage]);
    handleSelectPage(pages.length);
  };

  const handleDeletePage = (delIdx) => {
    if (pages.length <= 1) return;
    const remaining = pages.filter((_, idx) => idx !== delIdx);
    setPages(remaining);
    const newIdx = Math.min(currentPageIndex, remaining.length - 1);
    handleSelectPage(newIdx);
  };

  const handleDuplicatePage = (dupIdx) => {
    const srcPage = pages[dupIdx];
    const dupPage = {
      id: `page_${Date.now()}`,
      title: `${srcPage.title} (Copy)`,
      strokes: [...(srcPage.strokes || [])],
      blocks: JSON.parse(JSON.stringify(blockState.blocks || [])),
      links: JSON.parse(JSON.stringify(blockState.links || [])),
    };
    setPages((prev) => [...prev, dupPage]);
  };

  // Convert OCR Handwriting Cluster to In-Place Editable Typed Block (Replacing Ink)
  // Accepts optional editedText override from user corrections in the preview pill
  const handleConvertClusterToBlock = (cluster, editedText = null) => {
    const spawnX = cluster.bbox.minX;
    const spawnY = cluster.bbox.minY;
    const width = Math.max(260, (cluster.bbox.maxX - cluster.bbox.minX) + 60);

    const finalText = editedText !== null ? editedText : (cluster.detectedText || '');

    const newBlockId = `block_${Date.now()}`;
    const blockType = cluster.isMath ? 'equation' : 'theory';
    const content = cluster.isMath
      ? { latex: finalText }
      : { text: finalText };

    const newBlock = {
      blockId: newBlockId,
      type: blockType,
      content,
      linkedBlockIds: [],
      position: { x: spawnX, y: spawnY },
      size: { width, height: 100 },
      status: 'active',
      isMinimal: !cluster.isMath,
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });

    // Erase converted handwritten ink strokes from canvas
    if (whiteboardCanvasRef.current && cluster.strokeIds) {
      whiteboardCanvasRef.current.eraseStrokesByIds(cluster.strokeIds);
    }

    // Remove preview pill once converted
    setClusters((prev) => prev.filter((c) => c.clusterId !== cluster.clusterId));
    setSelectedClusterId(null);
  };

  // Plot Graph from Equation Block
  const handlePlotGraph = (equationBlock, latexStr) => {
    const dataset = generateGraphDatasetFromLatex(latexStr, 'f(x)', [-10, 10], 0);
    const graphBlockId = `block_graph_${Date.now()}`;

    const graphBlock = {
      blockId: graphBlockId,
      type: 'graph',
      content: {
        graphData: {
          labels: dataset ? dataset.data.map((p) => p.x) : [],
          datasets: dataset ? [dataset] : [],
        },
      },
      linkedBlockIds: [equationBlock.blockId],
      position: {
        x: equationBlock.position.x + 420,
        y: equationBlock.position.y,
      },
      size: { width: 420, height: 280 },
      status: 'active',
      isMinimal: false,
    };

    dispatch({ type: 'ADD_BLOCK', payload: graphBlock });
    dispatch({
      type: 'LINK_BLOCKS',
      payload: { sourceBlockId: equationBlock.blockId, targetBlockId: graphBlockId },
    });
  };

  // Handle Contextual CAS AI Actions
  const handleSelectAiAction = (block, actionKey) => {
    const latexStr = block.content?.latex || 'x^2 - 4';

    if (actionKey === 'PLOT_GRAPH') {
      handlePlotGraph(block, latexStr);
    } else if (actionKey === 'DIFFERENTIATE') {
      const derivLatex = differentiateExpression(latexStr, 'x');
      const derivBlockId = `block_deriv_${Date.now()}`;
      const derivBlock = {
        blockId: derivBlockId,
        type: 'equation',
        content: { latex: derivLatex },
        linkedBlockIds: [block.blockId],
        position: { x: block.position.x + 400, y: block.position.y },
        size: { width: 380, height: 180 },
        status: 'active',
        isMinimal: false,
      };
      dispatch({ type: 'ADD_BLOCK', payload: derivBlock });
      dispatch({ type: 'LINK_BLOCKS', payload: { sourceBlockId: block.blockId, targetBlockId: derivBlockId } });
    } else if (actionKey === 'INTEGRATE') {
      const integLatex = integrateExpression(latexStr, 'x');
      const integBlockId = `block_integ_${Date.now()}`;
      const integBlock = {
        blockId: integBlockId,
        type: 'equation',
        content: { latex: integLatex },
        linkedBlockIds: [block.blockId],
        position: { x: block.position.x + 400, y: block.position.y + 120 },
        size: { width: 380, height: 180 },
        status: 'active',
        isMinimal: false,
      };
      dispatch({ type: 'ADD_BLOCK', payload: integBlock });
      dispatch({ type: 'LINK_BLOCKS', payload: { sourceBlockId: block.blockId, targetBlockId: integBlockId } });
    } else if (actionKey === 'FIND_ROOTS') {
      const roots = solveRootsExpression(latexStr, 'x');
      const rootsText = roots.length > 0
        ? `Roots of $${latexStr}$: $x = ${roots.join(', ')}$`
        : `No real roots found for $${latexStr}$.`;

      const rootsBlockId = `block_roots_${Date.now()}`;
      const rootsBlock = {
        blockId: rootsBlockId,
        type: 'theory',
        content: { text: rootsText },
        linkedBlockIds: [block.blockId],
        position: { x: block.position.x + 400, y: block.position.y },
        size: { width: 380, height: 180 },
        status: 'active',
        isMinimal: false,
      };
      dispatch({ type: 'ADD_BLOCK', payload: rootsBlock });
      dispatch({ type: 'LINK_BLOCKS', payload: { sourceBlockId: block.blockId, targetBlockId: rootsBlockId } });
    }
  };

  // Export Canvas Handler
  const handleExportCanvas = (format) => {
    if (!containerRef.current) return;
    if (format === 'PNG') {
      exportCanvasToPng(containerRef.current);
    } else if (format === 'SVG') {
      exportCanvasToSvg(containerRef.current);
    } else if (format === 'PDF') {
      exportCanvasToPdf(containerRef.current);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.2, 0.2));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Wheel Handler for Panning & Pinch-Zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoomLevel((prevZoom) => Math.min(Math.max(prevZoom * zoomFactor, 0.2), 5));
    } else {
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Middle-Click Pan Handler & Canvas Selection Click Handler
  const handleMouseDown = (e) => {
    if (e.button === 1 || activeTool === 'pan') {
      isMiddlePanRef.current = true;
      startPanRef.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      };
    } else if (activeTool === 'lasso' && clusters.length > 0) {
      // Find cluster under click point
      const canvasX = (e.clientX - panOffset.x) / zoomLevel;
      const canvasY = (e.clientY - panOffset.y) / zoomLevel;

      const hitCluster = clusters.find((c) =>
        canvasX >= c.bbox.minX - 20 &&
        canvasX <= c.bbox.maxX + 20 &&
        canvasY >= c.bbox.minY - 20 &&
        canvasY <= c.bbox.maxY + 20
      );

      if (hitCluster) {
        setSelectedClusterId(hitCluster.clusterId);
      } else {
        setSelectedClusterId(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isMiddlePanRef.current) return;
    setPanOffset({
      x: e.clientX - startPanRef.current.x,
      y: e.clientY - startPanRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isMiddlePanRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-screen h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 select-none"
    >
      {/* Layer 1: Static Grid Background */}
      <CanvasGridBackground
        gridStyle={notesMode ? 'lines' : gridStyle}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Layer 2 & 3: Hardware Accelerated Whiteboard Canvas */}
      <WhiteboardCanvas
        ref={whiteboardCanvasRef}
        activeTool={activeTool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        width={dimensions.width}
        height={dimensions.height}
        onStrokesUpdated={handleStrokesUpdated}
        onDrawingStateChange={setIsDrawing}
      />

      {/* Layer 4: SVG Bézier Link Path Connectors */}
      <BlockLinkRenderer
        links={blockState.links}
        blocks={blockState.blocks}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
      />

      {/* Layer 5: Smart Blocks Suite */}
      {blockState.blocks.map((block) => (
        <SmartBlockWrapper
          key={block.blockId}
          block={block}
          zoomLevel={zoomLevel}
          onUpdatePosition={(blockId, pos) => dispatch({ type: 'UPDATE_BLOCK_POSITION', payload: { blockId, position: pos } })}
          onDeleteBlock={(blockId) => dispatch({ type: 'REMOVE_BLOCK', payload: blockId })}
          onSelectAiAction={handleSelectAiAction}
        >
          {block.type === 'equation' && (
            <EquationBlock
              block={block}
              onUpdateContent={(blockId, content) => dispatch({ type: 'UPDATE_BLOCK_CONTENT', payload: { blockId, content } })}
              onPlotGraph={handlePlotGraph}
            />
          )}

          {block.type === 'graph' && <GraphBlock block={block} />}

          {block.type === 'theory' && (
            <TheoryBlock
              block={block}
              onUpdateContent={(blockId, content) => dispatch({ type: 'UPDATE_BLOCK_CONTENT', payload: { blockId, content } })}
            />
          )}

          {block.type === 'sketch' && (
            <SketchBlock
              block={block}
              onConvertSketchToEquation={(sketchBlock, latexStr) => {
                const eqId = `block_eq_${Date.now()}`;
                const newEqBlock = {
                  blockId: eqId,
                  type: 'equation',
                  content: { latex: latexStr },
                  linkedBlockIds: [],
                  position: { x: sketchBlock.position.x + 400, y: sketchBlock.position.y },
                  size: { width: 380, height: 180 },
                  status: 'active',
                  isMinimal: false,
                };
                dispatch({ type: 'ADD_BLOCK', payload: newEqBlock });
              }}
            />
          )}

          {block.type === 'audio' && (
            <AudioMemoBlock
              block={block}
              onUpdateContent={(blockId, content) => dispatch({ type: 'UPDATE_BLOCK_CONTENT', payload: { blockId, content } })}
              onDeleteBlock={(blockId) => dispatch({ type: 'REMOVE_BLOCK', payload: blockId })}
            />
          )}

          {block.type === 'image' && (
            <ImageBlock block={block} />
          )}
        </SmartBlockWrapper>
      ))}

      {/* Top Floating Page Manager (Multi-Page Notebook) */}
      <div className="fixed top-4 left-4 z-40">
        <PageManager
          pages={pages}
          currentPageIndex={currentPageIndex}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
        />
      </div>

      {/* Live Universal Text & KaTeX Preview Pill Overlay */}
      <LiveMathPreviewOverlay
        clusters={clusters}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        isDrawing={isDrawing}
        showLiveOcr={showLiveOcr}
        selectedClusterId={selectedClusterId}
        onConvertCluster={handleConvertClusterToBlock}
        onPlotClusterGraph={(cluster) => {
          handleConvertClusterToBlock(cluster);
        }}
      />

      {/* Workspace Sync Modal */}
      <InkToBlockConverterModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        blocks={blockState.blocks}
        onConfirmSync={(payload) => {
          // Save to Notes workspace via localStorage
          try {
            const existingNotes = JSON.parse(localStorage.getItem('netz_notes') || '[]');
            const newNote = {
              id: `note_${Date.now()}`,
              title: payload.title || 'Playground Math Session Notes',
              subtitle: 'Synced from Playground Whiteboard',
              tags: ['Playground', 'Math'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isPublic: false,
              accessKey: `NETZ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
              author: 'Student',
              blocks: payload.blocks.map((b, idx) => ({
                id: b.id || `b-${Date.now()}-${idx}`,
                type: b.type === 'math' ? 'math' : b.type === 'graph' ? 'paragraph' : 'paragraph',
                content: typeof b.content === 'string' ? b.content : JSON.stringify(b.content),
              })),
            };
            existingNotes.unshift(newNote);
            localStorage.setItem('netz_notes', JSON.stringify(existingNotes));
          } catch (err) {
            console.error('Failed to sync to Notes workspace:', err);
          }
        }}
      />

      {/* Floating Dock Controls */}
      <PlaygroundDock
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        gridStyle={gridStyle}
        setGridStyle={setGridStyle}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onAddBlock={handleAddBlock}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onExportCanvas={handleExportCanvas}
        showLiveOcr={notesMode ? true : showLiveOcr}
        setShowLiveOcr={notesMode ? undefined : setShowLiveOcr}
        notesMode={notesMode}
        setNotesMode={(mode) => {
          setNotesMode(mode);
          // Auto-enable Live OCR when entering Notes Mode
          if (mode) {
            setShowLiveOcr(true);
          }
        }}
        isRecording={isRecordingAudio}
        onToggleRecordAudio={handleToggleRecordAudio}
        onInsertImage={handleInsertImage}
      />
    </div>
  );
}
