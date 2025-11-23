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
 * Opportunity weighted score
 * Individual scores range from 1-5
 */
export function calculateOpportunityScore(opp: {
  arrScore?: number | null;
  pipelineScore?: number | null;
  velocityScore?: number | null;
  winRateScore?: number | null;
  strategicFitScore?: number | null;
}): number {
  const weights = {
    arr: 0.30,
    pipeline: 0.30,
    velocity: 0.15,
    winRate: 0.15,
    strategic: 0.10
  };

  return (
    (opp.arrScore ?? 0) * weights.arr +
    (opp.pipelineScore ?? 0) * weights.pipeline +
    (opp.velocityScore ?? 0) * weights.velocity +
    (opp.winRateScore ?? 0) * weights.winRate +
    (opp.strategicFitScore ?? 0) * weights.strategic
  );
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
