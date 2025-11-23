// components/assessments/MaturityAssessmentForm.tsx
'use client';

import React, { useState } from 'react';
import type { CapabilityPillar } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface UseCase {
  id: string;
  name: string;
}

interface Props {
  useCases: UseCase[];
  pillars: CapabilityPillar[];
}

interface AssessmentScore {
  pillarId: string;
  score: number;
  rationale: string;
}

const maturityLevels = [
  { value: 0, label: '0 - Gap', description: 'No capability' },
  { value: 1, label: '1 - Emerging', description: 'Heavy customization needed' },
  { value: 2, label: '2 - Functional', description: 'Core value, rough edges' },
  { value: 3, label: '3 - Competitive', description: 'Meets market expectations' },
  { value: 4, label: '4 - Best-in-Class', description: 'Market leadership' },
];

export default function MaturityAssessmentForm({ useCases, pillars }: Props) {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');
  const [scores, setScores] = useState<Map<string, AssessmentScore>>(new Map());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScoreChange = (pillarId: string, score: number) => {
    const newScores = new Map(scores);
    const existing = newScores.get(pillarId) || { pillarId, score: 0, rationale: '' };
    newScores.set(pillarId, { ...existing, score });
    setScores(newScores);
  };

  const handleRationaleChange = (pillarId: string, rationale: string) => {
    const newScores = new Map(scores);
    const existing = newScores.get(pillarId) || { pillarId, score: 0, rationale: '' };
    newScores.set(pillarId, { ...existing, rationale });
    setScores(newScores);
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

    const assessments = Array.from(scores.values()).map(s => ({
      useCaseId: selectedUseCaseId,
      pillarId: s.pillarId,
      score: s.score,
      rationale: s.rationale,
    }));

    setLoading(true);
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessments }),
      });

      if (!response.ok) throw new Error('Failed to save assessments');

      toast({
        title: 'Success',
        description: 'Maturity assessment saved successfully!',
      });
      setScores(new Map());
      setSelectedUseCaseId('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save assessment. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-lg font-medium mb-6">
            Assess Capability Maturity
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {pillars.map((pillar) => {
              const assessment = scores.get(pillar.id);
              return (
                <Card key={pillar.id}>
                  <CardHeader>
                    <CardTitle>{pillar.name}</CardTitle>
                    {pillar.whatItMeasures && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {pillar.whatItMeasures}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Score</Label>
                      <RadioGroup
                        value={assessment?.score?.toString() ?? ''}
                        onValueChange={(value) => handleScoreChange(pillar.id, parseInt(value))}
                        className="flex flex-wrap gap-4"
                      >
                        {maturityLevels.map((level) => (
                          <div key={level.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={level.value.toString()} id={`${pillar.id}-${level.value}`} />
                            <Label htmlFor={`${pillar.id}-${level.value}`} className="font-normal cursor-pointer">
                              {level.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor={`rationale-${pillar.id}`}>Rationale</Label>
                      <Textarea
                        id={`rationale-${pillar.id}`}
                        rows={2}
                        value={assessment?.rationale ?? ''}
                        onChange={(e) => handleRationaleChange(pillar.id, e.target.value)}
                        placeholder="Explain the reasoning for this score..."
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={loading || scores.size === 0}
            >
              {loading ? 'Saving...' : 'Save Assessment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setScores(new Map());
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
          <CardTitle>Maturity Scale Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {maturityLevels.map((level) => (
            <p key={level.value} className="text-sm">
              <strong>{level.label}:</strong> {level.description}
            </p>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}
