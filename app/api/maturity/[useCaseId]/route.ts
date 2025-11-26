// app/api/maturity/[useCaseId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ useCaseId: string }> }
) {
  try {
    const { useCaseId } = await params;

    if (!useCaseId) {
      return NextResponse.json(
        { error: 'Use case ID is required' },
        { status: 400 }
      );
    }

    // Fetch all capability assessments for this use case
    const assessments = await prisma.useCaseCapabilityAssessment.findMany({
      where: { useCaseId },
      include: {
        capability: true, // Include the capability details
      },
    });

    if (assessments.length === 0) {
      return NextResponse.json(
        { error: 'No assessments found for this use case' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching maturity assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maturity assessments' },
      { status: 500 }
    );
  }
}
