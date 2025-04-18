
import React from 'react';

interface ModelLoadingIndicatorProps {
  progress: number;
}

const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ progress }) => {
  // Calculate width based on progress (0-100%)
  const progressWidth = `${progress}%`;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10">
      <div className="text-white font-medium mb-2">Loading 3D Model</div>
      <div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: progressWidth }}
        />
      </div>
      <div className="text-white text-sm mt-2">{Math.round(progress)}%</div>
    </div>
  );
};

export default ModelLoadingIndicator;
