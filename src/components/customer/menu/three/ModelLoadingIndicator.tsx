
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ModelLoadingIndicatorProps {
  progress: number;
  isInitializing?: boolean;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ 
  progress,
  isInitializing = false
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg">
      <div className="text-center space-y-4 p-4">
        {isInitializing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Initializing 3D viewer...</p>
          </>
        ) : (
          <>
            <Progress value={progress} className="w-48" />
            <p className="text-sm text-muted-foreground">
              Loading 3D model... {Math.round(progress)}%
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ModelLoadingIndicator;
