// app/glossary/page.tsx
import React from 'react';

export default async function GlossaryPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Glossary
      </h1>
      <p className="text-muted-foreground mb-6">
        Reference guide for key terms and concepts
      </p>

      <p className="text-muted-foreground">
        No glossary terms found. Please add terms to populate the glossary.
      </p>
    </div>
  );
}
