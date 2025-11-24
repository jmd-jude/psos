'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface InsightModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  analysisMarkdown: string | null;
  isLoading: boolean;
}

export default function InsightModal({
  title,
  isOpen,
  onClose,
  analysisMarkdown,
  isLoading,
}: InsightModalProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (analysisMarkdown) {
      await navigator.clipboard.writeText(analysisMarkdown);
      toast({
        title: 'Copied to clipboard',
        description: 'Analysis has been copied to your clipboard.',
      });
    }
  };

  const handleDownload = () => {
    if (analysisMarkdown) {
      const blob = new Blob([analysisMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Downloaded',
        description: 'Analysis has been saved as markdown file.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Analyzing...</span>
          </div>
        ) : analysisMarkdown ? (
          <>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{analysisMarkdown}</ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No analysis available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
