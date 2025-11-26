// components/assessments/MaturityAssessmentForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { CompanyCapability } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface UseCase {
  id: string;
  name: string;
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

export default function MaturityAssessmentForm({ useCases, capabilities }: Props) {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleUseCaseChange = (useCaseId: string) => {
    setSelectedUseCaseId(useCaseId);
  };

  // Fetch existing assessments when use case is selected
  useEffect(() => {
    const fetchExistingAssessments = async () => {
      if (!selectedUseCaseId) {
        // Reset to default inherit state when no use case is selected
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

      try {
        const response = await fetch(`/api/maturity/${selectedUseCaseId}`);

        if (response.ok) {
          const assessments = await response.json();

          // Create a map of existing assessments by capabilityId
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

          // Populate form with existing data or defaults for missing capabilities
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
        } else if (response.status === 404) {
          // No existing assessments, reset to defaults
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
        }
      } catch (error) {
        console.error('Error fetching existing assessments:', error);
        // Don't show error toast - just use defaults
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
      }
    };

    fetchExistingAssessments();
  }, [selectedUseCaseId, capabilities]);

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

    // Validate overrides have rationale
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

    const assessments = states.map((state) => ({
      capabilityId: state.capabilityId,
      useCompanyScore: state.useCompanyScore,
      overrideScore: state.useCompanyScore ? null : state.overrideScore,
      overrideRationale: state.useCompanyScore ? null : state.overrideRationale,
    }));

    setLoading(true);
    try {
      const response = await fetch('/api/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useCaseId: selectedUseCaseId,
          assessments,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save assessment');
      }

      toast({
        title: 'Success',
        description: 'Maturity assessment saved successfully!',
      });

      // Reset form
      setSelectedUseCaseId('');
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save assessment',
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Capability Readiness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Use Case Selection */}
          <div>
            <Label htmlFor="useCase">Select Use Case</Label>
            <Select value={selectedUseCaseId} onValueChange={handleUseCaseChange}>
              <SelectTrigger id="useCase" className="w-full">
                <SelectValue placeholder="Choose a use case to assess..." />
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

          {selectedUseCaseId && (
            <>
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
                    <div
                      key={capability.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
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
                            <span className="text-muted-foreground">
                              (inherited from company)
                            </span>
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
                            <Label htmlFor={`score-${capability.id}`}>
                              Override Score (1-5)
                            </Label>
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
                                handleOverrideRationaleChange(
                                  capability.id,
                                  e.target.value
                                )
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

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Maturity Assessment'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
