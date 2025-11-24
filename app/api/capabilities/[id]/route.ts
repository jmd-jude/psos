// app/api/capabilities/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PUT /api/capabilities/:id
 * Updates a company capability's score and rationale
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score, rationale } = body;

    // Validate score
    if (!score || score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Update the capability
    const capability = await prisma.companyCapability.update({
      where: { id },
      data: {
        score,
        rationale: rationale || null,
      },
    });

    return NextResponse.json(capability);
  } catch (error) {
    console.error('Error updating company capability:', error);

    // Check if capability not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Capability not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update capability' },
      { status: 500 }
    );
  }
}
