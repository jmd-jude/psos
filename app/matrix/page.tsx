// app/matrix/page.tsx
import React from 'react';
import { getPrioritizationMatrixData } from '@/app/actions';
import PrioritizationMatrix from '@/components/matrix/PrioritizationMatrix';

export default async function MatrixPage() {
  const matrixData = await getPrioritizationMatrixData();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Prioritization Matrix
      </h1>
      <p className="text-muted-foreground mb-6">
        Visual representation of use cases by maturity and opportunity
      </p>

      <PrioritizationMatrix data={matrixData} />
    </div>
  );
}
