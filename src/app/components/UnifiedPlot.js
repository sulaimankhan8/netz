'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  ScatterController,
} from 'chart.js';
import { evaluateMath } from '@/app/utils/evaluateMath';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  ScatterController
);

const UnifiedPlot = ({
  iterations = [],
  dataPoints = [],
  points = [],
  steps = [],
  functionInput = '',
  darkTheme: propDarkTheme,
  title = '',
  xLabel = 'x',
  yLabel = 'f(x)',
  datasetLabel = 'Iteration Points',
  curveLabel = 'Function f(x)',
}) => {
  // Theme state detection
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof propDarkTheme === 'boolean') {
      setIsDark(propDarkTheme);
      return;
    }
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [propDarkTheme]);

  const chartData = useMemo(() => {
    const rawList = iterations.length > 0
      ? iterations
      : (dataPoints.length > 0 ? dataPoints : (points.length > 0 ? points : steps));

    // Extract numerical x and y values for iteration points
    const iterPoints = rawList.map((item, idx) => {
      if (typeof item === 'number') {
        return { x: idx + 1, y: item };
      }
      if (typeof item === 'object' && item !== null) {
        const xVal = item.c ?? item.x ?? item.x_n ?? item.x0 ?? (idx + 1);
        
        let yVal;
        if (item.fc !== undefined) {
          yVal = item.fc;
        } else if (item.fx !== undefined) {
          yVal = item.fx;
        } else if (item.x_next !== undefined) {
          yVal = item.x_next;
        } else if (item.y !== undefined) {
          yVal = item.y;
        } else if (functionInput && typeof functionInput === 'string') {
          try {
            yVal = evaluateMath(functionInput, Number(xVal));
          } catch {
            yVal = 0;
          }
        } else {
          yVal = 0;
        }

        return { x: Number(xVal), y: Number(yVal), iter: item.iteration ?? item.iter ?? item.step ?? (idx + 1) };
      }
      return { x: idx + 1, y: 0 };
    });

    // Check if this is a Fixed-Point Iteration dataset (has x_n and x_next)
    const isFixedPoint = rawList.length > 0 && typeof rawList[0] === 'object' && rawList[0] !== null && 'x_n' in rawList[0] && 'x_next' in rawList[0];

    // Calculate domain [minX, maxX]
    let minX = -5;
    let maxX = 5;

    if (iterPoints.length > 0) {
      const allX = iterPoints.map(p => p.x).filter(x => !isNaN(x) && isFinite(x));
      if (allX.length > 0) {
        const minVal = Math.min(...allX);
        const maxVal = Math.max(...allX);
        const pad = Math.max((maxVal - minVal) * 0.3, 1.5);
        minX = minVal - pad;
        maxX = maxVal + pad;
      }
    }

    // Generate smooth continuous curve points for f(x)
    const curvePoints = [];
    if (functionInput && typeof functionInput === 'string') {
      const stepsCount = 120;
      const stepSize = (maxX - minX) / stepsCount;
      for (let i = 0; i <= stepsCount; i++) {
        const x = minX + i * stepSize;
        try {
          const y = evaluateMath(functionInput, x);
          if (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e5) {
            curvePoints.push({ x, y });
          }
        } catch {
          // Ignore non-evaluable domain points gracefully
        }
      }
    }

    // Build zero-baseline reference line y = 0
    const zeroLinePoints = [
      { x: minX, y: 0 },
      { x: maxX, y: 0 },
    ];

    const datasets = [];

    // 1. Function Curve Dataset
    if (curvePoints.length > 0) {
      datasets.push({
        type: 'line',
        label: isFixedPoint ? 'Function g(x)' : curveLabel,
        data: curvePoints,
        borderColor: isDark ? '#38bdf8' : '#0284c7', // Vibrant sky blue
        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.05)',
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
        tension: 0.3,
      });
    }

    // 2. Reference Line (y = x for Fixed-Point Cobweb, y = 0 for general root-finding)
    if (isFixedPoint) {
      datasets.push({
        type: 'line',
        label: 'y = x Line',
        data: [
          { x: minX, y: minX },
          { x: maxX, y: maxX },
        ],
        borderColor: isDark ? '#f59e0b' : '#d97706', // Warm amber/gold
        borderWidth: 1.8,
        borderDash: [6, 4],
        fill: false,
        pointRadius: 0,
      });
    } else {
      datasets.push({
        type: 'line',
        label: 'y = 0 Axis',
        data: zeroLinePoints,
        borderColor: isDark ? 'rgba(156, 163, 175, 0.4)' : 'rgba(107, 114, 128, 0.4)',
        borderWidth: 1.5,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      });
    }

    // 3. Cobweb Trajectory Stair Dataset (Fixed-Point Method)
    if (isFixedPoint && rawList.length > 0) {
      const cobwebPoints = [];
      rawList.forEach((item, idx) => {
        const xN = Number(item.x_n);
        const xNext = Number(item.x_next);
        if (!isNaN(xN) && !isNaN(xNext)) {
          if (idx === 0) {
            cobwebPoints.push({ x: xN, y: xN });
          }
          cobwebPoints.push({ x: xN, y: xNext });
          cobwebPoints.push({ x: xNext, y: xNext });
        }
      });

      if (cobwebPoints.length > 0) {
        datasets.push({
          type: 'line',
          label: 'Cobweb Path',
          data: cobwebPoints,
          borderColor: isDark ? 'rgba(52, 211, 153, 0.6)' : 'rgba(5, 150, 105, 0.6)',
          borderWidth: 1.5,
          borderDash: [3, 3],
          fill: false,
          pointRadius: 0,
          tension: 0,
        });
      }
    }

    // 4. Iteration Points Scatter Dataset
    if (iterPoints.length > 0) {
      datasets.push({
        type: 'line',
        label: isFixedPoint ? 'Iteration Points (x_n, g(x_n))' : datasetLabel,
        data: iterPoints,
        borderColor: isDark ? '#34d399' : '#059669', // Vibrant emerald green
        backgroundColor: isDark ? '#059669' : '#34d399',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: isDark ? '#10b981' : '#059669',
        pointBorderColor: isDark ? '#ffffff' : '#064e3b',
        pointBorderWidth: 2,
        tension: 0,
      });
    }

    return { datasets };
  }, [iterations, dataPoints, points, steps, functionInput, datasetLabel, curveLabel, isDark]);

  const options = useMemo(() => {
    const textColor = isDark ? '#f3f4f6' : '#111827';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeOutQuart',
      },
      plugins: {
        title: title ? {
          display: true,
          text: title,
          color: textColor,
          font: { size: 15, weight: 'bold', family: 'monospace' },
          padding: { bottom: 12 },
        } : { display: false },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            font: { size: 12, family: 'monospace', weight: 'bold' },
            color: textColor,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#ffffff' : '#111827',
          bodyColor: isDark ? '#e5e7eb' : '#374151',
          borderColor: isDark ? '#4b5563' : '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              const pt = context.raw;
              if (pt && typeof pt === 'object') {
                const xStr = typeof pt.x === 'number' ? pt.x.toFixed(4) : pt.x;
                const yStr = typeof pt.y === 'number' ? pt.y.toFixed(4) : pt.y;
                return `${context.dataset.label}: (x = ${xStr}, y = ${yStr})`;
              }
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: xLabel,
            color: textColor,
            font: { size: 13, weight: 'bold', family: 'monospace' },
          },
          ticks: {
            color: textColor,
            font: { size: 11, family: 'monospace' },
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: yLabel,
            color: textColor,
            font: { size: 13, weight: 'bold', family: 'monospace' },
          },
          ticks: {
            color: textColor,
            font: { size: 11, family: 'monospace' },
          },
          grid: {
            color: gridColor,
          },
        },
      },
    };
  }, [isDark, title, xLabel, yLabel]);

  return (
    <div className="plot-container w-full h-[400px] p-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-inner">
      <Line id="graphCanvas" data={chartData} options={options} />
    </div>
  );
};

export default React.memo(UnifiedPlot);
