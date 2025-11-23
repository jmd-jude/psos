// components/common/StrategicPriorityBadge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';

type StrategicPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface VerticalWithPriority {
  fit: string;
  vertical: {
    name: string;
    strategicPriority: string;
  };
}

interface StrategicPriorityBadgeProps {
  verticals: VerticalWithPriority[];
}

export function getHighestPriorityVertical(verticals: VerticalWithPriority[]) {
  const priorities: Record<string, number> = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1
  };

  // Only consider verticals with Primary fit
  const primaryVerticals = verticals.filter(v => v.fit === 'Primary');

  if (primaryVerticals.length === 0) {
    return null;
  }

  // Find the vertical with the highest strategic priority
  const highest = primaryVerticals.reduce((max, v) => {
    const vPriority = priorities[v.vertical.strategicPriority] || 0;
    const maxPriority = priorities[max.vertical.strategicPriority] || 0;
    return vPriority > maxPriority ? v : max;
  });

  return highest;
}

export function getBadgeVariant(priority: string): 'destructive' | 'default' | 'outline' | 'secondary' {
  switch (priority) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'default';
    case 'Medium':
      return 'outline';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function StrategicPriorityBadge({ verticals }: StrategicPriorityBadgeProps) {
  const highestPriorityVertical = getHighestPriorityVertical(verticals);

  if (!highestPriorityVertical) {
    return <span className="text-sm text-muted-foreground">None</span>;
  }

  return (
    <Badge variant={getBadgeVariant(highestPriorityVertical.vertical.strategicPriority)}>
      {highestPriorityVertical.vertical.name} ({highestPriorityVertical.vertical.strategicPriority})
    </Badge>
  );
}
