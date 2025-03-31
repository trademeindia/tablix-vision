
import React, { useState } from 'react';
import ThreeScene from './three/ThreeScene';
import ModelLoader from './three/ModelLoader';
import LoadingIndicator from './three/LoadingIndicator';
import { ThreeProvider } from './three/useThree';

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleSceneReady = (scene, camera, renderer, controls) => {
    // The scene is now ready and ModelLoader will handle the rest
  };
  
  const handleLoadStart = () => {
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
  };
  
  const handleLoadProgress = (progress: number) => {
    setLoadingProgress(progress);
  };
  
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  const handleLoadError = (err: Error) => {
    setError(err.message);
    setIsLoading(false);
  };
  
  return (
    <ThreeProvider>
      <ThreeScene 
        onSceneReady={handleSceneReady}
        autoRotate={!isLoading && !error}
        backgroundColor="#f8f9fa"
      >
        <ModelLoader
          modelUrl={modelUrl}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
          onLoadError={handleLoadError}
        />
        <LoadingIndicator 
          progress={loadingProgress} 
          error={error}
        />
      </ThreeScene>
    </ThreeProvider>
  );
};

export default ModelViewer;
