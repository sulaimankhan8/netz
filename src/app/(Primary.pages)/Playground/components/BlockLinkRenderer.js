'use client';

import React from 'react';

export default function BlockLinkRenderer({
  links = [],
  blocks = [],
  zoomLevel = 1,
  panOffset = { x: 0, y: 0 },
}) {
  if (!links || links.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
      <defs>
        <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {links.map((link) => {
        const source = blocks.find((b) => b.blockId === link.sourceBlockId);
        const target = blocks.find((b) => b.blockId === link.targetBlockId);

        if (!source || !target) return null;

        // Calculate screen positions
        const x1 = (source.position.x + (source.size?.width || 380) / 2) * zoomLevel + panOffset.x;
        const y1 = (source.position.y + 20) * zoomLevel + panOffset.y;
        const x2 = (target.position.x + (target.size?.width || 380) / 2) * zoomLevel + panOffset.x;
        const y2 = (target.position.y + 20) * zoomLevel + panOffset.y;

        // Cubic Bézier control points
        const dx = Math.abs(x2 - x1) * 0.5;
        const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        return (
          <g key={link.linkId}>
            <path
              d={pathData}
              fill="none"
              stroke="url(#linkGradient)"
              strokeWidth={3 * Math.min(zoomLevel, 1.5)}
              strokeDasharray="6 4"
              className="animate-pulse"
            />
            <circle cx={x1} cy={y1} r={4} fill="#3B82F6" />
            <circle cx={x2} cy={y2} r={4} fill="#8B5CF6" />
          </g>
        );
      })}
    </svg>
  );
}
