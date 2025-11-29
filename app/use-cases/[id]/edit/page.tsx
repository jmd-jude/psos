// app/use-cases/[id]/edit/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getUseCaseById, getCategories, getVerticals, getDeliveryMechanisms } from '@/app/actions';
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
  const [useCase, categories, verticals, deliveryMechanisms] = await Promise.all([
    getUseCaseById(id),
    getCategories(),
    getVerticals(),
    getDeliveryMechanisms(),
  ]);

  if (!useCase) {
    notFound();
  }

  // Extract IDs from relationships
  const categoryIds = useCase.categories?.map(uc => uc.categoryId) || [];
  const verticalIds = useCase.verticals?.map(uv => uv.verticalId) || [];
  const deliveryMechanismIds = useCase.deliveryMechanisms?.map(um => um.deliveryMechanismId) || [];

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
        categories={categories}
        verticals={verticals}
        deliveryMechanisms={deliveryMechanisms}
        initialData={{
          id: useCase.id,
          name: useCase.name,
          // Feature Definition Fields
          problemContext: useCase.problemContext || '',
          targetAudience: useCase.targetAudience || '',
          valueBenefit: useCase.valueBenefit || '',
          successMeasures: useCase.successMeasures || '',
          // Existing fields
          categoryIds,
          verticalIds,
          deliveryMechanismIds,
          description: useCase.description || '',
          buyerOutcome: useCase.buyerOutcome || '',
          dataInputs: useCase.dataInputs || '',
          dataOutputs: useCase.dataOutputs || '',
          limitations: useCase.limitations || '',
          competitiveNotes: useCase.competitiveNotes || '',
          status: useCase.status,
          owner: useCase.owner || '',
        }}
      />
    </div>
  );
}
