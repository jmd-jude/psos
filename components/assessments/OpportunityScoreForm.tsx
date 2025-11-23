'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
} from '@/lib/calculations';

export default function OpportunityScoreForm({ useCases }: { useCases: any[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');

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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    // Calculate business scores
    const arrScore = arrRaw ? getARRScore(parseFloat(arrRaw)) : null;
    const pipelineScore = pipelineRaw ? getPipelineScore(parseFloat(pipelineRaw)) : null;
    const velocityScore = velocityRaw ? getVelocityScore(parseFloat(velocityRaw)) : null;
    const winRateScore = winRateRaw ? getWinRateScore(parseFloat(winRateRaw)) : null;

    // Calculate product scores
    const matchRateScore = matchRateImpact ? getMatchRateScore(parseFloat(matchRateImpact)) : null;
    const latencyScore = latencyRequirement ? getLatencyScore(latencyRequirement) : null;
    const privacyRiskScore = privacyRiskLevel ? getPrivacyRiskScore(privacyRiskLevel) : null;
    const dataSourceScore = dataSourceDepends ? getDataSourceScore(dataSourceDepends) : null;
    const scaleScore = scaleRequirement ? getScaleScore(scaleRequirement) : null;

    try {
      const response = await fetch('/api/opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCaseId: selectedUseCaseId,
          // Business metrics
          arrRaw: arrRaw ? parseFloat(arrRaw) : null,
          arrScore,
          pipelineRaw: pipelineRaw ? parseFloat(pipelineRaw) : null,
          pipelineScore,
          velocityRaw: velocityRaw ? parseFloat(velocityRaw) : null,
          velocityScore,
          winRateRaw: winRateRaw ? parseFloat(winRateRaw) : null,
          winRateScore,
          strategicFitScore: strategicFitScore ? parseInt(strategicFitScore) : null,
          // Product metrics
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
      });

      if (!response.ok) throw new Error('Failed to save opportunity score');

      toast({
        title: 'Success',
        description: 'Opportunity score saved successfully',
      });

      router.push(`/use-cases/${selectedUseCaseId}`);
    } catch (error) {
      console.error('Error saving opportunity score:', error);
      toast({
        title: 'Error',
        description: 'Failed to save opportunity score',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
              <SelectValue placeholder="Choose a use case to score..." />
            </SelectTrigger>
            <SelectContent>
              {useCases.map((uc) => (
                <SelectItem key={uc.id} value={uc.id}>
                  {uc.name} ({uc.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* BUSINESS GROWTH METRICS */}
      <Card>
        <CardHeader>
          <CardTitle>Business Growth Metrics</CardTitle>
          <CardDescription>
            Revenue impact and sales performance indicators (60% weight)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      </Card>

      {/* PRODUCT PERFORMANCE METRICS */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance Metrics</CardTitle>
          <CardDescription>
            Identity graph capabilities and technical requirements (40% weight)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      </Card>

      {/* Source Notes */}
      <Card>
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

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/use-cases')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Opportunity Score'}
        </Button>
      </div>
    </form>
  );
}
