// app/api/use-cases/[id]/route.ts
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
      category,
      description,
      buyerOutcome,
      dataInputs,
      dataOutputs,
      deliveryMechanism,
      limitations,
      competitiveNotes,
      status,
      owner,
    } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const useCase = await prisma.useCase.update({
      where: { id },
      data: {
        name,
        category,
        description: description || null,
        buyerOutcome: buyerOutcome || null,
        dataInputs: dataInputs || null,
        dataOutputs: dataOutputs || null,
        deliveryMechanism: deliveryMechanism || null,
        limitations: limitations || null,
        competitiveNotes: competitiveNotes || null,
        status: status || 'Active',
        owner: owner || null,
      },
    });

    return NextResponse.json(useCase);
  } catch (error) {
    console.error('Error updating use case:', error);
    return NextResponse.json(
      { error: 'Failed to update use case' },
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

    await prisma.useCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting use case:', error);
    return NextResponse.json(
      { error: 'Failed to delete use case' },
      { status: 500 }
    );
  }
}
