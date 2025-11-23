// app/use-cases/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUseCaseById } from '@/app/actions';
import ScoreDisplay from '@/components/common/ScoreDisplay';
import QuadrantBadge from '@/components/use-cases/QuadrantBadge';
import DeleteButton from '@/components/common/DeleteButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

const getQuadrantDescription = (quadrant: string) => {
  switch (quadrant) {
    case 'INVEST':
      return 'High opportunity, high maturity. Prioritize for growth and investment.';
    case 'HARVEST':
      return 'High maturity, low opportunity. Maintain efficiently and harvest value.';
    case 'MAINTAIN':
      return 'High opportunity, low maturity. Invest in capability development.';
    case 'DEPRIORITIZE':
      return 'Low opportunity, low maturity. Consider deprioritizing or sunsetting.';
    default:
      return 'No strategic recommendation available.';
  }
};

export default async function UseCaseDetailPage({ params }: Props) {
  const { id } = await params;
  const useCase = await getUseCaseById(id);

  if (!useCase) {
    notFound();
  }

  const mostRecentOpportunity = useCase.opportunityScores[0];

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/use-cases">Use Cases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{useCase.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">{useCase.name}</h1>
        <div className="flex gap-4">
          <Link href={`/use-cases/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <DeleteButton
            id={id}
            entityType="use-case"
            entityName={useCase.name}
            redirectPath="/use-cases"
          />
          <Link href="/use-cases">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Category
              </p>
              <p className="text-base">{useCase.category}</p>
            </div>

            {useCase.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm">{useCase.description}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Status
              </p>
              <div className="mt-1">
                <Badge variant={useCase.status === 'Active' ? 'default' : 'secondary'}>
                  {useCase.status}
                </Badge>
              </div>
            </div>

            {useCase.owner && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Owner
                </p>
                <p className="text-base">{useCase.owner}</p>
              </div>
            )}

            {useCase.buyerOutcome && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Buyer Outcome
                </p>
                <p className="text-sm">{useCase.buyerOutcome}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Maturity Score */}
        <Card>
          <CardHeader>
            <CardTitle>Maturity Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Average Maturity Score
              </p>
              <div className="mt-2">
                <ScoreDisplay
                  score={useCase.maturityAverage}
                  maxScore={5}
                  size="large"
                  showBar={true}
                />
              </div>
            </div>

            {useCase.maturityAssessments.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Pillar Breakdown
                </p>
                <ul className="space-y-2">
                  {useCase.maturityAssessments.map((assessment) => (
                    <li key={assessment.id} className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{assessment.pillar.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.rationale || 'No rationale provided'}
                        </p>
                      </div>
                      <div className="ml-4">
                        <ScoreDisplay
                          score={assessment.score}
                          maxScore={5}
                          size="small"
                          showBar={false}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Opportunity Score */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Average Opportunity Score
              </p>
              <div className="mt-2">
                <ScoreDisplay
                  score={useCase.opportunityAverage}
                  maxScore={5}
                  size="large"
                  showBar={true}
                />
              </div>
            </div>

            {mostRecentOpportunity && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Metric Breakdown
                </p>
                <ul className="space-y-2">
                  {mostRecentOpportunity.arrScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">ARR Impact</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.arrScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.pipelineScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Pipeline Impact</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.pipelineScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.velocityScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Velocity Impact</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.velocityScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.winRateScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Win Rate Impact</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.winRateScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.strategicFitScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Strategic Fit</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.strategicFitScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Quadrant & Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Quadrant
              </p>
              <div className="mt-2">
                <QuadrantBadge quadrant={useCase.quadrant} />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Strategic Recommendation
              </p>
              <p className="text-sm mt-2">
                {getQuadrantDescription(useCase.quadrant)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Related Verticals */}
        <Card>
          <CardHeader>
            <CardTitle>Target Verticals</CardTitle>
          </CardHeader>
          <CardContent>
            {useCase.verticals.length > 0 ? (
              <ul className="space-y-2">
                {useCase.verticals.map((ucv) => (
                  <li key={ucv.id} className="py-1">
                    <Link
                      href={`/verticals/${ucv.vertical.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {ucv.vertical.name}
                    </Link>
                    {ucv.fit && (
                      <p className="text-xs text-muted-foreground">Fit: {ucv.fit}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No verticals assigned yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card 6: Technical Details & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {useCase.dataInputs && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Data Inputs
                </p>
                <p className="text-sm">{useCase.dataInputs}</p>
              </div>
            )}

            {useCase.dataOutputs && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Data Outputs
                </p>
                <p className="text-sm">{useCase.dataOutputs}</p>
              </div>
            )}

            {useCase.deliveryMechanism && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Delivery Mechanism
                </p>
                <p className="text-sm">{useCase.deliveryMechanism}</p>
              </div>
            )}

            {useCase.limitations && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Limitations
                </p>
                <p className="text-sm">{useCase.limitations}</p>
              </div>
            )}

            {useCase.competitiveNotes && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Competitive Notes
                </p>
                <p className="text-sm">{useCase.competitiveNotes}</p>
              </div>
            )}

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Last Reviewed
              </p>
              <p className="text-sm">
                {useCase.lastReviewed
                  ? new Date(useCase.lastReviewed).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Last Updated
              </p>
              <p className="text-sm">
                {new Date(useCase.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
