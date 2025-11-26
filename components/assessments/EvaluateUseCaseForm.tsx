// components/assessments/EvaluateUseCaseForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyCapability } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import QuadrantBadge from '@/components/use-cases/QuadrantBadge';
import {
  getARRScore,
  getPipelineScore,
  getVelocityScore,
  getWinRateScore,
  getMatchRateScore,
  getLatencyScore,
  getPrivacyRiskScore,
  getDataSourceScore,
  getScaleScore,
  calculateOpportunityScore,
  classifyQuadrant,
} from '@/lib/calculations';

interface UseCase {
  id: string;
  name: string;
  categories?: any[];
}

interface Props {
  useCases: UseCase[];
  capabilities: CompanyCapability[];
}

interface CapabilityState {
  capabilityId: string;
  useCompanyScore: boolean;
  overrideScore: number;
  overrideRationale: string;
}

export default function EvaluateUseCaseForm({ useCases, capabilities }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');

  // --- Opportunity Scoring State ---
  // Business metrics state
  const [arrRaw, setArrRaw] = useState('');
  const [pipelineRaw, setPipelineRaw] = useState('');
  const [velocityRaw, setVelocityRaw] = useState('');
  const [winRateRaw, setWinRateRaw] = useState('');
  const [strategicFitScore, setStrategicFitScore] = useState('3');

  // Product metrics state
  const [matchRateImpact, setMatchRateImpact] = useState('');
  const [latencyRequirement, setLatencyRequirement] = useState<string>('');
  const [privacyRiskLevel, setPrivacyRiskLevel] = useState<string>('');
  const [dataSourceDepends, setDataSourceDepends] = useState('');
  const [scaleRequirement, setScaleRequirement] = useState<string>('');

  const [sourceNotes, setSourceNotes] = useState('');

  // --- Maturity Assessment State ---
  const [capabilityStates, setCapabilityStates] = useState<Map<string, CapabilityState>>(
    new Map(
      capabilities.map((cap) => [
        cap.id,
        {
          capabilityId: cap.id,
          useCompanyScore: true,
          overrideScore: 3,
          overrideRationale: '',
        },
      ])
    )
  );

  // --- Real-time Quadrant Calculation ---
  const [maturityAvg, setMaturityAvg] = useState(0);
  const [opportunityAvg, setOpportunityAvg] = useState(0);
  const [quadrant, setQuadrant] = useState<'INVEST' | 'HARVEST' | 'MAINTAIN' | 'DEPRIORITIZE'>('DEPRIORITIZE');

  const [loading, setLoading] = useState(false);

  // Fetch existing data when use case is selected
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!selectedUseCaseId) {
        // Clear all form data
        setArrRaw('');
        setPipelineRaw('');
        setVelocityRaw('');
        setWinRateRaw('');
        setStrategicFitScore('3');
        setMatchRateImpact('');
        setLatencyRequirement('');
        setPrivacyRiskLevel('');
        setDataSourceDepends('');
        setScaleRequirement('');
        setSourceNotes('');
        setCapabilityStates(
          new Map(
            capabilities.map((cap) => [
              cap.id,
              {
                capabilityId: cap.id,
                useCompanyScore: true,
                overrideScore: 3,
                overrideRationale: '',
              },
            ])
          )
        );
        return;
      }

      // Reset capability states to defaults BEFORE fetching
      // This ensures clean slate even if no assessments exist
      setCapabilityStates(
        new Map(
          capabilities.map((cap) => [
            cap.id,
            {
              capabilityId: cap.id,
              useCompanyScore: true,
              overrideScore: 3,
              overrideRationale: '',
            },
          ])
        )
      );

      try {
        // Fetch both opportunity score and maturity assessments in parallel
        const [opportunityRes, maturityRes] = await Promise.all([
          fetch(`/api/opportunity/${selectedUseCaseId}`),
          fetch(`/api/maturity/${selectedUseCaseId}`),
        ]);

        // Load opportunity score if exists
        if (opportunityRes.ok) {
          const data = await opportunityRes.json();
          if (data.arrRaw !== null) setArrRaw(data.arrRaw.toString());
          if (data.pipelineRaw !== null) setPipelineRaw(data.pipelineRaw.toString());
          if (data.velocityRaw !== null) setVelocityRaw(data.velocityRaw.toString());
          if (data.winRateRaw !== null) setWinRateRaw(data.winRateRaw.toString());
          if (data.strategicFitScore !== null) setStrategicFitScore(data.strategicFitScore.toString());
          if (data.matchRateImpact !== null) setMatchRateImpact(data.matchRateImpact.toString());
          if (data.latencyRequirement !== null) setLatencyRequirement(data.latencyRequirement);
          if (data.privacyRiskLevel !== null) setPrivacyRiskLevel(data.privacyRiskLevel);
          if (data.dataSourceDepends !== null) setDataSourceDepends(data.dataSourceDepends);
          if (data.scaleRequirement !== null) setScaleRequirement(data.scaleRequirement);
          if (data.sourceNotes !== null) setSourceNotes(data.sourceNotes);
        }

        // Load maturity assessments if exist
        if (maturityRes.ok) {
          const assessments = await maturityRes.json();
          const assessmentMap = new Map(
            assessments.map((assessment: any) => [
              assessment.capabilityId,
              {
                capabilityId: assessment.capabilityId,
                useCompanyScore: assessment.useCompanyScore,
                overrideScore: assessment.overrideScore ?? 3,
                overrideRationale: assessment.overrideRationale ?? '',
              },
            ])
          );

          setCapabilityStates(
            new Map(
              capabilities.map((cap) => [
                cap.id,
                assessmentMap.get(cap.id) ?? {
                  capabilityId: cap.id,
                  useCompanyScore: true,
                  overrideScore: 3,
                  overrideRationale: '',
                },
              ])
            )
          );
        }
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    };

    fetchExistingData();
  }, [selectedUseCaseId, capabilities]);

  // Real-time quadrant calculation
  useEffect(() => {
    // Calculate maturity average
    const states = Array.from(capabilityStates.values());
    const maturityScores = states.map((state) => {
      if (state.useCompanyScore) {
        const capability = capabilities.find((cap) => cap.id === state.capabilityId);
        return capability?.score ?? 0;
      } else {
        return state.overrideScore;
      }
    });
    const matAvg = maturityScores.length > 0
      ? maturityScores.reduce((sum, s) => sum + s, 0) / maturityScores.length
      : 0;
    setMaturityAvg(matAvg);

    // Calculate opportunity average
    const arrScore = arrRaw ? getARRScore(parseFloat(arrRaw)) : null;
    const pipelineScore = pipelineRaw ? getPipelineScore(parseFloat(pipelineRaw)) : null;
    const velocityScore = velocityRaw ? getVelocityScore(parseFloat(velocityRaw)) : null;
    const winRateScore = winRateRaw ? getWinRateScore(parseFloat(winRateRaw)) : null;
    const matchRateScore = matchRateImpact ? getMatchRateScore(parseFloat(matchRateImpact)) : null;
    const latencyScore = latencyRequirement ? getLatencyScore(latencyRequirement) : null;
    const privacyRiskScore = privacyRiskLevel ? getPrivacyRiskScore(privacyRiskLevel) : null;
    const dataSourceScore = dataSourceDepends ? getDataSourceScore(dataSourceDepends) : null;
    const scaleScore = scaleRequirement ? getScaleScore(scaleRequirement) : null;

    const oppScores = calculateOpportunityScore({
      arrScore,
      pipelineScore,
      velocityScore,
      winRateScore,
      strategicFitScore: strategicFitScore ? parseInt(strategicFitScore) : null,
      matchRateScore,
      latencyScore,
      privacyRiskScore,
      dataSourceScore,
      scaleScore,
    });
    setOpportunityAvg(oppScores.overall);

    // Classify quadrant
    setQuadrant(classifyQuadrant(matAvg, oppScores.overall));
  }, [
    capabilityStates,
    capabilities,
    arrRaw,
    pipelineRaw,
    velocityRaw,
    winRateRaw,
    strategicFitScore,
    matchRateImpact,
    latencyRequirement,
    privacyRiskLevel,
    dataSourceDepends,
    scaleRequirement,
  ]);

  const handleInheritToggle = (capabilityId: string, useCompanyScore: boolean) => {
    const newStates = new Map(capabilityStates);
    const existing = newStates.get(capabilityId)!;
    newStates.set(capabilityId, { ...existing, useCompanyScore });
    setCapabilityStates(newStates);
  };

  const handleOverrideScoreChange = (capabilityId: string, score: number) => {
    const newStates = new Map(capabilityStates);
    const existing = newStates.get(capabilityId)!;
    newStates.set(capabilityId, { ...existing, overrideScore: score });
    setCapabilityStates(newStates);
  };

  const handleOverrideRationaleChange = (capabilityId: string, rationale: string) => {
    const newStates = new Map(capabilityStates);
    const existing = newStates.get(capabilityId)!;
    newStates.set(capabilityId, { ...existing, overrideRationale: rationale });
    setCapabilityStates(newStates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUseCaseId) {
      toast({
        title: 'Error',
        description: 'Please select a use case',
        variant: 'destructive',
      });
      return;
    }

    // Validate maturity overrides have rationale
    const states = Array.from(capabilityStates.values());
    for (const state of states) {
      if (!state.useCompanyScore && !state.overrideRationale.trim()) {
        toast({
          title: 'Error',
          description: 'Please provide a rationale for all overridden capabilities',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);

    // Calculate scores
    const arrScore = arrRaw ? getARRScore(parseFloat(arrRaw)) : null;
    const pipelineScore = pipelineRaw ? getPipelineScore(parseFloat(pipelineRaw)) : null;
    const velocityScore = velocityRaw ? getVelocityScore(parseFloat(velocityRaw)) : null;
    const winRateScore = winRateRaw ? getWinRateScore(parseFloat(winRateRaw)) : null;
    const matchRateScore = matchRateImpact ? getMatchRateScore(parseFloat(matchRateImpact)) : null;
    const latencyScore = latencyRequirement ? getLatencyScore(latencyRequirement) : null;
    const privacyRiskScore = privacyRiskLevel ? getPrivacyRiskScore(privacyRiskLevel) : null;
    const dataSourceScore = dataSourceDepends ? getDataSourceScore(dataSourceDepends) : null;
    const scaleScore = scaleRequirement ? getScaleScore(scaleRequirement) : null;

    const assessments = states.map((state) => ({
      capabilityId: state.capabilityId,
      useCompanyScore: state.useCompanyScore,
      overrideScore: state.useCompanyScore ? null : state.overrideScore,
      overrideRationale: state.useCompanyScore ? null : state.overrideRationale,
    }));

    try {
      // Save both opportunity and maturity sequentially
      const [opportunityRes, maturityRes] = await Promise.all([
        fetch('/api/opportunity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            useCaseId: selectedUseCaseId,
            arrRaw: arrRaw ? parseFloat(arrRaw) : null,
            arrScore,
            pipelineRaw: pipelineRaw ? parseFloat(pipelineRaw) : null,
            pipelineScore,
            velocityRaw: velocityRaw ? parseFloat(velocityRaw) : null,
            velocityScore,
            winRateRaw: winRateRaw ? parseFloat(winRateRaw) : null,
            winRateScore,
            strategicFitScore: strategicFitScore ? parseInt(strategicFitScore) : null,
            matchRateImpact: matchRateImpact ? parseFloat(matchRateImpact) : null,
            matchRateScore,
            latencyRequirement: latencyRequirement || null,
            latencyScore,
            privacyRiskLevel: privacyRiskLevel || null,
            privacyRiskScore,
            dataSourceDepends: dataSourceDepends || null,
            dataSourceScore,
            scaleRequirement: scaleRequirement || null,
            scaleScore,
            sourceNotes: sourceNotes || null,
          }),
        }),
        fetch('/api/maturity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            useCaseId: selectedUseCaseId,
            assessments,
          }),
        }),
      ]);

      if (!opportunityRes.ok || !maturityRes.ok) {
        throw new Error('Failed to save use case evaluation');
      }

      toast({
        title: 'Success',
        description: 'Use case evaluation saved successfully',
      });

      router.push(`/use-cases/${selectedUseCaseId}`);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save use case evaluation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const overrideCount = Array.from(capabilityStates.values()).filter(
    (s) => !s.useCompanyScore
  ).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Use Case Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Use Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUseCaseId} onValueChange={setSelectedUseCaseId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a use case to evaluate..." />
            </SelectTrigger>
            <SelectContent>
              {useCases.map((uc) => (
                <SelectItem key={uc.id} value={uc.id}>
                  {uc.name}
                  {uc.categories && uc.categories.length > 0 && (
                    <> ({uc.categories.map(c => c.category.name).join(', ')})</>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedUseCaseId && (
        <>
          {/* MARKET POTENTIAL & CAPABILITY READINESS */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Use Case Evaluation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue Pipeline Opportunity - Collapsible */}
              <Card>
                <Accordion type="single" collapsible>
                  <AccordionItem value="revenue-pipeline" className="border-0">
                    <CardHeader className="pb-3">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline pt-0">
                        Revenue Pipeline Opportunity
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pt-0 space-y-4">
                  {/* ARR */}
                  <div>
                    <Label htmlFor="arrRaw">Annual Recurring Revenue (ARR)</Label>
                    <Input
                      id="arrRaw"
                      type="number"
                      placeholder="500000"
                      value={arrRaw}
                      onChange={(e) => setArrRaw(e.target.value)}
                    />
                    {arrRaw && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getARRScore(parseFloat(arrRaw))}/5
                      </p>
                    )}
                  </div>

                  {/* Pipeline */}
                  <div>
                    <Label htmlFor="pipelineRaw">Pipeline Value</Label>
                    <Input
                      id="pipelineRaw"
                      type="number"
                      placeholder="1000000"
                      value={pipelineRaw}
                      onChange={(e) => setPipelineRaw(e.target.value)}
                    />
                    {pipelineRaw && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getPipelineScore(parseFloat(pipelineRaw))}/5
                      </p>
                    )}
                  </div>

                  {/* Velocity */}
                  <div>
                    <Label htmlFor="velocityRaw">Sales Cycle (days)</Label>
                    <Input
                      id="velocityRaw"
                      type="number"
                      placeholder="60"
                      value={velocityRaw}
                      onChange={(e) => setVelocityRaw(e.target.value)}
                    />
                    {velocityRaw && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getVelocityScore(parseFloat(velocityRaw))}/5 (lower days = better)
                      </p>
                    )}
                  </div>

                  {/* Win Rate */}
                  <div>
                    <Label htmlFor="winRateRaw">Win Rate (0-1 decimal)</Label>
                    <Input
                      id="winRateRaw"
                      type="number"
                      step="0.01"
                      placeholder="0.35"
                      value={winRateRaw}
                      onChange={(e) => setWinRateRaw(e.target.value)}
                    />
                    {winRateRaw && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getWinRateScore(parseFloat(winRateRaw))}/5
                      </p>
                    )}
                  </div>

                        {/* Strategic Fit */}
                        <div>
                          <Label htmlFor="strategicFit">Strategic Fit (1-5)</Label>
                          <Select value={strategicFitScore} onValueChange={setStrategicFitScore}>
                            <SelectTrigger id="strategicFit">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Poor fit</SelectItem>
                              <SelectItem value="2">2 - Weak fit</SelectItem>
                              <SelectItem value="3">3 - Moderate fit</SelectItem>
                              <SelectItem value="4">4 - Strong fit</SelectItem>
                              <SelectItem value="5">5 - Perfect fit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Technical Requirements - Collapsible */}
              <Card>
                <Accordion type="single" collapsible>
                  <AccordionItem value="technical-requirements" className="border-0">
                    <CardHeader className="pb-3">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline pt-0">
                        Technical Requirements
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pt-0 space-y-4">
                  {/* Match Rate Impact */}
                  <div>
                    <Label htmlFor="matchRateImpact">Match Rate Improvement (decimal)</Label>
                    <Input
                      id="matchRateImpact"
                      type="number"
                      step="0.01"
                      placeholder="0.07 (7% improvement)"
                      value={matchRateImpact}
                      onChange={(e) => setMatchRateImpact(e.target.value)}
                    />
                    {matchRateImpact && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getMatchRateScore(parseFloat(matchRateImpact))}/5
                        ({(parseFloat(matchRateImpact) * 100).toFixed(1)}% improvement)
                      </p>
                    )}
                  </div>

                  {/* Latency Requirement */}
                  <div>
                    <Label htmlFor="latencyReq">Latency Requirement</Label>
                    <Select value={latencyRequirement} onValueChange={setLatencyRequirement}>
                      <SelectTrigger id="latencyReq">
                        <SelectValue placeholder="Select latency requirement..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="batch">Batch (hours) - Score: 1/5</SelectItem>
                        <SelectItem value="near-real-time">Near Real-Time (&lt;1s) - Score: 3/5</SelectItem>
                        <SelectItem value="real-time">Real-Time (&lt;100ms) - Score: 5/5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Privacy Risk */}
                  <div>
                    <Label htmlFor="privacyRisk">Privacy/Compliance Risk</Label>
                    <Select value={privacyRiskLevel} onValueChange={setPrivacyRiskLevel}>
                      <SelectTrigger id="privacyRisk">
                        <SelectValue placeholder="Select privacy risk level..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Score: 5/5 (minimal compliance burden)</SelectItem>
                        <SelectItem value="medium">Medium - Score: 3/5 (moderate compliance)</SelectItem>
                        <SelectItem value="high">High - Score: 1/5 (PII exposure, sensitive data)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Data Source Dependencies */}
                  <div>
                    <Label htmlFor="dataSourceDepends">Data Source Dependencies</Label>
                    <Input
                      id="dataSourceDepends"
                      placeholder="Email, MAID, Postal (comma-separated)"
                      value={dataSourceDepends}
                      onChange={(e) => setDataSourceDepends(e.target.value)}
                    />
                    {dataSourceDepends && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {getDataSourceScore(dataSourceDepends)}/5
                        ({dataSourceDepends.split(',').filter(Boolean).length} source(s))
                      </p>
                    )}
                  </div>

                        {/* Scale Requirement */}
                        <div>
                          <Label htmlFor="scaleReq">Scale Requirement</Label>
                          <Select value={scaleRequirement} onValueChange={setScaleRequirement}>
                            <SelectTrigger id="scaleReq">
                              <SelectValue placeholder="Select scale requirement..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sample">Sample - Score: 5/5 (minimal infrastructure)</SelectItem>
                              <SelectItem value="subset">Subset - Score: 3/5 (moderate infrastructure)</SelectItem>
                              <SelectItem value="full-graph">Full Graph - Score: 1/5 (1.6T events/month)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Capability Readiness - Collapsible */}
              <Card>
                <Accordion type="single" collapsible>
                  <AccordionItem value="capability-readiness" className="border-0">
                    <CardHeader className="pb-3">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline pt-0">
                        Capability Readiness
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pt-0 space-y-6">
                      {/* Help Text */}
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm text-blue-900 dark:text-blue-100">
                            <p className="font-medium mb-1">Most use cases can inherit company capabilities</p>
                            <p className="text-blue-800 dark:text-blue-200">
                              Only override when this use case has unique requirements, is significantly more/less
                              mature than average, or you have specific evidence this capability differs.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Override Count */}
                      {overrideCount > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {overrideCount} of {capabilities.length} capabilities overridden
                        </div>
                      )}

                      {/* Capabilities */}
                      <div className="space-y-6">
                        {capabilities.map((capability) => {
                          const state = capabilityStates.get(capability.id)!;

                          return (
                            <div key={capability.id} className="border rounded-lg p-4 space-y-3">
                              {/* Capability Header */}
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  id={`inherit-${capability.id}`}
                                  checked={state.useCompanyScore}
                                  onCheckedChange={(checked) =>
                                    handleInheritToggle(capability.id, checked as boolean)
                                  }
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`inherit-${capability.id}`}
                                    className="text-base font-medium cursor-pointer"
                                  >
                                    {capability.name}
                                  </Label>
                                  {capability.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {capability.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Inherited Score (Read-Only) */}
                              {state.useCompanyScore ? (
                                <div className="ml-9 p-3 bg-muted rounded-md">
                                  <p className="text-sm">
                                    <strong>Score: {capability.score}/5</strong>{' '}
                                    <span className="text-muted-foreground">(inherited from company)</span>
                                  </p>
                                  {capability.rationale && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {capability.rationale}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                /* Override Inputs */
                                <div className="ml-9 space-y-3">
                                  <div>
                                    <Label htmlFor={`score-${capability.id}`}>Override Score (1-5)</Label>
                                    <Select
                                      value={state.overrideScore.toString()}
                                      onValueChange={(value) =>
                                        handleOverrideScoreChange(capability.id, parseInt(value))
                                      }
                                    >
                                      <SelectTrigger id={`score-${capability.id}`} className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 - Initial</SelectItem>
                                        <SelectItem value="2">2 - Developing</SelectItem>
                                        <SelectItem value="3">3 - Defined</SelectItem>
                                        <SelectItem value="4">4 - Managed</SelectItem>
                                        <SelectItem value="5">5 - Optimizing</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor={`rationale-${capability.id}`}>
                                      Rationale (required) *
                                    </Label>
                                    <Textarea
                                      id={`rationale-${capability.id}`}
                                      placeholder="Explain why this use case differs from company capability..."
                                      value={state.overrideRationale}
                                      onChange={(e) =>
                                        handleOverrideRationaleChange(capability.id, e.target.value)
                                      }
                                      className="min-h-[80px]"
                                      required={!state.useCompanyScore}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
            </div>

            {/* Source Notes - Not Collapsible */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Source Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Document data sources, assumptions, and rationale..."
                  value={sourceNotes}
                  onChange={(e) => setSourceNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* REAL-TIME QUADRANT PREVIEW */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Strategic Position (Preview)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <QuadrantBadge quadrant={quadrant} size="medium" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Market Potential: {opportunityAvg.toFixed(1)}/5.0
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Capability Readiness: {maturityAvg.toFixed(1)}/5.0
                  </p>
                </div>
                <div className="text-sm text-muted-foreground max-w-md">
                  {quadrant === 'INVEST' && (
                    <p>High opportunity, low readiness → Prioritize capability development</p>
                  )}
                  {quadrant === 'HARVEST' && (
                    <p>High opportunity, high readiness → Maximize returns and scale</p>
                  )}
                  {quadrant === 'MAINTAIN' && (
                    <p>Low opportunity, high readiness → Efficient sustain mode</p>
                  )}
                  {quadrant === 'DEPRIORITIZE' && (
                    <p>Low opportunity, low readiness → Consider sunsetting</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/use-cases')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Use Case Evaluation'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
