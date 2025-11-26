// app/assessments/opportunity/page.tsx
import React from 'react';
import Link from 'next/link';
import { getUseCasesForList } from '@/app/actions';
import OpportunityScoreForm from '@/components/assessments/OpportunityScoreForm';
import { Card, CardContent } from '@/components/ui/card';

export default async function OpportunityScorePage() {
  const useCases = await getUseCasesForList();

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

      <h1 className="text-3xl font-semibold mb-2">
        Market Potential
      </h1>
      <p className="text-muted-foreground mb-6">
        Score market potential based on ARR, pipeline, velocity, win rate, and strategic fit
      </p>

      <OpportunityScoreForm useCases={useCases} />
    </div>
  );
}
