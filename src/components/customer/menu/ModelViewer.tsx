
import React, { useState, useEffect } from 'react';
import ThreeScene from './three/ThreeScene';
import ModelLoader from './three/ModelLoader';
import LoadingIndicator from './three/LoadingIndicator';
import { ThreeProvider, useThree } from './three/useThree';
import Spinner from '@/components/ui/spinner';

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  
  const handleSceneReady = (scene, camera, renderer, controls) => {
    console.log("Scene ready in ModelViewer:", scene ? "Yes" : "No");
    if (scene) {
      setSceneReady(true);
    }
  };
  
  const handleLoadStart = () => {
    console.log("Model loading started");
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
  };
  
  const handleLoadProgress = (progress: number) => {
    setLoadingProgress(progress);
  };
  
  const handleLoadComplete = (model) => {
    console.log("Model loaded successfully:", model ? "Yes" : "No");
    setIsLoading(false);
  };
  
  const handleLoadError = (err: Error) => {
    console.error("Error loading model:", err.message);
    setError(err.message);
    setIsLoading(false);
  };
  
  if (!modelUrl) {
    return <div className="p-4 text-center">No model URL provided</div>;
  }
  
  return (
    <ThreeProvider>
      <div className="relative w-full h-full">
        <ThreeScene 
          onSceneReady={handleSceneReady}
          autoRotate={!isLoading && !error}
          backgroundColor="#f8f9fa"
        >
          {sceneReady && (
            <ModelLoader
              modelUrl={modelUrl}
              onLoadStart={handleLoadStart}
              onLoadProgress={handleLoadProgress}
              onLoadComplete={handleLoadComplete}
              onLoadError={handleLoadError}
            />
          )}
        </ThreeScene>
        
        {!sceneReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <Spinner size="lg" />
          </div>
        )}
        
        <LoadingIndicator 
          progress={loadingProgress} 
          error={error}
        />
      </div>
    </ThreeProvider>
  );
};

export default ModelViewer;
