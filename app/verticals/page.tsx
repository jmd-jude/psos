// app/verticals/page.tsx
import React from 'react';
import { getVerticals } from '@/app/actions';
import VerticalsTable from '@/components/verticals/VerticalsTable';

export default async function VerticalsPage() {
  const verticals = await getVerticals();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Vertical Markets
      </h1>
      <p className="text-muted-foreground mb-6">
        Market segments and industry verticals
      </p>

      <VerticalsTable verticals={verticals} />
    </div>
  );
}
