// app/use-cases/[id]/edit/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getUseCaseById } from '@/app/actions';
import UseCaseForm from '@/components/use-cases/UseCaseForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface EditUseCasePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUseCasePage({ params }: EditUseCasePageProps) {
  const { id } = await params;
  const useCase = await getUseCaseById(id);

  if (!useCase) {
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
            <BreadcrumbLink href="/use-cases">Use Cases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/use-cases/${id}`}>{useCase.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <UseCaseForm
        mode="edit"
        initialData={{
          id: useCase.id,
          name: useCase.name,
          category: useCase.category,
          description: useCase.description || '',
          buyerOutcome: useCase.buyerOutcome || '',
          dataInputs: useCase.dataInputs || '',
          dataOutputs: useCase.dataOutputs || '',
          deliveryMechanism: useCase.deliveryMechanism || '',
          limitations: useCase.limitations || '',
          competitiveNotes: useCase.competitiveNotes || '',
          status: useCase.status,
          owner: useCase.owner || '',
        }}
      />
    </div>
  );
}
