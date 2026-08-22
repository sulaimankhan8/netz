'use client';

import React from 'react';

/**
 * ImageBlock Component
 * Displays an inserted or pasted image on the canvas.
 * Allows moving, annotating, and viewing diagrams/photos alongside math notes.
 */
export default function ImageBlock({ block }) {
  const imageUrl = block.content?.imageUrl || '';
  const caption = block.content?.caption || '';

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={caption || 'Note attachment'}
          className="max-h-[360px] w-auto object-contain rounded-lg shadow-sm pointer-events-none select-none"
        />
      ) : (
        <div className="p-8 text-center text-xs text-zinc-400">
          No image provided.
        </div>
      )}

      {caption && (
        <span className="mt-1.5 text-[11px] text-zinc-500 font-medium italic">
          {caption}
        </span>
      )}
    </div>
  );
}
