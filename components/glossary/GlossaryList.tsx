// components/glossary/GlossaryList.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';

type GlossaryTerm = {
  id: string;
  term: string;
  abbreviation: string | null;
  definition: string;
  context: string | null;
  category: string;
};

interface Props {
  groupedTerms: Record<string, GlossaryTerm[]>;
}

export default function GlossaryList({ groupedTerms }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter terms based on search query
  const filterTerms = (terms: GlossaryTerm[]) => {
    if (!searchQuery) return terms;
    const query = searchQuery.toLowerCase();
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.abbreviation?.toLowerCase().includes(query)
    );
  };

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Accordion type="multiple" defaultValue={Object.keys(groupedTerms)} className="space-y-2">
        {Object.entries(groupedTerms).map(([category, terms]) => {
          const filteredTerms = filterTerms(terms);
          if (filteredTerms.length === 0) return null;

          return (
            <AccordionItem key={category} value={category} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{category}</span>
                  <span className="text-sm text-muted-foreground">
                    ({filteredTerms.length} terms)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 pt-2">
                  {filteredTerms.map((term) => (
                    <div key={term.id} className="pb-4 border-b last:border-b-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-base font-semibold">{term.term}</h3>
                        {term.abbreviation && (
                          <span className="text-sm text-muted-foreground">
                            ({term.abbreviation})
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-1">{term.definition}</p>
                      {term.context && (
                        <p className="text-xs text-muted-foreground">
                          Context: {term.context}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
