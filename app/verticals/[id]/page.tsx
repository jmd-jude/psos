// app/verticals/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVerticalById } from '@/app/actions';
import ScoreDisplay from '@/components/common/ScoreDisplay';
import StrategicPriorityBadge from '@/components/common/StrategicPriorityBadge';
import QuadrantBadge from '@/components/use-cases/QuadrantBadge';
import DeleteButton from '@/components/common/DeleteButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VerticalDetailPage({ params }: Props) {
  const { id } = await params;
  const vertical = await getVerticalById(id);

  if (!vertical) {
    notFound();
  }

  // Count use cases by quadrant
  const quadrantCounts = vertical.useCasesWithScores.reduce((acc, uc) => {
    acc[uc.quadrant] = (acc[uc.quadrant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count use cases by category
  const categoryCounts = vertical.useCasesWithScores.reduce((acc, uc) => {
    acc[uc.category] = (acc[uc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average scores
  const avgMaturity = vertical.useCasesWithScores.length > 0
    ? vertical.useCasesWithScores.reduce((sum, uc) => sum + uc.maturityScore, 0) / vertical.useCasesWithScores.length
    : 0;

  const avgOpportunity = vertical.useCasesWithScores.length > 0
    ? vertical.useCasesWithScores.reduce((sum, uc) => sum + uc.opportunityScore, 0) / vertical.useCasesWithScores.length
    : 0;

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/verticals">Verticals</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vertical.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            {vertical.name}
          </h1>
          <Badge variant="default">
            Strategic Priority: {vertical.strategicPriority}
          </Badge>
        </div>
        <div className="flex gap-4">
          <Link href={`/verticals/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <DeleteButton
            id={id}
            entityType="vertical"
            entityName={vertical.name}
            redirectPath="/verticals"
          />
          <Link href="/verticals">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vertical.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-base">{vertical.description}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vertical.keyBuyerPersona && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Key Buyer Persona
                  </p>
                  <p className="text-base">{vertical.keyBuyerPersona}</p>
                </div>
              )}
              {vertical.primaryPainPoint && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Primary Pain Point
                  </p>
                  <p className="text-base">{vertical.primaryPainPoint}</p>
                </div>
              )}
            </div>
            {vertical.complianceConsiderations && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Compliance Considerations
                </p>
                <p className="text-base">{vertical.complianceConsiderations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Maturity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <ScoreDisplay score={avgMaturity} maxScore={5} size="large" showBar={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Average capability maturity across {vertical.useCasesWithScores.length} use case(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Opportunity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <ScoreDisplay score={avgOpportunity} maxScore={5} size="large" showBar={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Average market opportunity across {vertical.useCasesWithScores.length} use case(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quadrant & Category Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Quadrant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {(['INVEST', 'HARVEST', 'MAINTAIN', 'DEPRIORITIZE'] as const).map((quadrant) => (
                  <div key={quadrant} className="flex justify-between items-center">
                    <QuadrantBadge quadrant={quadrant} size="small" />
                    <span className="text-lg text-muted-foreground">
                      {quadrantCounts[quadrant] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(categoryCounts).length > 0 ? (
                <div className="flex flex-col gap-3">
                  {Object.entries(categoryCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <Badge variant="default">{count}</Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No use cases linked yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Use Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Use Cases ({vertical.useCasesWithScores.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Fit</TableHead>
                  <TableHead className="font-semibold">Strategic Priority</TableHead>
                  <TableHead className="font-semibold">Maturity</TableHead>
                  <TableHead className="font-semibold">Opportunity</TableHead>
                  <TableHead className="font-semibold">Quadrant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vertical.useCasesWithScores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No use cases linked to this vertical
                    </TableCell>
                  </TableRow>
                ) : (
                  vertical.useCasesWithScores.map((uc) => (
                    <TableRow key={uc.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link
                          href={`/use-cases/${uc.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {uc.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {uc.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{uc.fit}</Badge>
                      </TableCell>
                      <TableCell>
                        <StrategicPriorityBadge verticals={uc.verticals} />
                      </TableCell>
                      <TableCell>
                        <ScoreDisplay
                          score={uc.maturityScore}
                          maxScore={5}
                          size="small"
                          showBar={false}
                        />
                      </TableCell>
                      <TableCell>
                        <ScoreDisplay
                          score={uc.opportunityScore}
                          maxScore={5}
                          size="small"
                          showBar={false}
                        />
                      </TableCell>
                      <TableCell>
                        <QuadrantBadge quadrant={uc.quadrant} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
