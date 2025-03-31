
import React from 'react';
import Spinner from '@/components/ui/spinner';

interface LoadingIndicatorProps {
  progress?: number;
  error?: string | null;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress, error }) => {
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 z-10">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs text-center">
          <p className="text-red-500 font-medium mb-2">Error</p>
          <p className="text-slate-700">{error}</p>
        </div>
      </div>
    );
  }
  
  if (progress !== undefined && progress < 100) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 z-10">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-slate-700 mb-2 font-medium">Loading 3D model</div>
          <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1 text-center">{Math.round(progress)}%</div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default LoadingIndicator;
