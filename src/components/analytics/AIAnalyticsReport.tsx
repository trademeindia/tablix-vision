
import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

interface AIAnalyticsReportProps {
  restaurantId: string;
  onGenerateReport: () => Promise<string>;
  isLoading?: boolean;
}

const AIAnalyticsReport = ({ 
  restaurantId, 
  onGenerateReport,
  isLoading: initialLoading = false
}: AIAnalyticsReportProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const generatedReport = await onGenerateReport();
      setReport(generatedReport);
    } catch (error) {
      console.error('Error generating AI report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate AI report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <CardTitle className="flex items-center justify-between text-xl mb-4">
          <div className="flex items-center gap-2">
            <span>AI Business Insights</span>
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1 px-2 py-0.5">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs">Powered by AI</span>
            </Badge>
          </div>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </CardTitle>
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : report ? (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: report }} />
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p className="mb-2">Get AI-generated insights about your restaurant's performance.</p>
            <p className="text-sm text-slate-400">Press the button below to generate a detailed analysis with improvement recommendations.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateReport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Business Data...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {report ? 'Refresh Analysis' : 'Generate AI Analysis'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAnalyticsReport;
