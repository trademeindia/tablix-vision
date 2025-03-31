
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoadingErrorSectionProps {
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

const LoadingErrorSection: React.FC<LoadingErrorSectionProps> = ({ 
  isLoading, 
  error, 
  onRetry 
}) => {
  // Helper function to provide more specific guidance based on error message
  const getErrorGuidance = (error: Error): { title: string, description: string } => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        title: "Network Connection Error",
        description: "There seems to be an issue with your internet connection. Please check your connection and try again."
      };
    } else if (message.includes('timeout') || message.includes('timed out')) {
      return {
        title: "Request Timeout",
        description: "The server took too long to respond. This might be due to slow internet or high server load."
      };
    } else if (message.includes('authentication') || message.includes('unauthorized')) {
      return {
        title: "Authentication Error",
        description: "Your session may have expired. Please try refreshing the page or logging in again."
      };
    } else if (message.includes('not found') || message.includes('404')) {
      return {
        title: "Resource Not Found",
        description: "The requested menu data could not be found. It may have been removed or relocated."
      };
    } else if (message.includes('permission') || message.includes('access')) {
      return {
        title: "Permission Denied",
        description: "You don't have permission to access this menu. Please contact the restaurant administrator."
      };
    } else {
      return {
        title: "Error Loading Data",
        description: "An unexpected error occurred while loading the menu data."
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    const { title, description } = getErrorGuidance(error);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {description}
            <div className="text-xs mt-2 text-gray-700">
              Technical details: {error.message}
            </div>
          </AlertDescription>
        </Alert>
        
        <Button onClick={onRetry || (() => window.location.reload())} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return null;
};

export default LoadingErrorSection;
