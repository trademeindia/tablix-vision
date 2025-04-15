
import React from 'react';
import Spinner from '@/components/ui/spinner';

interface ModelLoadingIndicatorProps {
  progress: number;
  isInitializing?: boolean;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ 
  progress, 
  isInitializing = false 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg p-4">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <div>
          <p className="text-primary font-medium">
            {isInitializing ? 'Initializing 3D viewer...' : 'Loading 3D model...'}
          </p>
          {!isInitializing && progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-150" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelLoadingIndicator;
