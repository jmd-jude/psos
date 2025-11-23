// app/api/use-cases/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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

    const useCase = await prisma.useCase.create({
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

    return NextResponse.json(useCase, { status: 201 });
  } catch (error) {
    console.error('Error creating use case:', error);
    return NextResponse.json(
      { error: 'Failed to create use case' },
      { status: 500 }
    );
  }
}
