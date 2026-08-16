'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Plot = ({ points = [], title = "Runge-Kutta 4th Order Solution Curve" }) => {
  if (!points || points.length === 0) return null;

  const labels = points.map(p => p.x.toFixed(2));
  const dataValues = points.map(p => p.y);

  const data = {
    labels,
    datasets: [
      {
        label: 'RK4 Approximated y(x)',
        data: dataValues,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        pointRadius: 4,
        tension: 0.2,
      },
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
      <Line data={data} options={options} />
    </div>
  );
};

export default Plot;
