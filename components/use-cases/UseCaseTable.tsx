// components/use-cases/UseCaseTable.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ScoreDisplay from '@/components/common/ScoreDisplay';
import StrategicPriorityBadge from '@/components/common/StrategicPriorityBadge';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface UseCase {
  id: string;
  name: string;
  category: string;
  status: string;
  lastReviewed: Date | null;
  maturityScore: number;
  opportunityScore: number;
  quadrant: 'INVEST' | 'HARVEST' | 'MAINTAIN' | 'DEPRIORITIZE';
  verticals: Array<{
    fit: string;
    vertical: {
      name: string;
      strategicPriority: string;
    };
  }>;
}

interface UseCaseTableProps {
  useCases: UseCase[];
}

const getQuadrantVariant = (quadrant: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (quadrant) {
    case 'INVEST': return 'default';
    case 'HARVEST': return 'secondary';
    case 'MAINTAIN': return 'outline';
    case 'DEPRIORITIZE': return 'destructive';
    default: return 'secondary';
  }
};

export default function UseCaseTable({ useCases }: UseCaseTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Strategic Priority</TableHead>
            <TableHead className="font-semibold">Maturity</TableHead>
            <TableHead className="font-semibold">Opportunity</TableHead>
            <TableHead className="font-semibold">Quadrant</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Last Reviewed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {useCases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No use cases found
              </TableCell>
            </TableRow>
          ) : (
            useCases.map((useCase) => (
              <TableRow key={useCase.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link
                    href={`/use-cases/${useCase.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {useCase.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {useCase.category}
                  </span>
                </TableCell>
                <TableCell>
                  <StrategicPriorityBadge verticals={useCase.verticals} />
                </TableCell>
                <TableCell>
                  <ScoreDisplay score={useCase.maturityScore} maxScore={5} size="small" />
                </TableCell>
                <TableCell>
                  <ScoreDisplay score={useCase.opportunityScore} maxScore={5} size="small" />
                </TableCell>
                <TableCell>
                  <Badge variant={getQuadrantVariant(useCase.quadrant)}>
                    {useCase.quadrant}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {useCase.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {useCase.lastReviewed
                      ? formatDistanceToNow(new Date(useCase.lastReviewed), { addSuffix: true })
                      : 'Never'}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
