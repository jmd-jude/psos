// app/assessments/maturity/page.tsx
import React from 'react';
import { getUseCasesForList, getCompanyCapabilities } from '@/app/actions';
import MaturityAssessmentForm from '@/components/assessments/MaturityAssessmentForm';
import Link from 'next/link';

export default async function MaturityAssessmentPage() {
  const [useCases, capabilities] = await Promise.all([
    getUseCasesForList(),
    getCompanyCapabilities(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">
          Maturity Assessment
        </h1>
        <p className="text-muted-foreground mb-2">
          Assess use-case capability maturity. Use cases inherit company capabilities by default.
        </p>
        <Link
          href="/settings/capabilities"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View company capabilities →
        </Link>
      </div>

      <MaturityAssessmentForm useCases={useCases} capabilities={capabilities} />
    </div>
  );
}
