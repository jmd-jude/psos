'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import InsightModal from './InsightModal';
import { useToast } from '@/hooks/use-toast';

interface InsightButtonProps {
  useCaseId: string;
  analysisType: 'competitive' | 'capability-gaps' | 'vertical-fit';
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const ANALYSIS_CONFIG = {
  competitive: {
    title: 'Competitive Position Analysis',
    endpoint: '/api/insights/competitive-analysis',
  },
  'capability-gaps': {
    title: 'Capability Gap Analysis',
    endpoint: '/api/insights/capability-gaps',
  },
  'vertical-fit': {
    title: 'Vertical Fit Recommendations',
    endpoint: '/api/insights/vertical-fit',
  },
};

export default function InsightButton({
  useCaseId,
  analysisType,
  label,
  variant = 'outline',
}: InsightButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const config = ANALYSIS_CONFIG[analysisType];

  const handleAnalyze = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCaseId }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: 'Unable to generate insight. Please try again.',
        variant: 'destructive',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant={variant} onClick={handleAnalyze}>
        <Sparkles className="h-4 w-4 mr-2" />
        {label}
      </Button>

      <InsightModal
        title={config.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        analysisMarkdown={analysis}
        isLoading={isLoading}
      />
    </>
  );
}
