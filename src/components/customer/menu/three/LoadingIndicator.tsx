
import React from 'react';
import Spinner from '@/components/ui/spinner';

interface LoadingIndicatorProps {
  progress: number;
  error: string | null;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress, error }) => {
  // Only show when either loading or error
  if (progress === 0 && !error) return null;
  if (progress === 100 && !error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-white/80 rounded-md p-3 shadow-md text-center max-w-[80%]">
        {error ? (
          <div className="text-red-500 text-sm">
            <p className="font-medium">Error loading model</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Spinner size="md" />
            <p className="mt-2 text-sm font-medium text-gray-700">
              Loading 3D model... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
