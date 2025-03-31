
import React from 'react';

interface LoadingIndicatorProps {
  progress?: number;
  error?: string | null;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress, error }) => {
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 bg-opacity-80">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (progress !== undefined && progress < 100) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 bg-opacity-50">
        <div className="text-slate-600 mb-2">Loading 3D model...</div>
        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{Math.round(progress)}%</div>
      </div>
    );
  }
  
  return null;
};

export default LoadingIndicator;
