// app/use-cases/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUseCaseById } from '@/app/actions';
import ScoreDisplay from '@/components/common/ScoreDisplay';
import QuadrantBadge from '@/components/use-cases/QuadrantBadge';
import DeleteButton from '@/components/common/DeleteButton';
import InsightButton from '@/components/insights/InsightButton';
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

      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-semibold">{useCase.name}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <InsightButton
              useCaseId={id}
              analysisType="competitive"
              label="Competitive Analysis"
            />
            {useCase.maturityAverage < 3.5 && (
              <InsightButton
                useCaseId={id}
                analysisType="capability-gaps"
                label="Diagnose Gaps"
              />
            )}
            <InsightButton
              useCaseId={id}
              analysisType="vertical-fit"
              label="Vertical Fit"
            />
          </div>
          <div className="flex gap-2">
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
                Categories
              </p>
              {useCase.categories && useCase.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {useCase.categories.map((ucCat) => (
                    <Badge key={ucCat.id} variant="secondary">
                      {ucCat.category.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No categories assigned</p>
              )}
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
          </CardContent>
        </Card>

        {/* Feature Definition Card - only show if at least one field is populated */}
        {(useCase.problemContext || useCase.targetAudience || useCase.valueBenefit || useCase.successMeasures || useCase.buyerOutcome) && (
          <Card>
            <CardHeader>
              <CardTitle>Feature Definition</CardTitle>
              <p className="text-sm text-muted-foreground">
                Institutional knowledge captured from sales and product teams
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {useCase.problemContext && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Problem/Context
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{useCase.problemContext}</p>
                </div>
              )}

              {useCase.targetAudience && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Target Audience
                  </p>
                  <p className="text-sm">{useCase.targetAudience}</p>
                </div>
              )}

              {useCase.valueBenefit && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Value/Benefit
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{useCase.valueBenefit}</p>
                </div>
              )}

              {useCase.successMeasures && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Success Measures
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{useCase.successMeasures}</p>
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
        )}

        {/* Card 2: Capabilities Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Capabilities Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Average Capability Score
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

            {/* Capability Assessments with Inherit/Override indicators */}
            {useCase.capabilityAssessments && useCase.capabilityAssessments.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Capability Breakdown
                  </p>
                  <Link
                    href="/settings/capabilities"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View company capabilities
                  </Link>
                </div>
                <ul className="space-y-3">
                  {useCase.capabilityAssessments.map((assessment) => {
                    const finalScore = assessment.useCompanyScore
                      ? assessment.capability.score
                      : assessment.overrideScore;

                    return (
                      <li key={assessment.id} className="flex items-start justify-between border-b pb-2 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{assessment.capability.name}</p>

                          {assessment.useCompanyScore ? (
                            <p className="text-xs text-muted-foreground mt-1">
                              Inherited from company capability
                            </p>
                          ) : (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs mb-1">
                                Override
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {assessment.overrideRationale}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <ScoreDisplay
                            score={finalScore ?? 0}
                            maxScore={5}
                            size="small"
                            showBar={false}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No capability assessments yet.{' '}
                <Link href={`/assessments/evaluate?useCaseId=${useCase.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  Evaluate this use case
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Opportunity Score - UPDATED */}
        <Card>
          <CardHeader>
            <CardTitle>Market Opportunity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on business growth metrics: ARR, pipeline, velocity, win rate, and strategic fit
            </p>
          </CardHeader>
          <CardContent>
            {/* Overall Score */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Overall Opportunity Score
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
              <>
                {/* Business Metrics Breakdown */}
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Business Growth Metrics (60% weight)
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
              </>
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

        {/* Card 5: Classifications */}
        <Card>
          <CardHeader>
            <CardTitle>Classifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Categories */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Categories
              </p>
              {useCase.categories && useCase.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {useCase.categories.map((ucCat) => (
                    <Badge key={ucCat.id} variant="secondary">
                      {ucCat.category.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No categories assigned</p>
              )}
            </div>

            {/* Verticals */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Verticals
              </p>
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
                <p className="text-sm text-muted-foreground">No verticals assigned</p>
              )}
            </div>

            {/* Delivery Mechanisms */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Delivery Mechanisms
              </p>
              {useCase.deliveryMechanisms && useCase.deliveryMechanisms.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {useCase.deliveryMechanisms.map((ucMech) => (
                    <Badge key={ucMech.id} variant="outline">
                      {ucMech.deliveryMechanism.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No delivery mechanisms assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Competitive Notes */}
        {useCase.competitiveNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Competitive Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{useCase.competitiveNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Card 7: Technical Details & Metadata */}
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

            {useCase.limitations && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Limitations
                </p>
                <p className="text-sm">{useCase.limitations}</p>
              </div>
            )}

            {/* Technical Complexity Profile */}
            {mostRecentOpportunity && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Technical Complexity Profile (Reference Only)
                </p>
                <ul className="space-y-2">
                  {mostRecentOpportunity.matchRateScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">
                        Match Rate
                        {mostRecentOpportunity.matchRateImpact && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (+{(mostRecentOpportunity.matchRateImpact * 100).toFixed(1)}%)
                          </span>
                        )}
                      </span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.matchRateScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.latencyScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">
                        Latency
                        {mostRecentOpportunity.latencyRequirement && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({mostRecentOpportunity.latencyRequirement})
                          </span>
                        )}
                      </span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.latencyScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.privacyRiskScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">
                        Privacy/Compliance
                        {mostRecentOpportunity.privacyRiskLevel && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({mostRecentOpportunity.privacyRiskLevel} risk)
                          </span>
                        )}
                      </span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.privacyRiskScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.dataSourceScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Data Source Complexity</span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.dataSourceScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                  {mostRecentOpportunity.scaleScore !== null && (
                    <li className="flex items-center justify-between">
                      <span className="text-sm">
                        Scale
                        {mostRecentOpportunity.scaleRequirement && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({mostRecentOpportunity.scaleRequirement})
                          </span>
                        )}
                      </span>
                      <ScoreDisplay
                        score={mostRecentOpportunity.scaleScore}
                        maxScore={5}
                        size="small"
                        showBar={false}
                      />
                    </li>
                  )}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  These factors inform capability scoring but do not affect the opportunity score
                </p>
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
