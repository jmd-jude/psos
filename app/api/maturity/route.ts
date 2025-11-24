// app/api/maturity/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/maturity
 * Saves use case capability assessments with inherit/override pattern
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { useCaseId, assessments } = body;

    // Validate request
    if (!useCaseId || !assessments || !Array.isArray(assessments)) {
      return NextResponse.json(
        { error: 'Invalid request body. Required: useCaseId, assessments[]' },
        { status: 400 }
      );
    }

    // Validate each assessment
    for (const assessment of assessments) {
      if (!assessment.capabilityId) {
        return NextResponse.json(
          { error: 'Each assessment must have a capabilityId' },
          { status: 400 }
        );
      }

      // If overriding, must provide score and rationale
      if (!assessment.useCompanyScore) {
        if (!assessment.overrideScore || assessment.overrideScore < 1 || assessment.overrideScore > 5) {
          return NextResponse.json(
            { error: 'Override score must be between 1 and 5' },
            { status: 400 }
          );
        }
        if (!assessment.overrideRationale || assessment.overrideRationale.trim() === '') {
          return NextResponse.json(
            { error: 'Override rationale is required when not using company score' },
            { status: 400 }
          );
        }
      }
    }

    // Delete existing capability assessments for this use case
    await prisma.useCaseCapabilityAssessment.deleteMany({
      where: { useCaseId },
    });

    // Create new assessments
    await prisma.useCaseCapabilityAssessment.createMany({
      data: assessments.map((a: any) => ({
        useCaseId,
        capabilityId: a.capabilityId,
        useCompanyScore: a.useCompanyScore ?? true,
        overrideScore: a.useCompanyScore ? null : a.overrideScore,
        overrideRationale: a.useCompanyScore ? null : a.overrideRationale,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving maturity assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}
