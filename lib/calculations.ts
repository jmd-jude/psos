// lib/calculations.ts
// Core Calculation Logic (Scores, Quadrant)

export type Quadrant = 'HARVEST' | 'INVEST' | 'MAINTAIN' | 'DEPRIORITIZE';

/**
 * Maturity average (equal weight across pillars)
 * Scores are on 1-5 scale
 */
export function calculateMaturityAverage(scores: { score: number }[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s.score, 0);
  return sum / scores.length;
}

/**
 * Calculate composite opportunity score with business and product metric breakdown
 * Returns overall score plus component scores for analysis
 */
export function calculateOpportunityScore(opp: {
  // Business metrics
  arrScore?: number | null;
  pipelineScore?: number | null;
  velocityScore?: number | null;
  winRateScore?: number | null;
  strategicFitScore?: number | null;
  // Product metrics
  matchRateScore?: number | null;
  latencyScore?: number | null;
  privacyRiskScore?: number | null;
  dataSourceScore?: number | null;
  scaleScore?: number | null;
}): {
  overall: number;
  businessMetrics: number;
  productMetrics: number;
} {
  // Business Growth Metrics (60% of total)
  const businessWeights = {
    arr: 0.25,      // 25% of total
    pipeline: 0.20, // 20% of total
    velocity: 0.10, // 10% of total
    winRate: 0.05,  // 5% of total
  };

  const businessTotal =
    (opp.arrScore ?? 0) * businessWeights.arr +
    (opp.pipelineScore ?? 0) * businessWeights.pipeline +
    (opp.velocityScore ?? 0) * businessWeights.velocity +
    (opp.winRateScore ?? 0) * businessWeights.winRate;

  // Note: strategicFit is excluded from calculation as it's more qualitative
  // but stored for reference

  // Normalize to 5.0 scale (since weights sum to 0.60, not 1.0)
  const businessScore = (businessTotal / 0.60);

  // Product Performance Metrics (40% of total)
  const productWeights = {
    matchRate: 0.15,   // 15% of total - critical differentiator
    latency: 0.10,     // 10% of total - technical complexity
    privacyRisk: 0.10, // 10% of total - compliance burden
    dataSource: 0.03,  // 3% of total - operational complexity
    scale: 0.02,       // 2% of total - infrastructure cost
  };

  const productTotal =
    (opp.matchRateScore ?? 0) * productWeights.matchRate +
    (opp.latencyScore ?? 0) * productWeights.latency +
    (opp.privacyRiskScore ?? 0) * productWeights.privacyRisk +
    (opp.dataSourceScore ?? 0) * productWeights.dataSource +
    (opp.scaleScore ?? 0) * productWeights.scale;

  // Normalize to 5.0 scale (since weights sum to 0.40, not 1.0)
  const productScore = (productTotal / 0.40);

  // Overall score is weighted combination
  const overallScore = businessScore * 0.60 + productScore * 0.40;

  return {
    overall: overallScore,
    businessMetrics: businessScore,
    productMetrics: productScore,
  };
}

/**
 * Quadrant classification (BCG Growth-Share Matrix)
 * Maturity threshold: 3.0 (on normalized 1-5 scale)
 * Opportunity threshold: 3.0 (on 1-5 scale)
 */
export function classifyQuadrant(maturity: number, opportunity: number): Quadrant {
  const maturityThreshold = 3.0;
  const opportunityThreshold = 3.0;

  // INVEST: High Opportunity + Low Maturity → needs investment to capture opportunity
  if (opportunity >= opportunityThreshold && maturity < maturityThreshold) {
    return 'INVEST';
  }

  // HARVEST: High Opportunity + High Maturity → maximize returns
  if (opportunity >= opportunityThreshold && maturity >= maturityThreshold) {
    return 'HARVEST';
  }

  // MAINTAIN: Low Opportunity + High Maturity → efficient sustain
  if (opportunity < opportunityThreshold && maturity >= maturityThreshold) {
    return 'MAINTAIN';
  }

  // DEPRIORITIZE: Low Opportunity + Low Maturity → consider sunset
  return 'DEPRIORITIZE';
}

/**
 * Helper to format currency values
 */
export function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper to format percentage values
 */
export function formatPercent(value?: number | null): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Get ARR score based on thresholds
 */
export function getARRScore(arrRaw: number): number {
  if (arrRaw >= 1000000) return 5;
  if (arrRaw >= 500000) return 4;
  if (arrRaw >= 250000) return 3;
  if (arrRaw >= 100000) return 2;
  return 1;
}

/**
 * Get Pipeline score based on thresholds
 */
export function getPipelineScore(pipelineRaw: number): number {
  if (pipelineRaw >= 2000000) return 5;
  if (pipelineRaw >= 1000000) return 4;
  if (pipelineRaw >= 500000) return 3;
  if (pipelineRaw >= 200000) return 2;
  return 1;
}

/**
 * Get Velocity score based on thresholds (lower is better)
 */
export function getVelocityScore(velocityDays: number): number {
  if (velocityDays <= 30) return 5;
  if (velocityDays <= 60) return 4;
  if (velocityDays <= 90) return 3;
  if (velocityDays <= 180) return 2;
  return 1;
}

/**
 * Get Win Rate score based on thresholds
 */
export function getWinRateScore(winRate: number): number {
  if (winRate >= 0.6) return 5;
  if (winRate >= 0.4) return 4;
  if (winRate >= 0.25) return 3;
  if (winRate >= 0.15) return 2;
  return 1;
}

/**
 * Get Match Rate Impact score based on expected improvement
 * @param improvement - Expected match rate improvement as decimal (0.05 = 5%)
 */
export function getMatchRateScore(improvement: number): number {
  if (improvement >= 0.10) return 5; // 10%+ improvement = transformative
  if (improvement >= 0.07) return 4; // 7-10% = significant
  if (improvement >= 0.05) return 3; // 5-7% = meaningful
  if (improvement >= 0.03) return 2; // 3-5% = incremental
  return 1; // <3% = minimal
}

/**
 * Get Latency score based on requirement classification
 */
export function getLatencyScore(requirement: string): number {
  switch (requirement) {
    case 'real-time': return 5;      // <100ms - highest complexity
    case 'near-real-time': return 3; // <1s - moderate complexity
    case 'batch': return 1;          // hours - lowest complexity
    default: return 0;
  }
}

/**
 * Get Privacy Risk score (inverted - lower risk = higher score)
 */
export function getPrivacyRiskScore(riskLevel: string): number {
  switch (riskLevel) {
    case 'low': return 5;    // Low compliance burden
    case 'medium': return 3; // Moderate compliance burden
    case 'high': return 1;   // High compliance burden (PII exposure, sensitive categories)
    default: return 0;
  }
}

/**
 * Get Data Source Dependencies score (inverted - fewer dependencies = higher score)
 */
export function getDataSourceScore(dependencies: string): number {
  const sources = dependencies.split(',').map(s => s.trim()).filter(Boolean);
  const count = sources.length;

  if (count === 0) return 0;  // No data = no score
  if (count === 1) return 5;  // Single source = simple
  if (count === 2) return 4;  // Two sources = manageable
  if (count === 3) return 3;  // Three sources = moderate complexity
  if (count <= 5) return 2;   // 4-5 sources = complex
  return 1;                   // 6+ sources = very complex
}

/**
 * Get Scale Requirement score
 */
export function getScaleScore(requirement: string): number {
  switch (requirement) {
    case 'sample': return 5;      // Minimal infrastructure
    case 'subset': return 3;      // Moderate infrastructure
    case 'full-graph': return 1;  // Full infrastructure (1.6T events/month)
    default: return 0;
  }
}
