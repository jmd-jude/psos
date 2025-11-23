// app/verticals/[id]/edit/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getVerticalById } from '@/app/actions';
import VerticalForm from '@/components/verticals/VerticalForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface EditVerticalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVerticalPage({ params }: EditVerticalPageProps) {
  const { id } = await params;
  const vertical = await getVerticalById(id);

  if (!vertical) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/verticals">Verticals</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/verticals/${id}`}>{vertical.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <VerticalForm
        mode="edit"
        initialData={{
          id: vertical.id,
          name: vertical.name,
          description: vertical.description || '',
          keyBuyerPersona: vertical.keyBuyerPersona || '',
          primaryPainPoint: vertical.primaryPainPoint || '',
          complianceConsiderations: vertical.complianceConsiderations || '',
          strategicPriority: vertical.strategicPriority,
        }}
      />
    </div>
  );
}
