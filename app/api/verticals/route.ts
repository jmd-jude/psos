// app/api/verticals/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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

    const vertical = await prisma.vertical.create({
      data: {
        name,
        description: description || null,
        keyBuyerPersona: keyBuyerPersona || null,
        primaryPainPoint: primaryPainPoint || null,
        complianceConsiderations: complianceConsiderations || null,
        strategicPriority: strategicPriority || 'Medium',
      },
    });

    return NextResponse.json(vertical, { status: 201 });
  } catch (error) {
    console.error('Error creating vertical:', error);
    return NextResponse.json(
      { error: 'Failed to create vertical' },
      { status: 500 }
    );
  }
}
