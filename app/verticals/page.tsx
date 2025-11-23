// app/verticals/page.tsx
import React from 'react';
import Link from 'next/link';
import { getVerticals } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verticals.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-8 text-muted-foreground">
                  No verticals found
                </TableCell>
              </TableRow>
            ) : (
              verticals.map((vertical) => (
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
