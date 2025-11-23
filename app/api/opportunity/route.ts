// app/api/opportunity/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      useCaseId,
      arrRaw,
      arrScore,
      pipelineRaw,
      pipelineScore,
      velocityRaw,
      velocityScore,
      winRateRaw,
      winRateScore,
      strategicFitScore,
      sourceNotes,
    } = body;

    if (!useCaseId) {
      return NextResponse.json(
        { error: 'Use case ID is required' },
        { status: 400 }
      );
    }

    // Delete existing opportunity scores for this use case
    await prisma.opportunityScore.deleteMany({
      where: { useCaseId },
    });

    // Create new opportunity score
    await prisma.opportunityScore.create({
      data: {
        useCaseId,
        arrRaw,
        arrScore,
        pipelineRaw,
        pipelineScore,
        velocityRaw,
        velocityScore,
        winRateRaw,
        winRateScore,
        strategicFitScore,
        sourceNotes,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving opportunity score:', error);
    return NextResponse.json(
      { error: 'Failed to save opportunity score' },
      { status: 500 }
    );
  }
}
