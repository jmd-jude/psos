// app/assessments/evaluate/page.tsx
import React from 'react';
import { getUseCasesForList, getCompanyCapabilities } from '@/app/actions';
import EvaluateUseCaseForm from '@/components/assessments/EvaluateUseCaseForm';

export default async function EvaluateUseCasePage() {
  const [useCases, capabilities] = await Promise.all([
    getUseCasesForList(),
    getCompanyCapabilities(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">
          Evaluate Use Case
        </h1>
        <p className="text-muted-foreground">
          Score market potential, technical requirements, and capability readiness
        </p>
      </div>

      <EvaluateUseCaseForm useCases={useCases} capabilities={capabilities} />
    </div>
  );
}
