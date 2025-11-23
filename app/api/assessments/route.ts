// app/api/assessments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assessments } = body;

    if (!assessments || !Array.isArray(assessments)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Delete existing assessments for this use case
    if (assessments.length > 0) {
      const useCaseId = assessments[0].useCaseId;
      await prisma.maturityAssessment.deleteMany({
        where: { useCaseId },
      });

      // Create new assessments
      await prisma.maturityAssessment.createMany({
        data: assessments.map((a: any) => ({
          useCaseId: a.useCaseId,
          pillarId: a.pillarId,
          score: a.score,
          rationale: a.rationale || null,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving assessments:', error);
    return NextResponse.json(
      { error: 'Failed to save assessments' },
      { status: 500 }
    );
  }
}
