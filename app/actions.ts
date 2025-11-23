// app/actions.ts

'use server';

import prisma from '@/lib/prisma';
import type * as Prisma from '@prisma/client';
// Ensure the correct types are imported from your new types file
import { PrioritizationPlotPoint, MaturitySummary, OpportunitySummary } from '@/lib/types'; 

/**
 * Fetches all Vertical Market Segments from the database.
 * @returns An array of Vertical objects with id and name.
 */
export async function getVerticals(): Promise<Pick<Prisma.Vertical, 'id' | 'name'>[]> {
  try {
    const verticals = await prisma.vertical.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });
    return verticals;
  } catch (error) {
    console.error("Database error fetching verticals:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// --- GLOSSARY ---
// ----------------------------------------------------------------------

/**
 * Fetches all glossary terms grouped by category
 */
export async function getGlossaryTerms() {
  return await prisma.glossary.findMany({
    select: {
      id: true,
      term: true,
      abbreviation: true,
      definition: true,
      context: true,
      category: true,
    },
    orderBy: [
      { category: 'asc' },
      { term: 'asc' },
    ],
  });
}

// ----------------------------------------------------------------------
// --- VERTICALS ---
// ----------------------------------------------------------------------

/**
 * Fetches a single vertical with full details
 */
export async function getVerticalById(id: string) {
  const vertical = await prisma.vertical.findUnique({
    where: { id },
    include: {
      useCases: {
        include: {
          useCase: {
            include: {
              maturityAssessments: {
                select: { score: true },
              },
              opportunityScores: {
                take: 1,
                orderBy: { scoreDate: 'desc' },
              },
            },
          },
        },
      },
    },
  });

  if (!vertical) return null;

  // Calculate scores for each use case
  const useCasesWithScores = vertical.useCases.map((ucv) => {
    const uc = ucv.useCase;
    const maturityScores = uc.maturityAssessments.map((a) => a.score);
    const maturityAvg = calculateAverageScore(maturityScores);

    const opp = uc.opportunityScores[0];
    const oppScores = opp
      ? [opp.arrScore, opp.pipelineScore, opp.velocityScore, opp.winRateScore, opp.strategicFitScore].filter(
          (s): s is number => s !== null
        )
      : [];
    const oppAvg = calculateAverageScore(oppScores);

    return {
      id: uc.id,
      name: uc.name,
      category: uc.category,
      fit: ucv.fit,
      maturityScore: maturityAvg,
      opportunityScore: oppAvg,
      quadrant: assignQuadrant(maturityAvg, oppAvg),
    };
  });

  return {
    ...vertical,
    useCasesWithScores,
  };
}

// ----------------------------------------------------------------------
// --- CAPABILITY PILLARS ---
// ----------------------------------------------------------------------

/**
 * Fetches all capability pillars
 */
export async function getCapabilityPillars() {
  return await prisma.capabilityPillar.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

// ----------------------------------------------------------------------
// --- USE CASE FETCHERS ---
// ----------------------------------------------------------------------

/**
 * Fetches all use cases with their scores for the list view
 */
export async function getUseCasesForList() {
  const useCases = await prisma.useCase.findMany({
    include: {
      maturityAssessments: {
        select: {
          score: true,
        },
      },
      opportunityScores: {
        take: 1,
        orderBy: {
          scoreDate: 'desc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return useCases.map(uc => {
    const maturityScores = uc.maturityAssessments.map(a => a.score);
    const maturityAvg = calculateAverageScore(maturityScores);

    const opp = uc.opportunityScores[0];
    const oppScores = opp ? [opp.arrScore, opp.pipelineScore, opp.velocityScore, opp.winRateScore, opp.strategicFitScore].filter((s): s is number => s !== null) : [];
    const oppAvg = calculateAverageScore(oppScores);

    return {
      id: uc.id,
      name: uc.name,
      category: uc.category,
      status: uc.status,
      lastReviewed: uc.lastReviewed?.toISOString() ?? null,
      maturityScore: maturityAvg,
      opportunityScore: oppAvg,
      quadrant: assignQuadrant(maturityAvg, oppAvg),
    };
  });
}

/**
 * Fetches a single use case with full details
 */
export async function getUseCaseById(id: string) {
  const useCase = await prisma.useCase.findUnique({
    where: { id },
    include: {
      maturityAssessments: {
        include: {
          pillar: true,
        },
        orderBy: {
          assessedDate: 'desc',
        },
      },
      opportunityScores: {
        orderBy: {
          scoreDate: 'desc',
        },
        take: 1,
      },
      verticals: {
        include: {
          vertical: true,
        },
      },
    },
  });

  if (!useCase) return null;

  const maturityScores = useCase.maturityAssessments.map(a => a.score);
  const maturityAvg = calculateAverageScore(maturityScores);

  const opp = useCase.opportunityScores[0];
  const oppScores = opp ? [opp.arrScore, opp.pipelineScore, opp.velocityScore, opp.winRateScore, opp.strategicFitScore].filter((s): s is number => s !== null) : [];
  const oppAvg = calculateAverageScore(oppScores);

  return {
    ...useCase,
    maturityAverage: maturityAvg,
    opportunityAverage: oppAvg,
    quadrant: assignQuadrant(maturityAvg, oppAvg),
  };
}

// ----------------------------------------------------------------------
// --- PRIORITIZATION MATRIX DATA FETCHERS & CALCULATORS ---
// ----------------------------------------------------------------------

// Helper function to calculate the average of 1-5 scores
function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Helper function to assign a quadrant based on scores (simple logic for now)
function assignQuadrant(maturityAvg: number, opportunityAvg: number): PrioritizationPlotPoint['quadrant'] {
  const mid = 3.0; // The midpoint of the 1-5 score scale
  
  // INVEST: High Maturity, High Opportunity
  if (maturityAvg >= mid && opportunityAvg >= mid) {
    return 'INVEST'; 
  }
  // HARVEST: High Maturity, Low Opportunity
  if (maturityAvg >= mid && opportunityAvg < mid) {
    return 'HARVEST'; 
  }
  // MAINTAIN: Low Maturity, High Opportunity
  if (maturityAvg < mid && opportunityAvg >= mid) {
    return 'MAINTAIN'; 
  }
  // DEPRIORITIZE: Low Maturity, Low Opportunity
  return 'DEPRIORITIZE'; 
}


/**
 * Fetches all Use-Cases with their related Maturity and Opportunity scores,
 * processes them, and returns a list ready for plotting on the matrix.
 * @returns An array of PrioritizationPlotPoint objects.
 */
export async function getPrioritizationMatrixData(): Promise<PrioritizationPlotPoint[]> {
  // Use a complex query to fetch UseCase and ALL related scores/pillars
  const useCasesWithScores = await prisma.useCase.findMany({
    include: {
      maturityAssessments: {
        include: {
          pillar: {
            select: { name: true }, // Need the Pillar name for the rationale
          },
        },
      },
      opportunityScores: true, // Plural - matches the schema
    },
  });

  return useCasesWithScores
    .map((uc) => {
      // --- 1. Maturity (Y-Axis) Calculation (Capability) ---
      const maturityScores = uc.maturityAssessments.map(a => a.score);
      const maturityAvg = calculateAverageScore(maturityScores);

      const maturitySummary: MaturitySummary = {
        averageScore: maturityAvg,
        assessmentDetails: uc.maturityAssessments.map(a => ({
          pillarName: a.pillar.name,
          score: a.score,
          rationale: a.rationale || 'N/A',
        })),
      };

      // --- 2. Opportunity (X-Axis) Calculation (Business Value) ---
      // Get the most recent opportunity score (first in array)
      const opp = uc.opportunityScores[0];
      let opportunitySummary: OpportunitySummary = {
        averageScore: 0,
        rawScores: { arrScore: 0, pipelineScore: 0, velocityScore: 0, winRateScore: 0, strategicFitScore: 0 },
      };

      if (opp) {
        // Average all 5 opportunity scores (ARR, Pipeline, etc.)
        const oppScores = [opp.arrScore, opp.pipelineScore, opp.velocityScore, opp.winRateScore, opp.strategicFitScore].filter((s): s is number => s !== null);
        const oppAvg = calculateAverageScore(oppScores);

        opportunitySummary = {
          averageScore: oppAvg,
          rawScores: {
            arrScore: opp.arrScore ?? 0,
            pipelineScore: opp.pipelineScore ?? 0,
            velocityScore: opp.velocityScore ?? 0,
            winRateScore: opp.winRateScore ?? 0,
            strategicFitScore: opp.strategicFitScore ?? 0,
          },
        };
      }

      // --- 3. Final Plotting Point ---
      const quadrant = assignQuadrant(maturityAvg, opportunitySummary.averageScore);

      // Return the final, plotted data point object
      return {
        id: uc.id,
        name: uc.name,
        category: uc.category,
        status: uc.status,
        maturityScore: maturitySummary,
        opportunityScore: opportunitySummary,
        quadrant: quadrant,
      } as PrioritizationPlotPoint;
    })
    // Filter out use cases that don't have enough data to be plotted
    .filter(p => p.maturityScore.averageScore > 0 && p.opportunityScore.averageScore > 0);
}