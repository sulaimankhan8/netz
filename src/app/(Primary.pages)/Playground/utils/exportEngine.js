/**
 * Vector & Raster Canvas Export Engine
 * Generates high-resolution PNG images, standalone SVG vector files,
 * and PDF documents using html-to-image and jspdf.
 */

import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads a blob or data URL as a file.
 */
function downloadFile(dataUrl, fileName) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

/**
 * Exports container element as high-DPI PNG image.
 */
export async function exportCanvasToPng(containerElement, filename = 'netz-whiteboard.png') {
  if (!containerElement) return;
  try {
    const dataUrl = await toPng(containerElement, { quality: 0.95, pixelRatio: 2 });
    downloadFile(dataUrl, filename);
  } catch (err) {
    console.error('Failed to export PNG:', err);
  }
}

/**
 * Exports container element as SVG vector file.
 */
export async function exportCanvasToSvg(containerElement, filename = 'netz-whiteboard.svg') {
  if (!containerElement) return;
  try {
    const dataUrl = await toSvg(containerElement);
    downloadFile(dataUrl, filename);
  } catch (err) {
    console.error('Failed to export SVG:', err);
  }
}

/**
 * Exports container element as PDF document.
 */
export async function exportCanvasToPdf(containerElement, filename = 'netz-whiteboard.pdf') {
  if (!containerElement) return;
  try {
    const dataUrl = await toPng(containerElement, { quality: 0.95, pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [containerElement.clientWidth || 1200, containerElement.clientHeight || 800],
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, containerElement.clientWidth || 1200, containerElement.clientHeight || 800);
    pdf.save(filename);
  } catch (err) {
    console.error('Failed to export PDF:', err);
  }
}
