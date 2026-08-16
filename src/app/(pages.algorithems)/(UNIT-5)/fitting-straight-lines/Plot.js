'use client';

import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Plot = ({ dataPoints = [], lineEquation = null, title = "Linear Regression Fit" }) => {
  if (!dataPoints || dataPoints.length === 0) return null;

  const scatterData = dataPoints.map(p => ({ x: p.x, y: p.y }));

  // Generate regression line points
  const minX = Math.min(...dataPoints.map(p => p.x));
  const maxX = Math.max(...dataPoints.map(p => p.x));
  
  let lineData = [];
  if (lineEquation) {
    const { a, b } = lineEquation; // y = a*x + b
    lineData = [
      { x: minX, y: a * minX + b },
      { x: maxX, y: a * maxX + b }
    ];
  }

  const data = {
    datasets: [
      {
        label: 'Sample Data Points (x, y)',
        data: scatterData,
        backgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 6,
      },
      {
        label: 'Fitted Line y = ax + b',
        data: lineData,
        type: 'line',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 3,
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#9CA3AF' } },
      title: { display: true, text: title, color: '#9CA3AF' },
    },
    scales: {
      x: { title: { display: true, text: 'x', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
      y: { title: { display: true, text: 'y', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
    }
  };

  return (
    <div className="w-full h-80 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 shadow-inner">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default Plot;
