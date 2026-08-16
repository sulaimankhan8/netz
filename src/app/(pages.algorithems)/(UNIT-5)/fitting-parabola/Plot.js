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

const Plot = ({ dataPoints = [], parabolaCoeffs = null, title = "Parabola Curve Fit" }) => {
  if (!dataPoints || dataPoints.length === 0) return null;

  const scatterData = dataPoints.map(p => ({ x: p.x, y: p.y }));

  const minX = Math.min(...dataPoints.map(p => p.x));
  const maxX = Math.max(...dataPoints.map(p => p.x));
  
  let lineData = [];
  if (parabolaCoeffs) {
    const { a, b, c } = parabolaCoeffs; // y = a*x^2 + b*x + c
    const steps = 50;
    const stepSize = (maxX - minX) / steps;
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize;
      const y = a * x * x + b * x + c;
      lineData.push({ x, y });
    }
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
        label: 'Fitted Parabola y = ax^2 + bx + c',
        data: lineData,
        type: 'line',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 3,
        pointRadius: 0,
        fill: false,
        tension: 0.4
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
