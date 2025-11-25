/**
 * Statistical Analysis Library
 * Implements all statistical tests and calculations for the research analysis
 */

export interface AnalysisData {
  participantId: string;
  age?: number;
  gender?: string;
  
  // Pre-task scales
  diaPre: {
    unprotected: number;
    leftBehind: number;
    stayUpdated: number;
    needValidation: number;
    fearReplacement: number;
  };
  
  gse: {
    solveDifficult: number;
    dealUnexpected: number;
    handleUnforeseen: number;
    severalSolutions: number;
  };
  
  moodPre: {
    tense: number;
    fatigued: number;
    anxious: number;
    vigorous: number;
    confident: number;
  };
  
  aiUseFrequency?: number;
  
  // Task No-AI
  taskNoAI: {
    ideas: string[];
    ideaCount: number;
    tlx: {
      mental: number;
      physical: number;
      temporal: number;
      performance: number;
      effort: number;
      frustration: number;
    };
    experience: {
      confident: number;
      creative: number;
      satisfied: number;
    };
  };
  
  // Task AI
  taskAI: {
    ideas: string[];
    ideaCount: number;
    tlx: {
      mental: number;
      physical: number;
      temporal: number;
      performance: number;
      effort: number;
      frustration: number;
    };
    experience: {
      confident: number;
      creative: number;
      satisfied: number;
      helpful: number;
      feltDependent: number;
    };
    ideasFromAI: number;
  };
  
  // Post-task scales
  diaPost: {
    unprotected: number;
    leftBehind: number;
    stayUpdated: number;
    needValidation: number;
    fearReplacement: number;
  };
  
  moodPost: {
    tense: number;
    fatigued: number;
    anxious: number;
    vigorous: number;
    confident: number;
  };
}

/**
 * Calculate Cronbach's Alpha for reliability testing
 */
export function calculateCronbachAlpha(items: number[][]): number {
  const n = items.length; // number of items
  const k = items[0]?.length || 0; // number of participants
  
  if (n < 2 || k < 2) return 0;
  
  // Calculate variance for each item
  const itemVariances = items.map(item => calculateVariance(item));
  const sumItemVariances = itemVariances.reduce((a, b) => a + b, 0);
  
  // Calculate total score variance
  const totalScores = Array(k).fill(0).map((_, i) => 
    items.reduce((sum, item) => sum + item[i], 0)
  );
  const totalVariance = calculateVariance(totalScores);
  
  // Cronbach's Alpha formula
  const alpha = (n / (n - 1)) * (1 - (sumItemVariances / totalVariance));
  
  return alpha;
}

/**
 * Calculate variance of an array
 */
function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculate standard deviation
 */
export function calculateStdDev(values: number[]): number {
  return Math.sqrt(calculateVariance(values));
}

/**
 * Perform paired t-test
 */
export function pairedTTest(sample1: number[], sample2: number[]): {
  tStatistic: number;
  df: number;
  pValue: number;
  meanDiff: number;
  effect: string;
} {
  const n = sample1.length;
  const differences = sample1.map((v, i) => v - sample2[i]);
  
  const meanDiff = differences.reduce((a, b) => a + b, 0) / n;
  const stdDiff = calculateStdDev(differences);
  const se = stdDiff / Math.sqrt(n);
  
  const tStatistic = meanDiff / se;
  const df = n - 1;
  
  // Approximate p-value using t-distribution
  const pValue = approximateTTestPValue(Math.abs(tStatistic), df);
  
  let effect = 'none';
  if (pValue < 0.001) effect = 'p < .001';
  else if (pValue < 0.01) effect = 'p < .01';
  else if (pValue < 0.05) effect = 'p < .05';
  else effect = 'n.s.';
  
  return { tStatistic, df, pValue, meanDiff, effect };
}

/**
 * Approximate p-value for t-test (two-tailed)
 */
function approximateTTestPValue(t: number, df: number): number {
  // Simplified approximation - for production, use a proper statistical library
  const x = df / (df + t * t);
  let p = 0;
  
  if (t > 3) p = 0.001;
  else if (t > 2.576) p = 0.01;
  else if (t > 1.96) p = 0.05;
  else if (t > 1.645) p = 0.10;
  else p = 0.20;
  
  return p;
}

/**
 * Calculate Pearson correlation coefficient
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate correlation matrix
 */
export function correlationMatrix(
  variables: { name: string; values: number[] }[]
): { name: string; correlations: number[] }[] {
  return variables.map(varX => ({
    name: varX.name,
    correlations: variables.map(varY => 
      pearsonCorrelation(varX.values, varY.values)
    )
  }));
}

/**
 * Simple linear regression
 */
export function simpleLinearRegression(x: number[], y: number[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const r = pearsonCorrelation(x, y);
  const rSquared = r * r;
  
  return { slope, intercept, rSquared };
}

/**
 * Calculate descriptive statistics
 */
export function descriptiveStats(values: number[]): {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  n: number;
} {
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  
  return {
    mean: values.reduce((a, b) => a + b, 0) / n,
    median: n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)],
    std: calculateStdDev(values),
    min: Math.min(...values),
    max: Math.max(...values),
    n
  };
}

/**
 * Calculate effect size (Cohen's d) for paired samples
 */
export function cohensD(sample1: number[], sample2: number[]): number {
  const differences = sample1.map((v, i) => v - sample2[i]);
  const meanDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
  const stdDiff = calculateStdDev(differences);
  
  return meanDiff / stdDiff;
}
