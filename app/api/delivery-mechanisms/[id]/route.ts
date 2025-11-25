// app/api/delivery-mechanisms/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const mechanism = await prisma.deliveryMechanism.update({
      where: { id },
      data: {
        name,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(mechanism);
  } catch (error) {
    console.error('Error updating delivery mechanism:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery mechanism' },
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

    await prisma.deliveryMechanism.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting delivery mechanism:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery mechanism' },
      { status: 500 }
    );
  }
}
