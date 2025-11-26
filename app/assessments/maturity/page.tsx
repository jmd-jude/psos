// app/assessments/maturity/page.tsx
import React from 'react';
import { getUseCasesForList, getCompanyCapabilities } from '@/app/actions';
import MaturityAssessmentForm from '@/components/assessments/MaturityAssessmentForm';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function MaturityAssessmentPage() {
  const [useCases, capabilities] = await Promise.all([
    getUseCasesForList(),
    getCompanyCapabilities(),
  ]);

  return (
    <div>
      {/* Deprecation Notice */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              <p className="font-semibold mb-1">⚠️ This page is deprecated</p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Please use <Link href="/assessments/evaluate" className="underline font-medium">Evaluate Use Case</Link> instead.
                The new page combines market potential and capability readiness into a single workflow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">
          Capability Readiness
        </h1>
        <p className="text-muted-foreground mb-2">
          Assess use-case capability readiness. Use cases inherit company capabilities by default.
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
