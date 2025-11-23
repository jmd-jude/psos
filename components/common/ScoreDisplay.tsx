// components/common/ScoreDisplay.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  showBar?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export default function ScoreDisplay({
  score,
  maxScore = 5,
  showBar = true,
  size = 'medium',
  label,
}: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100;

  const getScoreColor = (scoreValue: number, max: number) => {
    const normalized = scoreValue / max;
    if (normalized >= 0.8) return 'text-green-600';
    if (normalized >= 0.6) return 'text-blue-600';
    if (normalized >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBarColor = (scoreValue: number, max: number) => {
    const normalized = scoreValue / max;
    if (normalized >= 0.8) return 'bg-green-600';
    if (normalized >= 0.6) return 'bg-blue-600';
    if (normalized >= 0.4) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const fontSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base';
  const barHeight = size === 'small' ? 'h-1' : size === 'large' ? 'h-2' : 'h-1.5';
  const minWidth = size === 'small' ? 'min-w-[32px]' : 'min-w-[40px]';

  if (score === 0) {
    return (
      <span className="text-sm text-muted-foreground">
        N/A
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', showBar ? 'min-w-[120px]' : '')}>
      <div className={cn('font-semibold', fontSize, minWidth, getScoreColor(score, maxScore))}>
        {score.toFixed(1)}
        <span className="text-muted-foreground font-normal text-xs ml-1">
          / {maxScore}
        </span>
      </div>

      {showBar && (
        <div className="flex-1 min-w-[60px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(barHeight, 'rounded-full transition-all', getBarColor(score, maxScore))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {label && (
        <span className="text-xs text-muted-foreground ml-2">
          {label}
        </span>
      )}
    </div>
  );
}
