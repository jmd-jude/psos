// components/verticals/VerticalsTable.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SearchInput from '@/components/common/SearchInput';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VerticalsTableProps {
  verticals: Array<{
    id: string;
    name: string;
  }>;
}

export default function VerticalsTable({ verticals }: VerticalsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVerticals = useMemo(() => {
    if (!searchQuery) return verticals;

    const query = searchQuery.toLowerCase();
    return verticals.filter(v =>
      v.name.toLowerCase().includes(query)
    );
  }, [verticals, searchQuery]);

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <SearchInput
          placeholder="Search verticals..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground mb-3">
          Showing {filteredVerticals.length} of {verticals.length} verticals
        </p>
      )}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVerticals.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? `No verticals found matching "${searchQuery}"`
                    : 'No verticals found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredVerticals.map((vertical) => (
                <TableRow key={vertical.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link
                      href={`/verticals/${vertical.id}`}
                      className="text-sm font-medium hover:underline block"
                    >
                      {vertical.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
