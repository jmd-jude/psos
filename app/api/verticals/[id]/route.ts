// app/api/verticals/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      keyBuyerPersona,
      primaryPainPoint,
      complianceConsiderations,
      strategicPriority,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const vertical = await prisma.vertical.update({
      where: { id },
      data: {
        name,
        description: description || null,
        keyBuyerPersona: keyBuyerPersona || null,
        primaryPainPoint: primaryPainPoint || null,
        complianceConsiderations: complianceConsiderations || null,
        strategicPriority: strategicPriority || 'Medium',
      },
    });

    return NextResponse.json(vertical);
  } catch (error) {
    console.error('Error updating vertical:', error);
    return NextResponse.json(
      { error: 'Failed to update vertical' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.vertical.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vertical:', error);
    return NextResponse.json(
      { error: 'Failed to delete vertical' },
      { status: 500 }
    );
  }
}
