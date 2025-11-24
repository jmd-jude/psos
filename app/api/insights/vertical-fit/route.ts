import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInsight } from '@/lib/anthropic';
import { getVerticalFitContext } from '@/lib/fieldGuideContext';
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
        verticals: {
          include: {
            vertical: true,
          },
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
    if (useCase.capabilityAssessments.length > 0) {
      const scores = useCase.capabilityAssessments.map(a =>
        a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0)
      );
      maturityAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    } else if (useCase.maturityAssessments.length > 0) {
      const scores = useCase.maturityAssessments.map(a => a.score);
      maturityAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Calculate opportunity score
    const opportunityScore = useCase.opportunityScores[0];
    let oppAvg = 0;
    let privacyRiskLevel = 'Not specified';
    let latencyRequirement = 'Not specified';
    let dataSourceDepends = 'Not specified';

    if (opportunityScore) {
      const calculated = calculateOpportunityScore(opportunityScore);
      oppAvg = calculated.overall;

      // Extract privacy risk level
      const privacyScore = opportunityScore.privacyRiskScore ?? 0;
      if (privacyScore >= 4) privacyRiskLevel = 'low';
      else if (privacyScore >= 2) privacyRiskLevel = 'medium';
      else if (privacyScore >= 1) privacyRiskLevel = 'high';

      // Extract latency requirement
      const latencyScore = opportunityScore.latencyScore ?? 0;
      if (latencyScore >= 4) latencyRequirement = 'real-time (<100ms)';
      else if (latencyScore >= 2) latencyRequirement = 'near-real-time (<1s)';
      else if (latencyScore >= 1) latencyRequirement = 'batch (hours)';

      // Note: dataSourceDepends would need to be stored in the opportunityScore
      // For now, we'll leave it as Not specified
    }

    const quadrant = classifyQuadrant(maturityAvg, oppAvg);

    // Load knowledge base context
    const knowledgeBaseContext = getVerticalFitContext();

    // Construct prompts
    const systemPrompt = `You are a go-to-market strategist for an Identity Graph company.
Your goal is to recommend which verticals (Retail, Financial Services, Healthcare, Telecom, etc.)
are best suited for a given use case based on vertical maturity, compliance fit, and buyer readiness.

Use the knowledge base to ground recommendations in real market dynamics.`;

    const userPrompt = `
# VERTICAL FIT ANALYSIS REQUEST

## Use Case Details
**Name:** ${useCase.name}
**Category:** ${useCase.category}
**Description:** ${useCase.description || 'No description provided'}

## Use Case Characteristics
**Maturity Score:** ${maturityAvg.toFixed(1)}/5.0
**Opportunity Score:** ${oppAvg.toFixed(1)}/5.0
**Quadrant:** ${quadrant}

**Privacy Risk Level:** ${privacyRiskLevel}
**Latency Requirement:** ${latencyRequirement}
**Data Sources Required:** ${dataSourceDepends}

**Buyer Outcome:** ${useCase.buyerOutcome || 'Not specified'}

## Current Vertical Assignments
${useCase.verticals.length > 0
  ? useCase.verticals.map(v => `- ${v.vertical.name} (${v.fit})`).join('\n')
  : 'No verticals currently assigned'}

---

# KNOWLEDGE BASE CONTEXT

${knowledgeBaseContext}

---

# ANALYSIS TASK

Recommend the top 3 verticals to target for this use case and rank them by priority.

For each vertical, analyze:

## Vertical Maturity Assessment (1-5 scale)
- **Score:** [1-5]
- **Reasoning:** Is this vertical ready for this use case? Reference the vertical maturity knowledge base.
  - 5 = Advanced (short sales cycle, proven ROI, competitive)
  - 3 = Emerging (education required, longer cycles)
  - 1 = Not Ready (nascent, no budget, no infrastructure)

## Compliance Fit
- Does our privacy risk level (${privacyRiskLevel}) work in this vertical?
- Are there regulatory barriers (HIPAA, GLBA, industry-specific)?
- **Verdict:** Green Light / Yellow (manageable) / Red (blocker)

## Buyer Persona Match
- Who typically buys this use case in this vertical?
  - Reference buyer persona knowledge base (CDO, CMO, VP Marketing, etc.)
- Does our buyer outcome align with their priorities?

## Expected Win Rate
- Based on vertical maturity, our capability maturity, and competition
- **Estimate:** High (>50%) / Medium (30-50%) / Low (<30%)
- **Reasoning:** Why this estimate?

## Strategic Rationale
2-3 sentences on why to prioritize or avoid this vertical.

---

## Output Format

Create a table:

| Rank | Vertical | Maturity | Compliance Fit | Buyer Persona | Win Rate | Priority |
|------|----------|----------|----------------|---------------|----------|----------|
| 1    | [Name]   | X/5      | Green/Yellow   | [Role]        | High     | **Tier 1** |
| 2    | [Name]   | X/5      | Green/Yellow   | [Role]        | Medium   | **Tier 2** |
| 3    | [Name]   | X/5      | Yellow         | [Role]        | Medium   | **Tier 2** |

Then provide narrative reasoning for each ranking.

**Be specific and reference the knowledge base. Use actual vertical names from the knowledge base (Retail, Financial Services, Healthcare, Telecom, B2B/Enterprise Tech, Non-Profit).**
`;

    // Call Anthropic API
    const analysis = await generateInsight(systemPrompt, userPrompt);

    // Parse recommended verticals from the analysis (simplified - just returns empty array)
    // In a real implementation, you might parse the markdown table to extract this data
    const recommendedVerticals: Array<{
      vertical: string;
      maturityScore: number;
      reasoning: string;
    }> = [];

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      useCaseId,
      recommendedVerticals,
    });

  } catch (error) {
    console.error('Vertical fit analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
