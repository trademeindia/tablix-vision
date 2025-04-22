
import React from 'react';

interface ModelLoadingIndicatorProps {
  progress: number;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ progress }) => {
  return (
    <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-primary font-semibold">Loading 3D Model</div>
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-xs text-slate-500">
          {progress < 100 ? `${Math.round(progress)}%` : 'Preparing model...'}
        </div>
      </div>
    </div>
  );
};

export default ModelLoadingIndicator;
