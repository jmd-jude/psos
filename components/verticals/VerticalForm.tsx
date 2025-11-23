// components/verticals/VerticalForm.tsx
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
import { verticalSchema, type VerticalFormData } from '@/lib/validations';

interface VerticalFormProps {
  initialData?: {
    id?: string;
    name: string;
    description?: string;
    keyBuyerPersona?: string;
    primaryPainPoint?: string;
    complianceConsiderations?: string;
    strategicPriority?: string;
  };
  mode?: 'create' | 'edit';
}

const STRATEGIC_PRIORITIES = ['Critical', 'High', 'Medium', 'Low'] as const;

export default function VerticalForm({ initialData, mode = 'create' }: VerticalFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<VerticalFormData>({
    resolver: zodResolver(verticalSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      keyBuyerPersona: initialData?.keyBuyerPersona || '',
      primaryPainPoint: initialData?.primaryPainPoint || '',
      complianceConsiderations: initialData?.complianceConsiderations || '',
      strategicPriority: (initialData?.strategicPriority as 'Critical' | 'High' | 'Medium' | 'Low') || 'Medium',
    },
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: VerticalFormData) => {
    try {
      const url = mode === 'create' ? '/api/verticals' : `/api/verticals/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || 'Failed to save vertical');
      }

      const vertical = await response.json();

      toast({
        title: 'Success',
        description: `Vertical ${mode === 'create' ? 'created' : 'updated'} successfully`,
      });

      router.push(`/verticals/${vertical.id}`);
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
    router.push('/verticals');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Vertical' : 'Edit Vertical'}</CardTitle>
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

            {/* Strategic Priority */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="strategicPriority" className="md:text-right md:pt-2">
                Strategic Priority
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Controller
                  name="strategicPriority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="strategicPriority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STRATEGIC_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.strategicPriority && (
                  <p className="text-sm text-destructive">{errors.strategicPriority.message}</p>
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
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Market Details Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Market Details
            </h3>

            {/* Key Buyer Persona */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="keyBuyerPersona" className="md:text-right md:pt-2">
                Key Buyer Persona
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Input
                  id="keyBuyerPersona"
                  {...register('keyBuyerPersona')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  e.g., VP of Marketing, Chief Data Officer
                </p>
                {errors.keyBuyerPersona && (
                  <p className="text-sm text-destructive">{errors.keyBuyerPersona.message}</p>
                )}
              </div>
            </div>

            {/* Primary Pain Point */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="primaryPainPoint" className="md:text-right md:pt-2">
                Primary Pain Point
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Input
                  id="primaryPainPoint"
                  {...register('primaryPainPoint')}
                  disabled={isSubmitting}
                />
                {errors.primaryPainPoint && (
                  <p className="text-sm text-destructive">{errors.primaryPainPoint.message}</p>
                )}
              </div>
            </div>

            {/* Compliance Considerations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <Label htmlFor="complianceConsiderations" className="md:text-right md:pt-2">
                Compliance Considerations
              </Label>
              <div className="md:col-span-3 space-y-1">
                <Textarea
                  id="complianceConsiderations"
                  rows={3}
                  {...register('complianceConsiderations')}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  e.g., HIPAA, GDPR, CCPA requirements
                </p>
                {errors.complianceConsiderations && (
                  <p className="text-sm text-destructive">{errors.complianceConsiderations.message}</p>
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
                mode === 'create' ? 'Create Vertical' : 'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
