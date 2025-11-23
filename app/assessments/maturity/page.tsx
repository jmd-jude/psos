// app/assessments/maturity/page.tsx
import React from 'react';
import { getUseCasesForList, getCapabilityPillars } from '@/app/actions';
import MaturityAssessmentForm from '@/components/assessments/MaturityAssessmentForm';

export default async function MaturityAssessmentPage() {
  const [useCases, pillars] = await Promise.all([
    getUseCasesForList(),
    getCapabilityPillars(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Maturity Assessment
      </h1>
      <p className="text-muted-foreground mb-6">
        Assess use-case capability maturity across all pillars
      </p>

      <MaturityAssessmentForm useCases={useCases} pillars={pillars} />
    </div>
  );
}
