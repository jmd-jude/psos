// app/api/opportunity/[useCaseId]/route.ts
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

    // Fetch the most recent opportunity score for this use case
    const opportunityScore = await prisma.opportunityScore.findFirst({
      where: { useCaseId },
      orderBy: { scoreDate: 'desc' },
    });

    if (!opportunityScore) {
      return NextResponse.json(
        { error: 'No opportunity score found for this use case' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunityScore);
  } catch (error) {
    console.error('Error fetching opportunity score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity score' },
      { status: 500 }
    );
  }
}
