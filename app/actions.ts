// app/actions.ts

'use server';

import prisma from '@/lib/prisma';
import type * as Prisma from '@prisma/client';
// Ensure the correct types are imported from your new types file
import { PrioritizationPlotPoint, MaturitySummary, OpportunitySummary } from '@/lib/types';
import { classifyQuadrant, calculateOpportunityScore } from '@/lib/calculations'; 

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
// --- CATEGORIES ---
// ----------------------------------------------------------------------

/**
 * Fetches all Categories from the database.
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Database error fetching categories:", error);
    return [];
  }
}

/**
 * Fetches a single Category by ID with use case count and aggregate scores
 */
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        useCases: {
          include: {
            useCase: {
              include: {
                verticals: {
                  include: {
                    vertical: true,
                  },
                },
                capabilityAssessments: {
                  include: {
                    capability: true,
                  },
                },
                maturityAssessments: {
                  include: {
                    pillar: true,
                  },
                },
                opportunityScores: true,
              },
            },
          },
        },
      },
    });

    if (!category) return null;

    // Calculate scores for each use case
    const useCasesWithScores = category.useCases.map((ucCat) => {
      const useCase = ucCat.useCase;

      // Calculate maturity score (same logic as other places)
      let maturityScore = 0;
      if (useCase.capabilityAssessments && useCase.capabilityAssessments.length > 0) {
        const scores = useCase.capabilityAssessments.map(assessment =>
          assessment.useCompanyScore ? assessment.capability.score : (assessment.overrideScore ?? 0)
        );
        maturityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      } else if (useCase.maturityAssessments && useCase.maturityAssessments.length > 0) {
        const scores = useCase.maturityAssessments.map(a => a.score);
        maturityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }

      // Calculate opportunity score
      const latestOpportunity = useCase.opportunityScores[0];
      const opportunityScore = latestOpportunity ? calculateOpportunityScore(latestOpportunity) : 0;

      // Classify quadrant
      const quadrant = classifyQuadrant(maturityScore, opportunityScore);

      return {
        id: useCase.id,
        name: useCase.name,
        status: useCase.status,
        maturityScore,
        opportunityScore,
        quadrant,
        verticals: useCase.verticals,
      };
    });

    return {
      ...category,
      useCasesWithScores,
    };
  } catch (error) {
    console.error("Database error fetching category:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// --- DELIVERY MECHANISMS ---
// ----------------------------------------------------------------------

/**
 * Fetches all Delivery Mechanisms from the database.
 */
export async function getDeliveryMechanisms() {
  try {
    const mechanisms = await prisma.deliveryMechanism.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });
    return mechanisms;
  } catch (error) {
    console.error("Database error fetching delivery mechanisms:", error);
    return [];
  }
}

/**
 * Fetches a single Delivery Mechanism by ID with use case count
 */
export async function getDeliveryMechanismById(id: string) {
  try {
    const mechanism = await prisma.deliveryMechanism.findUnique({
      where: { id },
      include: {
        useCases: {
          include: {
            useCase: {
              include: {
                verticals: {
                  include: {
                    vertical: true,
                  },
                },
                capabilityAssessments: {
                  include: {
                    capability: true,
                  },
                },
                maturityAssessments: {
                  include: {
                    pillar: true,
                  },
                },
                opportunityScores: true,
              },
            },
          },
        },
      },
    });

    if (!mechanism) return null;

    // Calculate scores for each use case (same logic as categories)
    const useCasesWithScores = mechanism.useCases.map((ucMech) => {
      const useCase = ucMech.useCase;

      let maturityScore = 0;
      if (useCase.capabilityAssessments && useCase.capabilityAssessments.length > 0) {
        const scores = useCase.capabilityAssessments.map(assessment =>
          assessment.useCompanyScore ? assessment.capability.score : (assessment.overrideScore ?? 0)
        );
        maturityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      } else if (useCase.maturityAssessments && useCase.maturityAssessments.length > 0) {
        const scores = useCase.maturityAssessments.map(a => a.score);
        maturityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }

      const latestOpportunity = useCase.opportunityScores[0];
      const opportunityScore = latestOpportunity ? calculateOpportunityScore(latestOpportunity) : 0;
      const quadrant = classifyQuadrant(maturityScore, opportunityScore);

      return {
        id: useCase.id,
        name: useCase.name,
        status: useCase.status,
        maturityScore,
        opportunityScore,
        quadrant,
        verticals: useCase.verticals,
      };
    });

    return {
      ...mechanism,
      useCasesWithScores,
    };
  } catch (error) {
    console.error("Database error fetching delivery mechanism:", error);
    return null;
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
              verticals: {
                include: {
                  vertical: {
                    select: {
                      name: true,
                      strategicPriority: true,
                    },
                  },
                },
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
    const oppAvg = opp ? calculateOpportunityScore(opp).overall : 0;

    return {
      id: uc.id,
      name: uc.name,
      categories: uc.categories,
      fit: ucv.fit,
      maturityScore: maturityAvg,
      opportunityScore: oppAvg,
      quadrant: classifyQuadrant(maturityAvg, oppAvg),
      verticals: uc.verticals,
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
// --- COMPANY CAPABILITIES (NEW) ---
// ----------------------------------------------------------------------

/**
 * Fetches all company capabilities
 */
export async function getCompanyCapabilities() {
  return await prisma.companyCapability.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

/**
 * Updates a company capability score and rationale
 */
export async function updateCompanyCapability(
  id: string,
  data: { score: number; rationale?: string }
) {
  return await prisma.companyCapability.update({
    where: { id },
    data: {
      score: data.score,
      rationale: data.rationale || null,
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
      capabilityAssessments: {
        include: {
          capability: {
            select: {
              score: true,
            },
          },
        },
      },
      opportunityScores: {
        take: 1,
        orderBy: {
          scoreDate: 'desc',
        },
      },
      verticals: {
        include: {
          vertical: {
            select: {
              name: true,
              strategicPriority: true,
            },
          },
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return useCases.map(uc => {
    // Calculate maturity from capability assessments (NEW system)
    let maturityAvg = 0;
    if (uc.capabilityAssessments.length > 0) {
      const capabilityScores = uc.capabilityAssessments.map(a =>
        a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0)
      );
      maturityAvg = calculateAverageScore(capabilityScores);
    } else {
      // Fallback to old maturity assessments
      const maturityScores = uc.maturityAssessments.map(a => a.score);
      maturityAvg = calculateAverageScore(maturityScores);
    }

    const opp = uc.opportunityScores[0];
    const oppAvg = opp ? calculateOpportunityScore(opp).overall : 0;

    return {
      id: uc.id,
      name: uc.name,
      categories: uc.categories,
      status: uc.status,
      lastReviewed: uc.lastReviewed?.toISOString() ?? null,
      maturityScore: maturityAvg,
      opportunityScore: oppAvg,
      quadrant: classifyQuadrant(maturityAvg, oppAvg),
      verticals: uc.verticals,
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
      capabilityAssessments: {
        include: {
          capability: true,
        },
        orderBy: {
          capability: {
            sortOrder: 'asc',
          },
        },
      },
      opportunityScores: {
        orderBy: {
          scoreDate: 'desc',
        },
        take: 1,
      },
      categories: {
        include: {
          category: true,
        },
      },
      verticals: {
        include: {
          vertical: true,
        },
      },
      deliveryMechanisms: {
        include: {
          deliveryMechanism: true,
        },
      },
    },
  });

  if (!useCase) return null;

  // Calculate maturity from capability assessments (NEW system)
  let maturityAvg = 0;
  if (useCase.capabilityAssessments.length > 0) {
    const capabilityScores = useCase.capabilityAssessments.map(a =>
      a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0)
    );
    maturityAvg = calculateAverageScore(capabilityScores);
  } else {
    // Fallback to old maturity assessments if no capability assessments exist
    const maturityScores = useCase.maturityAssessments.map(a => a.score);
    maturityAvg = calculateAverageScore(maturityScores);
  }

  const opp = useCase.opportunityScores[0];
  const oppAvg = opp ? calculateOpportunityScore(opp).overall : 0;

  return {
    ...useCase,
    maturityAverage: maturityAvg,
    opportunityAverage: oppAvg,
    quadrant: classifyQuadrant(maturityAvg, oppAvg),
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
      capabilityAssessments: {
        include: {
          capability: true,
        },
      },
      opportunityScores: true, // Plural - matches the schema
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return useCasesWithScores
    .map((uc) => {
      // --- 1. Maturity (Y-Axis) Calculation (Capability) ---
      let maturityAvg = 0;
      let maturitySummary: MaturitySummary;

      // Use NEW capability assessment system if available
      if (uc.capabilityAssessments.length > 0) {
        const capabilityScores = uc.capabilityAssessments.map(a =>
          a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0)
        );
        maturityAvg = calculateAverageScore(capabilityScores);

        maturitySummary = {
          averageScore: maturityAvg,
          assessmentDetails: uc.capabilityAssessments.map(a => {
            const score = a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0);
            const rationale = a.useCompanyScore
              ? `Inherited from company (${a.capability.rationale || 'N/A'})`
              : (a.overrideRationale || 'N/A');
            return {
              pillarName: a.capability.name,
              score,
              rationale,
            };
          }),
        };
      } else {
        // Fallback to old maturity assessment system
        const maturityScores = uc.maturityAssessments.map(a => a.score);
        maturityAvg = calculateAverageScore(maturityScores);

        maturitySummary = {
          averageScore: maturityAvg,
          assessmentDetails: uc.maturityAssessments.map(a => ({
            pillarName: a.pillar.name,
            score: a.score,
            rationale: a.rationale || 'N/A',
          })),
        };
      }

      // --- 2. Opportunity (X-Axis) Calculation (Business Value) ---
      // Get the most recent opportunity score (first in array)
      const opp = uc.opportunityScores[0];
      let opportunitySummary: OpportunitySummary = {
        averageScore: 0,
        businessScore: 0,
        productScore: 0,
        rawScores: {
          arrScore: 0,
          pipelineScore: 0,
          velocityScore: 0,
          winRateScore: 0,
          strategicFitScore: 0,
          matchRateScore: 0,
          latencyScore: 0,
          privacyRiskScore: 0,
          dataSourceScore: 0,
          scaleScore: 0,
        },
      };

      if (opp) {
        const oppScoresResult = calculateOpportunityScore(opp);

        opportunitySummary = {
          averageScore: oppScoresResult.overall,
          businessScore: oppScoresResult.businessMetrics,
          productScore: oppScoresResult.productMetrics,
          rawScores: {
            arrScore: opp.arrScore ?? 0,
            pipelineScore: opp.pipelineScore ?? 0,
            velocityScore: opp.velocityScore ?? 0,
            winRateScore: opp.winRateScore ?? 0,
            strategicFitScore: opp.strategicFitScore ?? 0,
            matchRateScore: opp.matchRateScore ?? 0,
            latencyScore: opp.latencyScore ?? 0,
            privacyRiskScore: opp.privacyRiskScore ?? 0,
            dataSourceScore: opp.dataSourceScore ?? 0,
            scaleScore: opp.scaleScore ?? 0,
          },
        };
      }

      // --- 3. Final Plotting Point ---
      const quadrant = classifyQuadrant(maturityAvg, opportunitySummary.averageScore);

      // Return the final, plotted data point object
      return {
        id: uc.id,
        name: uc.name,
        categories: uc.categories,
        status: uc.status,
        maturityScore: maturitySummary,
        opportunityScore: opportunitySummary,
        quadrant: quadrant,
      } as PrioritizationPlotPoint;
    })
    // Filter out use cases that don't have enough data to be plotted
    .filter(p => p.maturityScore.averageScore > 0 && p.opportunityScore.averageScore > 0);
}