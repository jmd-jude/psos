// app/api/use-cases/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
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

    const useCase = await prisma.useCase.create({
      data: {
        name,
        description: description || null,
        buyerOutcome: buyerOutcome || null,
        dataInputs: dataInputs || null,
        dataOutputs: dataOutputs || null,
        limitations: limitations || null,
        competitiveNotes: competitiveNotes || null,
        status: status || 'Active',
        owner: owner || null,
        // Create category relationships
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            categoryId,
          })),
        },
        // Create vertical relationships (if provided)
        verticals: verticalIds ? {
          create: verticalIds.map((verticalId: string) => ({
            verticalId,
            fit: 'Primary', // Default fit level
          })),
        } : undefined,
        // Create delivery mechanism relationships (if provided)
        deliveryMechanisms: deliveryMechanismIds ? {
          create: deliveryMechanismIds.map((mechanismId: string) => ({
            deliveryMechanismId: mechanismId,
          })),
        } : undefined,
      },
    });

    return NextResponse.json(useCase, { status: 201 });
  } catch (error) {
    console.error('Error creating use case:', error);
    return NextResponse.json(
      { error: 'Failed to create use case' },
      { status: 500 }
    );
  }
}
