// app/assessments/opportunity/page.tsx
import React from 'react';
import { getUseCasesForList } from '@/app/actions';
import OpportunityScoreForm from '@/components/assessments/OpportunityScoreForm';

export default async function OpportunityScorePage() {
  const useCases = await getUseCasesForList();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Opportunity Scoring
      </h1>
      <p className="text-muted-foreground mb-6">
        Score market opportunity based on ARR, pipeline, velocity, win rate, and strategic fit
      </p>

      <OpportunityScoreForm useCases={useCases} />
    </div>
  );
}
