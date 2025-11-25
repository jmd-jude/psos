// lib/validations.ts
import { z } from 'zod';

// Use Case validation schema
export const useCaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  verticalIds: z.array(z.string()).optional(),
  deliveryMechanismIds: z.array(z.string()).optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Under Review', 'Deprecated']).default('Active'),
  owner: z.string().max(100, 'Owner must be less than 100 characters').optional().or(z.literal('')),
  buyerOutcome: z.string().max(500, 'Buyer outcome must be less than 500 characters').optional().or(z.literal('')),
  dataInputs: z.string().max(1000, 'Data inputs must be less than 1000 characters').optional().or(z.literal('')),
  dataOutputs: z.string().max(1000, 'Data outputs must be less than 1000 characters').optional().or(z.literal('')),
  limitations: z.string().max(1000, 'Limitations must be less than 1000 characters').optional().or(z.literal('')),
  competitiveNotes: z.string().max(1000, 'Competitive notes must be less than 1000 characters').optional().or(z.literal('')),
});

export type UseCaseFormData = z.infer<typeof useCaseSchema>;

// Vertical validation schema
export const verticalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  strategicPriority: z.enum(['Critical', 'High', 'Medium', 'Low']).default('Medium'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  keyBuyerPersona: z.string().max(200, 'Key buyer persona must be less than 200 characters').optional().or(z.literal('')),
  primaryPainPoint: z.string().max(500, 'Primary pain point must be less than 500 characters').optional().or(z.literal('')),
  complianceConsiderations: z.string().max(1000, 'Compliance considerations must be less than 1000 characters').optional().or(z.literal('')),
});

export type VerticalFormData = z.infer<typeof verticalSchema>;
