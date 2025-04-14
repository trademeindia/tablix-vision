
import React, { useRef, useEffect, useState } from 'react';
import { useThree } from './three/useThree';
import ModelLoader from './three/ModelLoader';
import ModelLoadingIndicator from './three/ModelLoadingIndicator';

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  className?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  autoRotate = true,
  className = 'w-full h-full'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const { initializeScene, setAutoRotate } = useThree();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanup = initializeScene(containerRef.current);
    setAutoRotate(autoRotate);
    setIsInitializing(false);
    
    return cleanup;
  }, [initializeScene, setAutoRotate, autoRotate]);
  
  const handleLoadStart = () => {
    setLoading(true);
    setLoadProgress(0);
    setError(null);
  };
  
  const handleLoadProgress = (progress: number) => {
    setLoadProgress(progress);
  };
  
  const handleLoadComplete = () => {
    setLoading(false);
  };
  
  const handleLoadError = (err: Error) => {
    console.error('Error loading 3D model:', err);
    setError(err);
    setLoading(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* 3D model container */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg bg-slate-50"
      />
      
      {/* Model loader */}
      <ModelLoader 
        modelUrl={modelUrl}
        onLoadStart={handleLoadStart}
        onLoadProgress={handleLoadProgress}
        onLoadComplete={handleLoadComplete}
        onLoadError={handleLoadError}
        scale={1.5}
        center={true}
      />
      
      {/* Loading states */}
      {(isInitializing || loading) && !error && (
        <ModelLoadingIndicator 
          progress={loadProgress} 
          isInitializing={isInitializing} 
        />
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg p-4">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load 3D model</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
