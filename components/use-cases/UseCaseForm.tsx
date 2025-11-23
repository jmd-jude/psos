// components/use-cases/UseCaseForm.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCaseSchema, type UseCaseFormData } from '@/lib/validations';

interface UseCaseFormProps {
  initialData?: {
    id?: string;
    name: string;
    category: string;
    description?: string;
    buyerOutcome?: string;
    dataInputs?: string;
    dataOutputs?: string;
    deliveryMechanism?: string;
    limitations?: string;
    competitiveNotes?: string;
    status?: string;
    owner?: string;
  };
  mode?: 'create' | 'edit';
}

const CATEGORIES = [
  'Identity Management',
  'Data Enrichment',
  'Analytics',
  'Activation',
  'Measurement',
];

const STATUSES = ['Active', 'Under Review', 'Deprecated'] as const;

export default function UseCaseForm({ initialData, mode = 'create' }: UseCaseFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<UseCaseFormData>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      buyerOutcome: initialData?.buyerOutcome || '',
      dataInputs: initialData?.dataInputs || '',
      dataOutputs: initialData?.dataOutputs || '',
      deliveryMechanism: initialData?.deliveryMechanism || '',
      limitations: initialData?.limitations || '',
      competitiveNotes: initialData?.competitiveNotes || '',
      status: (initialData?.status as 'Active' | 'Under Review' | 'Deprecated') || 'Active',
      owner: initialData?.owner || '',
    },
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: UseCaseFormData) => {
    try {
      const url = mode === 'create' ? '/api/use-cases' : `/api/use-cases/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'Failed to save use case');
      }

      const useCase = await response.json();

      toast({
        title: 'Success',
        description: `Use case ${mode === 'create' ? 'created' : 'updated'} successfully`,
      });

      router.push(`/use-cases/${useCase.id}`);
      router.refresh();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push('/use-cases');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Use Case' : 'Edit Use Case'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="name" className="md:text-right md:pt-2">
                Name <span className="text-destructive">*</span>
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Input
                  id="name"
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="category" className="md:text-right md:pt-2">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="status" className="md:text-right md:pt-2">
                Status
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Owner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="owner" className="md:text-right md:pt-2">
                Owner
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Input
                  id="owner"
                  {...register('owner')}
                  disabled={isSubmitting}
                />
                {errors.owner && (
                  <p className="text-sm text-destructive">{errors.owner.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="description" className="md:text-right md:pt-2">
                Description
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  disabled={isSubmitting}
                  placeholder="Brief product marketing description of what this use case is (1-2 sentences)"
                />
                <p className="text-xs text-muted-foreground">
                  Concise explanation of the use case functionality for internal reference and product marketing
                </p>
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Buyer Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="buyerOutcome" className="md:text-right md:pt-2">
                Buyer Outcome
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="buyerOutcome"
                  rows={2}
                  {...register('buyerOutcome')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  What business outcome does this deliver for the buyer?
                </p>
                {errors.buyerOutcome && (
                  <p className="text-sm text-destructive">{errors.buyerOutcome.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Technical Details Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Technical Details
            </h3>

            {/* Data Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="dataInputs" className="md:text-right md:pt-2">
                Data Inputs
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="dataInputs"
                  rows={3}
                  {...register('dataInputs')}
                  disabled={isSubmitting}
                />
                {errors.dataInputs && (
                  <p className="text-sm text-destructive">{errors.dataInputs.message}</p>
                )}
              </div>
            </div>

            {/* Data Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="dataOutputs" className="md:text-right md:pt-2">
                Data Outputs
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="dataOutputs"
                  rows={3}
                  {...register('dataOutputs')}
                  disabled={isSubmitting}
                />
                {errors.dataOutputs && (
                  <p className="text-sm text-destructive">{errors.dataOutputs.message}</p>
                )}
              </div>
            </div>

            {/* Delivery Mechanism */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="deliveryMechanism" className="md:text-right md:pt-2">
                Delivery Mechanism
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Input
                  id="deliveryMechanism"
                  {...register('deliveryMechanism')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  e.g., Onsight, Realink, Identity Authority, Audiences
                </p>
                {errors.deliveryMechanism && (
                  <p className="text-sm text-destructive">{errors.deliveryMechanism.message}</p>
                )}
              </div>
            </div>

            {/* Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="limitations" className="md:text-right md:pt-2">
                Limitations
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="limitations"
                  rows={3}
                  {...register('limitations')}
                  disabled={isSubmitting}
                />
                {errors.limitations && (
                  <p className="text-sm text-destructive">{errors.limitations.message}</p>
                )}
              </div>
            </div>

            {/* Competitive Notes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="competitiveNotes" className="md:text-right md:pt-2">
                Competitive Notes
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="competitiveNotes"
                  rows={3}
                  {...register('competitiveNotes')}
                  disabled={isSubmitting}
                />
                {errors.competitiveNotes && (
                  <p className="text-sm text-destructive">{errors.competitiveNotes.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                mode === 'create' ? 'Create Use Case' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
