// components/assessments/OpportunityScoreForm.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getARRScore, getPipelineScore, getVelocityScore, getWinRateScore } from '@/lib/calculations';

interface UseCase {
  id: string;
  name: string;
}

interface Props {
  useCases: UseCase[];
}

interface OpportunityData {
  arrRaw: number | null;
  arrScore: number | null;
  pipelineRaw: number | null;
  pipelineScore: number | null;
  velocityRaw: number | null;
  velocityScore: number | null;
  winRateRaw: number | null;
  winRateScore: number | null;
  strategicFitScore: number | null;
  sourceNotes: string;
}

const initialData: OpportunityData = {
  arrRaw: null,
  arrScore: null,
  pipelineRaw: null,
  pipelineScore: null,
  velocityRaw: null,
  velocityScore: null,
  winRateRaw: null,
  winRateScore: null,
  strategicFitScore: null,
  sourceNotes: '',
};

export default function OpportunityScoreForm({ useCases }: Props) {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');
  const [data, setData] = useState<OpportunityData>(initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRawValueChange = (field: keyof OpportunityData, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    let scoreField: keyof OpportunityData | null = null;
    let calculatedScore: number | null = null;

    // Auto-calculate score based on raw value
    if (field === 'arrRaw' && numValue !== null) {
      scoreField = 'arrScore';
      calculatedScore = getARRScore(numValue);
    } else if (field === 'pipelineRaw' && numValue !== null) {
      scoreField = 'pipelineScore';
      calculatedScore = getPipelineScore(numValue);
    } else if (field === 'velocityRaw' && numValue !== null) {
      scoreField = 'velocityScore';
      calculatedScore = getVelocityScore(numValue);
    } else if (field === 'winRateRaw' && numValue !== null) {
      scoreField = 'winRateScore';
      calculatedScore = getWinRateScore(numValue);
    }

    setData({
      ...data,
      [field]: numValue,
      ...(scoreField && { [scoreField]: calculatedScore }),
    });
  };

  const handleScoreChange = (field: keyof OpportunityData, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setData({ ...data, [field]: numValue });
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

    setLoading(true);
    try {
      const response = await fetch('/api/opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCaseId: selectedUseCaseId,
          ...data,
        }),
      });

      if (!response.ok) throw new Error('Failed to save opportunity score');

      toast({
        title: 'Success',
        description: 'Opportunity score saved successfully!',
      });
      setData(initialData);
      setSelectedUseCaseId('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save opportunity score. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const weightedAverage = () => {
    const scores = [
      (data.arrScore ?? 0) * 0.3,
      (data.pipelineScore ?? 0) * 0.3,
      (data.velocityScore ?? 0) * 0.15,
      (data.winRateScore ?? 0) * 0.15,
      (data.strategicFitScore ?? 0) * 0.1,
    ];
    return scores.reduce((a, b) => a + b, 0).toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="usecase-select">Select Use Case</Label>
            <Select value={selectedUseCaseId} onValueChange={setSelectedUseCaseId}>
              <SelectTrigger id="usecase-select">
                <SelectValue placeholder="Select a use case" />
              </SelectTrigger>
              <SelectContent>
                {useCases.map((uc) => (
                  <SelectItem key={uc.id} value={uc.id}>
                    {uc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedUseCaseId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ARR */}
            <Card>
              <CardHeader>
                <CardTitle>Annual Recurring Revenue (ARR)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-7 gap-4">
                <div className="col-span-4 space-y-2">
                  <Label htmlFor="arr-raw">Raw Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="arr-raw"
                      type="number"
                      value={data.arrRaw ?? ''}
                      onChange={(e) => handleRawValueChange('arrRaw', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="arr-score">Score (1-5)</Label>
                  <Input
                    id="arr-score"
                    type="number"
                    value={data.arrScore ?? ''}
                    onChange={(e) => handleScoreChange('arrScore', e.target.value)}
                    min={1}
                    max={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-7 gap-4">
                <div className="col-span-4 space-y-2">
                  <Label htmlFor="pipeline-raw">Raw Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="pipeline-raw"
                      type="number"
                      value={data.pipelineRaw ?? ''}
                      onChange={(e) => handleRawValueChange('pipelineRaw', e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="pipeline-score">Score (1-5)</Label>
                  <Input
                    id="pipeline-score"
                    type="number"
                    value={data.pipelineScore ?? ''}
                    onChange={(e) => handleScoreChange('pipelineScore', e.target.value)}
                    min={1}
                    max={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Velocity */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-7 gap-4">
                <div className="col-span-4 space-y-2">
                  <Label htmlFor="velocity-raw">Days to Close</Label>
                  <div className="relative">
                    <Input
                      id="velocity-raw"
                      type="number"
                      value={data.velocityRaw ?? ''}
                      onChange={(e) => handleRawValueChange('velocityRaw', e.target.value)}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground">days</span>
                  </div>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="velocity-score">Score (1-5)</Label>
                  <Input
                    id="velocity-score"
                    type="number"
                    value={data.velocityScore ?? ''}
                    onChange={(e) => handleScoreChange('velocityScore', e.target.value)}
                    min={1}
                    max={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Win Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Win Rate</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-7 gap-4">
                <div className="col-span-4 space-y-2">
                  <Label htmlFor="winrate-raw">Win Rate (0-1)</Label>
                  <div className="relative">
                    <Input
                      id="winrate-raw"
                      type="number"
                      value={data.winRateRaw ?? ''}
                      onChange={(e) => handleRawValueChange('winRateRaw', e.target.value)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="winrate-score">Score (1-5)</Label>
                  <Input
                    id="winrate-score"
                    type="number"
                    value={data.winRateScore ?? ''}
                    onChange={(e) => handleScoreChange('winRateScore', e.target.value)}
                    min={1}
                    max={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Strategic Fit */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Fit</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Alignment with company strategy and roadmap
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="strategic-score">Score (1-5)</Label>
                  <Input
                    id="strategic-score"
                    type="number"
                    value={data.strategicFitScore ?? ''}
                    onChange={(e) => handleScoreChange('strategicFitScore', e.target.value)}
                    min={1}
                    max={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weighted Average */}
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle>Weighted Opportunity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {weightedAverage()}
                </div>
                <p className="text-xs text-muted-foreground">
                  ARR (30%), Pipeline (30%), Velocity (15%), Win Rate (15%), Strategic Fit (10%)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Source Notes */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="source-notes">Source Notes</Label>
            <Textarea
              id="source-notes"
              rows={3}
              value={data.sourceNotes}
              onChange={(e) => setData({ ...data, sourceNotes: e.target.value })}
              placeholder="Document data sources, assumptions, and any additional context..."
            />
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Opportunity Score'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setData(initialData);
                setSelectedUseCaseId('');
              }}
            >
              Reset
            </Button>
          </div>
        </>
      )}

      {/* Reference Guide */}
      <Card className="mt-6 bg-muted/50">
        <CardHeader>
          <CardTitle>Scoring Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold mb-1">ARR</p>
            <p className="text-sm text-muted-foreground">1: &lt;$100K, 2: $100-250K, 3: $250-500K, 4: $500K-1M, 5: &gt;$1M</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Pipeline</p>
            <p className="text-sm text-muted-foreground">1: &lt;$200K, 2: $200-500K, 3: $500K-1M, 4: $1-2M, 5: &gt;$2M</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Velocity (Days)</p>
            <p className="text-sm text-muted-foreground">1: &gt;180, 2: 90-180, 3: 60-90, 4: 30-60, 5: &lt;30</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Win Rate</p>
            <p className="text-sm text-muted-foreground">1: &lt;15%, 2: 15-25%, 3: 25-40%, 4: 40-60%, 5: &gt;60%</p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
