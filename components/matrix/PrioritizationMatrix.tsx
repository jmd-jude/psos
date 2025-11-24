/* Prioritization Matrix Visualization */
// components/matrix/PrioritizationMatrix.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PrioritizationPlotPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define the component's props
interface PrioritizationMatrixProps {
  data: PrioritizationPlotPoint[];
}

// Helper function to assign a color based on the quadrant
const getQuadrantVariant = (quadrant: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (quadrant) {
    case 'INVEST': return 'default';
    case 'HARVEST': return 'secondary';
    case 'MAINTAIN': return 'outline';
    case 'DEPRIORITIZE': return 'destructive';
    default: return 'secondary';
  }
};

export default function PrioritizationMatrix({ data }: PrioritizationMatrixProps) {
  const router = useRouter();

  const handleBubbleClick = (id: string) => {
    router.push(`/use-cases/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/use-cases/${id}`);
    }
  };

  return (
    <Card className="h-[80vh]">
      <CardHeader>
        <CardTitle>Use Case Prioritization Matrix</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] relative">
        {/* --- Matrix Grid Layout (Conceptual) --- */}
        <div className="h-full border border-border relative">
          {/* Y-Axis Label */}
          <div
            className="absolute top-1/2 left-0 text-sm font-medium"
            style={{
              transform: 'rotate(-90deg) translateY(-50%)',
              transformOrigin: 'left center',
            }}
          >
            Maturity (Avg. Pillar Score)
          </div>

          {/* --- Plotting Area --- */}
          <div className="w-full h-full relative">
            {/* Quadrant Dividers */}
            <div className="absolute inset-0">
              {/* Horizontal Midline */}
              <div className="h-1/2 border-b border-dashed border-border" />
              {/* Vertical Midline */}
              <div className="absolute top-0 left-0 w-1/2 h-full border-r border-dashed border-border" />
            </div>

            {/* Render Plot Points (Bubbles) */}
            {data.map((point) => (
              <Badge
                key={point.id}
                variant={getQuadrantVariant(point.quadrant)}
                className="absolute cursor-pointer text-xs hover:scale-110 active:scale-95 transition-transform"
                style={{
                  // Map the 1-5 score range to the 0-100% position
                  left: `${((point.opportunityScore.averageScore - 1) / 4) * 100}%`,
                  bottom: `${((point.maturityScore.averageScore - 1) / 4) * 100}%`,
                  transform: 'translate(-50%, 50%)',
                }}
                role="button"
                tabIndex={0}
                onClick={() => handleBubbleClick(point.id)}
                onKeyDown={(e) => handleKeyDown(e, point.id)}
                title={`${point.name} - Maturity: ${point.maturityScore.averageScore.toFixed(2)}, Opportunity: ${point.opportunityScore.averageScore.toFixed(2)}, Quadrant: ${point.quadrant}`}
              >
                {point.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="text-center mt-2 text-sm font-medium">
          Opportunity (Avg. Metric Score)
        </div>

        <div className="mt-6 flex gap-2 flex-wrap items-center">
          <span className="text-sm font-medium">Legend:</span>
          <Badge variant="default">INVEST (High Opp, Low Maturity)</Badge>
          <Badge variant="secondary">HARVEST (High Opp, High Maturity)</Badge>
          <Badge variant="outline">MAINTAIN (Low Opp, High Maturity)</Badge>
          <Badge variant="destructive">DEPRIORITIZE (Low Opp, Low Maturity)</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
