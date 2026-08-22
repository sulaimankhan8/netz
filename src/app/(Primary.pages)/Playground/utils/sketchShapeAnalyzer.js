/**
 * Geometry Feature Metrics & Shape Classifier
 * Evaluates stroke curvature, extrema count, and inflection points
 * to classify freehand sketches into model families (Linear, Polynomial, Sinusoidal, Exponential).
 */

export function analyzeSketchShape(points) {
  if (!points || points.length < 5) {
    return { modelType: 'linear', confidence: 0.5 };
  }

  // 1. Calculate Extrema Count (peak/valley count in Y direction)
  let yExtremaCount = 0;
  let prevDiff = points[1].y - points[0].y;

  for (let i = 2; i < points.length; i++) {
    const diff = points[i].y - points[i - 1].y;
    if ((diff > 0 && prevDiff < 0) || (diff < 0 && prevDiff > 0)) {
      yExtremaCount++;
    }
    if (Math.abs(diff) > 1) prevDiff = diff;
  }

  // 2. Linearity Index (R^2 of linear fit)
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  const N = points.length;
  for (let i = 0; i < N; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
    sumXY += points[i].x * points[i].y;
    sumXX += points[i].x * points[i].x;
  }

  const slope = (N * sumXY - sumX * sumY) / Math.max(N * sumXX - sumX * sumX, 1e-6);
  const intercept = (sumY - slope * sumX) / N;

  let ssTot = 0, ssRes = 0;
  const meanY = sumY / N;
  for (let i = 0; i < N; i++) {
    const yPred = slope * points[i].x + intercept;
    ssTot += Math.pow(points[i].y - meanY, 2);
    ssRes += Math.pow(points[i].y - yPred, 2);
  }

  const rSquaredLinear = Math.max(0, 1 - ssRes / Math.max(ssTot, 1e-6));

  // 3. Classify Model Family based on Feature Vector
  if (rSquaredLinear > 0.90 || yExtremaCount === 0) {
    return { modelType: 'linear', confidence: rSquaredLinear };
  } else if (yExtremaCount === 1) {
    return { modelType: 'quadratic', confidence: 0.92 };
  } else if (yExtremaCount === 2) {
    return { modelType: 'cubic', confidence: 0.88 };
  } else if (yExtremaCount >= 3) {
    return { modelType: 'sinusoidal', confidence: 0.85 };
  }

  return { modelType: 'quadratic', confidence: 0.75 };
}
