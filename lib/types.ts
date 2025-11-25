// lib/types.ts

import type * as Prisma from '@prisma/client';

// 1. Define the type for a Use-Case's Maturity Assessment scores
// This aggregates the scores across all Capability Pillars
export interface MaturitySummary {
  averageScore: number;
  // Optional: details to display on hover
  assessmentDetails: {
    pillarName: string;
    score: number;
    rationale: string;
  }[];
}

// 2. Define the type for a Use-Case's Opportunity Score
// This aggregates the scores from the OpportunityScore table
export interface OpportunitySummary {
  averageScore: number;
  businessScore: number;  // Business metrics subscore
  productScore: number;   // Product metrics subscore
  // Raw data that drives the average, used for bubble size or detail
  rawScores: Pick<
    Prisma.OpportunityScore,
    | 'arrScore' | 'pipelineScore' | 'velocityScore' | 'winRateScore' | 'strategicFitScore'
    | 'matchRateScore' | 'latencyScore' | 'privacyRiskScore' | 'dataSourceScore' | 'scaleScore'
  >;
}

// 3. Define the final, plotted data point
export interface PrioritizationPlotPoint {
  id: string;
  name: string;
  categories: Array<{
    id: string;
    category: {
      id: string;
      name: string;
    };
  }>;
  status: string;
  // The X-Axis value
  opportunityScore: OpportunitySummary;
  // The Y-Axis value
  maturityScore: MaturitySummary;
  // A calculated field to determine quadrant and size
  quadrant: 'INVEST' | 'HARVEST' | 'MAINTAIN' | 'DEPRIORITIZE';
}