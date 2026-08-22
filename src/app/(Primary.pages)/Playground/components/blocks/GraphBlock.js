'use client';

import React from 'react';
import UnifiedPlot from '../../../../components/UnifiedPlot';

export default function GraphBlock({ block }) {
  const graphData = block.content?.graphData || {
    labels: [-10, -5, 0, 5, 10],
    datasets: [
      {
        label: 'y = x^2 - 4',
        data: [96, 21, -4, 21, 96],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
      },
    ],
  };

  return (
    <div className="w-full h-56 min-h-[220px]">
      <UnifiedPlot
        data={graphData}
        title={block.content?.title || 'Interactive Function Plot'}
      />
    </div>
  );
}
