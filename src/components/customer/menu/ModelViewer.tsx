
import React, { useRef, useEffect, useState } from 'react';
import { useThree } from './three/useThree';
import ModelLoader from './three/ModelLoader';
import Spinner from '@/components/ui/spinner';

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
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  // Set up the Three.js scene
  const { initializeScene, setAutoRotate } = useThree();
  
  // Initialize the scene when component mounts
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanup = initializeScene(containerRef.current);
    setAutoRotate(autoRotate);
    
    return cleanup;
  }, [initializeScene, setAutoRotate, autoRotate]);
  
  // Load the model
  const handleLoadStart = () => {
    setLoading(true);
    setLoadProgress(0);
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
        className="w-full h-full rounded-md"
      />
      
      {/* Model loader that actually loads the 3D model into the scene */}
      <ModelLoader 
        modelUrl={modelUrl}
        onLoadStart={handleLoadStart}
        onLoadProgress={handleLoadProgress}
        onLoadComplete={handleLoadComplete}
        onLoadError={handleLoadError}
        scale={1.5}
        center={true}
      />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-md">
          <Spinner size="lg" />
          <div className="mt-2 text-sm text-muted-foreground">
            Loading model... {Math.round(loadProgress)}%
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-md">
          <div className="text-destructive">Failed to load 3D model</div>
          <div className="text-xs text-muted-foreground mt-1">
            {error.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
