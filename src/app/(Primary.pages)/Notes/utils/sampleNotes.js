export const INITIAL_SAMPLE_NOTES = [
  {
    id: 'note-demo-1',
    title: 'Unit 1: Newton-Raphson & Root Finding Notes',
    subtitle: 'Iterative numerical methods for solving algebraic & transcendental equations f(x) = 0',
    tags: ['Unit 1', 'Calculus', 'Newton Raphson'],
    accessKey: 'NETZ-1A99',
    isPublic: true,
    createdAt: new Date('2026-08-16T08:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b1',
        type: 'heading1',
        content: 'Newton-Raphson Iterative Method'
      },
      {
        id: 'b2',
        type: 'paragraph',
        content: 'The Newton-Raphson method is a powerful second-order root finding technique based on linear approximation via tangent lines. Type "/" anywhere to insert interactive math calculators.'
      },
      {
        id: 'b3',
        type: 'math',
        content: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}'
      },
      {
        id: 'b4',
        type: 'callout',
        content: '💡 Quadratic Convergence: Newton-Raphson doubles the number of accurate decimal digits in each iteration when initial guess x0 is sufficiently close to the real root.'
      },
      {
        id: 'b5',
        type: 'widget',
        content: 'Newton-Raphson Method',
        widgetConfig: {
          algorithmId: 'newton-raphson',
          params: { expression: 'x^3 - 4*x - 9', x0: 2.5, tolerance: 0.0001 }
        }
      }
    ]
  },
  {
    id: 'note-demo-2',
    title: 'Unit 2: Newton Forward & Backward Interpolation',
    subtitle: 'Polynomial interpolation formulas for equal and unequal data intervals',
    tags: ['Unit 2', 'Interpolation', 'Differences'],
    accessKey: 'NETZ-2B88',
    isPublic: true,
    createdAt: new Date('2026-08-16T09:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b2-1',
        type: 'heading1',
        content: "Newton's Forward Interpolation"
      },
      {
        id: 'b2-2',
        type: 'paragraph',
        content: 'Used when target X lies near the top of a tabulated dataset with equal spacing h = x_{i+1} - x_i.'
      },
      {
        id: 'b2-3',
        type: 'math',
        content: 'y(x) = y_0 + u \\Delta y_0 + \\frac{u(u-1)}{2!} \\Delta^2 y_0 + \\dots'
      },
      {
        id: 'b2-4',
        type: 'widget',
        content: "Newton's Forward Interpolation",
        widgetConfig: {
          algorithmId: 'newton-forward',
          params: { xValues: '10, 20, 30, 40', yValues: '46, 66, 81, 93', targetX: 15 }
        }
      }
    ]
  },
  {
    id: 'note-demo-3',
    title: 'Unit 5: Hypothesis Testing & Z-Test Notes',
    subtitle: 'Key definitions for null hypothesis, p-values, and test statistics',
    tags: ['Unit 5', 'Statistics', 'Z-Test'],
    accessKey: 'NETZ-3C77',
    isPublic: true,
    createdAt: new Date('2026-08-16T10:00:00Z').toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b3-1',
        type: 'heading1',
        content: 'Z-Test Formula for Single Mean'
      },
      {
        id: 'b3-2',
        type: 'paragraph',
        content: 'When population standard deviation σ is known and sample size n ≥ 30, the Z test statistic is calculated as follows:'
      },
      {
        id: 'b3-3',
        type: 'math',
        content: 'Z = \\frac{\\bar{X} - \\mu_0}{\\frac{\\sigma}{\\sqrt{n}}}'
      },
      {
        id: 'b3-4',
        type: 'callout',
        content: '⚠️ Critical Values: For a two-tailed test at α = 0.05 level of significance, Z_critical = ±1.96.'
      },
      {
        id: 'b3-5',
        type: 'widget',
        content: 'Z-Test (Testing of Significance)',
        widgetConfig: {
          algorithmId: 'z-test',
          params: { sampleMean: 68.5, popMean: 67.0, popStd: 2.5, sampleSize: 100, alpha: 0.05 }
        }
      }
    ]
  }
];
