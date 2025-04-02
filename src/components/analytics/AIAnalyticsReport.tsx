
import React, { useState } from 'react';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

interface AIAnalyticsReportProps {
  restaurantId: string;
  onGenerateReport: () => Promise<string>;
  isLoading?: boolean;
}

const AIAnalyticsReport: React.FC<AIAnalyticsReportProps> = ({ 
  restaurantId, 
  onGenerateReport,
  isLoading: initialLoading = false
}) => {
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
          <span>AI Business Insights</span>
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
            <p className="text-sm text-slate-400">Press the button below to generate a report.</p>
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
              Generating Report...
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
