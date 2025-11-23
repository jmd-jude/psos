// components/use-cases/QuadrantBadge.tsx
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuadrantBadgeProps {
  quadrant: 'INVEST' | 'HARVEST' | 'MAINTAIN' | 'DEPRIORITIZE';
  size?: 'small' | 'medium';
}

const getQuadrantVariant = (quadrant: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (quadrant) {
    case 'INVEST':
      return 'default';
    case 'HARVEST':
      return 'secondary';
    case 'MAINTAIN':
      return 'outline';
    case 'DEPRIORITIZE':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function QuadrantBadge({ quadrant, size = 'medium' }: QuadrantBadgeProps) {
  return (
    <Badge
      variant={getQuadrantVariant(quadrant)}
      className={cn(size === 'small' && 'text-xs')}
    >
      {quadrant}
    </Badge>
  );
}
