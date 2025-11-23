// app/use-cases/page.tsx
import React from 'react';
import Link from 'next/link';
import { getUseCasesForList } from '@/app/actions';
import UseCaseTable from '@/components/use-cases/UseCaseTable';
import { Button } from '@/components/ui/button';

export default async function UseCasesPage() {
  const useCases = await getUseCasesForList();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Use Cases
        </h1>
        <Link href="/use-cases/new">
          <Button>
            Add Use Case
          </Button>
        </Link>
      </div>

      <UseCaseTable useCases={useCases} />
    </div>
  );
}
