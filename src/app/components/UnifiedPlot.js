'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
} from 'chart.js';
import { evaluateMath } from '@/app/utils/evaluateMath';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale
);

const UnifiedPlot = ({
  iterations = [],
  dataPoints = [],
  points = [],
  steps = [],
  functionInput = '',
  darkTheme = false,
  title = '',
  xLabel = 'Iteration',
  yLabel = 'Values',
  datasetLabel = 'Plot Curve / Data',
  curveLabel = 'Function Curve',
}) => {
  const chartData = useMemo(() => {
    const rawList = iterations.length > 0
      ? iterations
      : (dataPoints.length > 0 ? dataPoints : (points.length > 0 ? points : steps));

    const extractedPoints = rawList.map((item) => {
      if (typeof item === 'number') return item;
      if (typeof item === 'object' && item !== null) {
        return item.c ?? item.y ?? item.x ?? item.val ?? 0;
      }
      return 0;
    });

    const labels = rawList.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        return item.iteration ?? item.step ?? item.x ?? (index + 1);
      }
      return index + 1;
    });

    const datasets = [
      {
        label: datasetLabel,
        data: extractedPoints,
        borderColor: 'rgba(153, 5, 138, 1)',
        backgroundColor: 'rgba(153, 5, 138, 0.2)',
        fill: false,
        pointRadius: 4,
        tension: 0.1,
      },
    ];

    // If a math function string is provided, safely generate curve points
    if (functionInput && typeof functionInput === 'string') {
      try {
        const xValues = Array.from({ length: 41 }, (_, i) => (i - 20) * 0.5);
        const functionValues = xValues.map((x) => {
          try {
            return evaluateMath(functionInput, x);
          } catch {
            return null;
          }
        });

        datasets.push({
          label: curveLabel,
          data: functionValues,
          borderColor: 'rgba(245, 167, 66, 1)',
          fill: false,
          pointRadius: 0,
        });
      } catch {
        // Ignore invalid function input gracefully
      }
    }

    return {
      labels,
      datasets,
    };
  }, [iterations, dataPoints, points, steps, functionInput, datasetLabel, curveLabel]);

  const options = useMemo(() => {
    const textColor = darkTheme ? '#f3f4f6' : '#000000';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: title ? {
          display: true,
          text: title,
          color: textColor,
          font: { size: 16 },
        } : { display: false },
        legend: {
          position: 'top',
          labels: {
            font: { size: 14 },
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const val = typeof context.raw === 'number' ? context.raw.toFixed(4) : context.raw;
              return `${context.dataset.label}: ${val}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xLabel,
            color: textColor,
            font: { size: 14 },
          },
          ticks: {
            color: textColor,
            font: { size: 13 },
          },
          grid: {
            color: darkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
        y: {
          title: {
            display: true,
            text: yLabel,
            color: textColor,
            font: { size: 14 },
          },
          ticks: {
            color: textColor,
            font: { size: 13 },
          },
          grid: {
            color: darkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    };
  }, [darkTheme, title, xLabel, yLabel]);

  return (
    <div className="plot-container w-full h-[400px]">
      <Line id="graphCanvas" data={chartData} options={options} />
    </div>
  );
};

export default React.memo(UnifiedPlot);
