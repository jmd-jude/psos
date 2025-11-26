import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInsight } from '@/lib/anthropic';
import { getCapabilityGapContext, getFieldGuideSection } from '@/lib/fieldGuideContext';
import { calculateOpportunityScore, classifyQuadrant } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const { useCaseId } = await request.json();

    if (!useCaseId) {
      return NextResponse.json(
        { error: 'useCaseId is required' },
        { status: 400 }
      );
    }

    // Fetch use case with all scores
    const useCase = await prisma.useCase.findUnique({
      where: { id: useCaseId },
      include: {
        categories: {
          include: {
            category: true,
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
      },
    });

    if (!useCase) {
      return NextResponse.json(
        { error: 'Use case not found' },
        { status: 404 }
      );
    }

    // Calculate maturity score
    let maturityAvg = 0;
    let capabilityDetails: Array<{
      name: string;
      score: number;
      rationale: string;
      isInherited: boolean;
    }> = [];

    if (useCase.capabilityAssessments.length > 0) {
      // Use new capability assessments
      capabilityDetails = useCase.capabilityAssessments.map(a => {
        const score = a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0);
        const rationale = a.useCompanyScore
          ? a.capability.rationale || 'Company standard capability'
          : a.overrideRationale || 'Override rationale not provided';
        return {
          name: a.capability.name,
          score,
          rationale,
          isInherited: a.useCompanyScore,
        };
      });
      const scores = capabilityDetails.map(d => d.score);
      maturityAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Calculate opportunity score
    const opportunityScore = useCase.opportunityScores[0];
    let oppAvg = 0;

    if (opportunityScore) {
      const calculated = calculateOpportunityScore(opportunityScore);
      oppAvg = calculated.overall;
    }

    const quadrant = classifyQuadrant(maturityAvg, oppAvg);

    // Identify critical gaps (scores < 3.0)
    const criticalGaps = capabilityDetails
      .filter(c => c.score < 3.0)
      .map(c => c.name);

    // Load knowledge base context
    const knowledgeBaseContext = getCapabilityGapContext();

    // Construct prompts
    const systemPrompt = `You are a product strategy advisor for an Identity Graph company.
Your goal is to diagnose capability gaps and recommend specific, actionable improvements.

Use the maturity rubric from the knowledge base to be precise about what each score level means
and what's required to move from one level to the next.`;

    const categories = useCase.categories.map(c => c.category.name).join(', ') || 'No categories';

    const userPrompt = `
# CAPABILITY GAP ANALYSIS REQUEST

## Use Case Details
**Name:** ${useCase.name}
**Categories:** ${categories}
**Description:** ${useCase.description || 'No description provided'}
**Maturity Score:** ${maturityAvg.toFixed(1)}/5.0
**Opportunity Score:** ${oppAvg.toFixed(1)}/5.0
**Quadrant:** ${quadrant}

## Current Capability Scores
${capabilityDetails.map(c => {
  const inheritedNote = c.isInherited ? ' (Inherited from company)' : ' (Override)';
  return `### ${c.name}: ${c.score}/5.0${inheritedNote}
${c.rationale}`;
}).join('\n\n')}

---

# KNOWLEDGE BASE CONTEXT

${knowledgeBaseContext}

---

# ANALYSIS TASK

Diagnose what's preventing this use case from reaching production readiness (maturity ≥3.0) and recommend an actionable plan.

## 1. Critical Gaps (Top 2-3)
Which capability pillars are most urgently holding back maturity?
For each gap:
- Current state: [What score are we at and what does that mean per the rubric?]
- Required state: [What score do we need and what does that mean per the rubric?]
- Why it's critical: [Impact on win rate, customer satisfaction, or operational risk]

## 2. Improvement Roadmap
For each critical gap, provide specific next steps:
- **Quick Wins (0-3 months):** What can we do immediately?
- **Medium-term (3-6 months):** What requires sustained effort?
- **Long-term (6-12 months):** What's the ideal end state?

Be specific: "Implement CI/CD pipeline" not "improve infrastructure"

## 3. Timeline to Production Ready
Given current maturity (${maturityAvg.toFixed(1)}) and opportunity (${oppAvg.toFixed(1)}):
- Realistic timeline to reach maturity ≥3.0?
- Key milestones and dependencies?
- Assumptions (team size, budget, priorities)?

## 4. Risk Assessment
What happens if we don't address these gaps?
- **Win rate impact:** Will we lose competitive deals?
- **Customer churn:** Will existing customers leave?
- **Operational cost:** Will manual effort become unsustainable?
- **Opportunity cost:** What else could we build instead?

## 5. Resource Requirements
Rough estimate of what's needed:
- Engineering effort (person-months)
- Infrastructure investment ($)
- Data partnerships or acquisitions
- Legal/compliance work

---

**Format as clean, actionable markdown. Use the maturity rubric terminology to be specific.**
`;

    // Call Anthropic API
    const analysis = await generateInsight(systemPrompt, userPrompt);

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      useCaseId,
      criticalGaps,
    });

  } catch (error) {
    console.error('Capability gap analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
