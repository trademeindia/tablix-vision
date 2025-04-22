
import React from 'react';

interface ModelLoadingIndicatorProps {
  progress: number;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ progress }) => {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 50) return 'bg-blue-500';
    if (progress < 80) return 'bg-indigo-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-primary font-semibold">Loading 3D Model</div>
        <div className="w-64 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-sm text-slate-600">
          {progress < 100 ? `${Math.round(progress)}%` : 'Preparing model...'}
        </div>
        
        {progress === 100 && (
          <div className="mt-2 text-xs text-indigo-600 animate-pulse">
            Finalizing 3D rendering...
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoadingIndicator;
