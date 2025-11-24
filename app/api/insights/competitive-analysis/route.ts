import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInsight } from '@/lib/anthropic';
import { getCompetitiveAnalysisContext } from '@/lib/fieldGuideContext';
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
    let maturityDetails: Array<{ pillarName: string; score: number; rationale: string }> = [];

    if (useCase.capabilityAssessments.length > 0) {
      // Use new capability assessments
      maturityDetails = useCase.capabilityAssessments.map(a => {
        const score = a.useCompanyScore ? a.capability.score : (a.overrideScore ?? 0);
        const rationale = a.useCompanyScore
          ? a.capability.rationale || 'Company standard capability'
          : a.overrideRationale || 'Override rationale not provided';
        return {
          pillarName: a.capability.name,
          score,
          rationale,
        };
      });
      const scores = maturityDetails.map(d => d.score);
      maturityAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    } else if (useCase.maturityAssessments.length > 0) {
      // Fallback to old maturity assessments
      maturityDetails = useCase.maturityAssessments.map(a => ({
        pillarName: a.pillar.name,
        score: a.score,
        rationale: a.rationale || 'No rationale provided',
      }));
      const scores = maturityDetails.map(d => d.score);
      maturityAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Calculate opportunity score
    const opportunityScore = useCase.opportunityScores[0];
    let oppAvg = 0;
    let oppScoreDetails = {
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

    if (opportunityScore) {
      const calculated = calculateOpportunityScore(opportunityScore);
      oppAvg = calculated.overall;
      oppScoreDetails = {
        businessScore: calculated.businessMetrics,
        productScore: calculated.productMetrics,
        rawScores: {
          arrScore: opportunityScore.arrScore ?? 0,
          pipelineScore: opportunityScore.pipelineScore ?? 0,
          velocityScore: opportunityScore.velocityScore ?? 0,
          winRateScore: opportunityScore.winRateScore ?? 0,
          strategicFitScore: opportunityScore.strategicFitScore ?? 0,
          matchRateScore: opportunityScore.matchRateScore ?? 0,
          latencyScore: opportunityScore.latencyScore ?? 0,
          privacyRiskScore: opportunityScore.privacyRiskScore ?? 0,
          dataSourceScore: opportunityScore.dataSourceScore ?? 0,
          scaleScore: opportunityScore.scaleScore ?? 0,
        },
      };
    }

    const quadrant = classifyQuadrant(maturityAvg, oppAvg);

    // Load knowledge base context
    const knowledgeBaseContext = getCompetitiveAnalysisContext();

    // Construct prompts
    const systemPrompt = `You are a competitive intelligence analyst for an Identity Graph company.
Your analysis should be specific, data-driven, and actionable for sales and product teams.

Use the provided knowledge base context to ground your recommendations in real competitive dynamics.
Be honest about vulnerabilities—don't sugarcoat.`;

    const userPrompt = `
# COMPETITIVE ANALYSIS REQUEST

## Use Case Details
**Name:** ${useCase.name}
**Category:** ${useCase.category}
**Description:** ${useCase.description || 'No description provided'}

## Current Scores
**Maturity Score:** ${maturityAvg.toFixed(1)}/5.0
**Opportunity Score:** ${oppAvg.toFixed(1)}/5.0
**Quadrant:** ${quadrant}

### Maturity Breakdown
${maturityDetails.map(d =>
  `- ${d.pillarName}: ${d.score}/5 - ${d.rationale}`
).join('\n')}

### Opportunity Breakdown
**Business Metrics:**
- ARR Impact: ${oppScoreDetails.rawScores.arrScore}/5
- Pipeline Impact: ${oppScoreDetails.rawScores.pipelineScore}/5
- Velocity: ${oppScoreDetails.rawScores.velocityScore}/5
- Win Rate: ${oppScoreDetails.rawScores.winRateScore}/5
- Strategic Fit: ${oppScoreDetails.rawScores.strategicFitScore}/5

**Product Metrics:**
- Match Rate Impact: ${oppScoreDetails.rawScores.matchRateScore}/5
- Latency Requirement: ${oppScoreDetails.rawScores.latencyScore}/5
- Privacy/Compliance: ${oppScoreDetails.rawScores.privacyRiskScore}/5
- Data Source Complexity: ${oppScoreDetails.rawScores.dataSourceScore}/5
- Scale Requirement: ${oppScoreDetails.rawScores.scaleScore}/5

---

# KNOWLEDGE BASE CONTEXT

${knowledgeBaseContext}

---

# ANALYSIS TASK

Generate a competitive positioning analysis with these sections:

## 1. Competitive Landscape Summary
Which competitors (LiveRamp, Neustar, Merkle, Segment, Habu/InfoSum) can deliver this use case?
Rate each competitor's capability: Strong / Moderate / Weak / Cannot Deliver

## 2. Our Competitive Advantages
Where do we win? Be specific:
- Match rate superiority (if applicable)
- Latency/performance (if applicable)
- Privacy/compliance posture (if applicable)
- Pricing/packaging flexibility (if applicable)
- Scale and data coverage

## 3. Our Vulnerabilities
Where are we at risk? Be honest:
- Capability gaps (low maturity scores)
- Competitive disadvantages
- Market positioning challenges

## 4. Recommended Talk Track
For each major competitor, provide:
- Lead with: [Our strongest differentiator vs. this competitor]
- Landmine to avoid: [Topic/claim that favors competitor]
- Objection handling: [How to respond to their positioning]

## 5. Win Conditions
What needs to be true for us to win this deal?
- Buyer priorities (what customer must care about)
- Capability requirements (what maturity we need)
- Deal structure (pricing, contract terms, support level)

---

**Format as clean, scannable markdown. Use bullet points and bold for key terms. Be concise but specific.**
`;

    // Call Anthropic API
    const analysis = await generateInsight(systemPrompt, userPrompt);

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      useCaseId,
    });

  } catch (error) {
    console.error('Competitive analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
