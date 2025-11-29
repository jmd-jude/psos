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
      // Feature Definition Fields
      problemContext,
      targetAudience,
      valueBenefit,
      successMeasures,
      // Existing fields
      categoryIds,
      verticalIds,
      deliveryMechanismIds,
      description,
      buyerOutcome,
      dataInputs,
      dataOutputs,
      limitations,
      competitiveNotes,
      status,
      owner,
    } = body;

    if (!name || !categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one category are required' },
        { status: 400 }
      );
    }

    const useCase = await prisma.useCase.update({
      where: { id },
      data: {
        name,
        // Feature Definition Fields
        problemContext: problemContext || null,
        targetAudience: targetAudience || null,
        valueBenefit: valueBenefit || null,
        successMeasures: successMeasures || null,
        // Existing fields
        description: description || null,
        buyerOutcome: buyerOutcome || null,
        dataInputs: dataInputs || null,
        dataOutputs: dataOutputs || null,
        limitations: limitations || null,
        competitiveNotes: competitiveNotes || null,
        status: status || 'Active',
        owner: owner || null,
        // Replace category relationships
        categories: {
          deleteMany: {},  // Delete all existing
          create: categoryIds.map((categoryId: string) => ({
            categoryId,
          })),
        },
        // Replace vertical relationships
        verticals: {
          deleteMany: {},
          create: verticalIds?.map((verticalId: string) => ({
            verticalId,
            fit: 'Primary',
          })) || [],
        },
        // Replace delivery mechanism relationships
        deliveryMechanisms: {
          deleteMany: {},
          create: deliveryMechanismIds?.map((mechanismId: string) => ({
            deliveryMechanismId: mechanismId,
          })) || [],
        },
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
