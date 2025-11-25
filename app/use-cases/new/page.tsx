// app/use-cases/new/page.tsx
import React from 'react';
import UseCaseForm from '@/components/use-cases/UseCaseForm';
import { getCategories, getVerticals, getDeliveryMechanisms } from '@/app/actions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function NewUseCasePage() {
  const [categories, verticals, deliveryMechanisms] = await Promise.all([
    getCategories(),
    getVerticals(),
    getDeliveryMechanisms(),
  ]);

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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <UseCaseForm
        mode="create"
        categories={categories}
        verticals={verticals}
        deliveryMechanisms={deliveryMechanisms}
      />
    </div>
  );
}
