// app/api/delivery-mechanisms/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const mechanism = await prisma.deliveryMechanism.create({
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(mechanism, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery mechanism:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery mechanism' },
      { status: 500 }
    );
  }
}
