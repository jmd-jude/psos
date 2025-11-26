// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { getPrioritizationMatrixData } from '@/app/actions';
import PrioritizationMatrix from '@/components/matrix/PrioritizationMatrix';
import ScoreDisplay from '@/components/common/ScoreDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const getQuadrantVariant = (quadrant: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (quadrant) {
    case 'INVEST': return 'default';
    case 'HARVEST': return 'secondary';
    case 'MAINTAIN': return 'outline';
    case 'DEPRIORITIZE': return 'destructive';
    default: return 'secondary';
  }
};

// The default export is now an async Server Component
export default async function DashboardPage() {
  // Fetch the data on the server
  const matrixData = await getPrioritizationMatrixData();

  // Calculate quadrant counts
  const quadrantCounts = matrixData.reduce((acc, point) => {
    acc[point.quadrant] = (acc[point.quadrant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average scores
  const avgMaturity = matrixData.length > 0
    ? matrixData.reduce((sum, p) => sum + p.maturityScore.averageScore, 0) / matrixData.length
    : 0;

  const avgOpportunity = matrixData.length > 0
    ? matrixData.reduce((sum, p) => sum + p.opportunityScore.averageScore, 0) / matrixData.length
    : 0;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Use Case Portfolio Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Quadrant Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Badge variant={getQuadrantVariant('INVEST')} className="mb-2">
                INVEST
              </Badge>
              <div className="text-4xl font-bold text-primary mb-1">
                {quadrantCounts['INVEST'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                High Opportunity, Low Maturity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Badge variant={getQuadrantVariant('HARVEST')} className="mb-2">
                HARVEST
              </Badge>
              <div className="text-4xl font-bold text-secondary mb-1">
                {quadrantCounts['HARVEST'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                High Opportunity, High Maturity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Badge variant={getQuadrantVariant('MAINTAIN')} className="mb-2">
                MAINTAIN
              </Badge>
              <div className="text-4xl font-bold mb-1">
                {quadrantCounts['MAINTAIN'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Low Opportunity, High Maturity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Badge variant={getQuadrantVariant('DEPRIORITIZE')} className="mb-2">
                DEPRIORITIZE
              </Badge>
              <div className="text-4xl font-bold mb-1">
                {quadrantCounts['DEPRIORITIZE'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Low Opportunity, Low Maturity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Average Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Average Maturity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <ScoreDisplay score={avgMaturity} maxScore={5} size="large" showBar={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Average capability maturity across all use cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Average Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <ScoreDisplay score={avgOpportunity} maxScore={5} size="large" showBar={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Average market opportunity (business metrics) across all use cases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Link href="/use-cases/new">
                <Button>Add Use Case</Button>
              </Link>
              <Link href="/assessments/maturity">
                <Button variant="outline">Run Maturity Assessment</Button>
              </Link>
              <Link href="/assessments/opportunity">
                <Button variant="outline">Score Opportunity</Button>
              </Link>
              <Link href="/matrix">
                <Button variant="outline">View Prioritization Matrix</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Prioritization Matrix */}
        <div>
          <PrioritizationMatrix data={matrixData} />
        </div>
      </div>
    </div>
  );
}
