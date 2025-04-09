
import React, { useRef, useEffect, useState } from 'react';
import { useThree } from './three/useThree';
import ModelLoader from './three/ModelLoader';
import ModelControls from './three/ModelControls';
import Spinner from '@/components/ui/spinner';

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  className?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  autoRotate = true,
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Set up the Three.js scene
  const threeInstance = useThree();
  
  // Initialize the scene when the component mounts
  useEffect(() => {
    if (!containerRef.current || !threeInstance) return;
    
    const domElement = threeInstance.initializeScene();
    
    if (domElement && containerRef.current) {
      // Clear any existing children first
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      
      containerRef.current.appendChild(domElement);
      
      // Set auto-rotate based on prop
      threeInstance.setAutoRotate(autoRotate);
      
      // Set initial size
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      threeInstance.renderer.setSize(width, height);
      threeInstance.camera.aspect = width / height;
      threeInstance.camera.updateProjectionMatrix();
    }
    
    // Clean up function
    return () => {
      if (containerRef.current && threeInstance.domElement && 
          containerRef.current.contains(threeInstance.domElement)) {
        containerRef.current.removeChild(threeInstance.domElement);
      }
      
      if (threeInstance.animationFrameId) {
        cancelAnimationFrame(threeInstance.animationFrameId);
      }
    };
  }, [threeInstance, autoRotate]);
  
  // Handle loading states
  const handleLoadStart = () => {
    setLoading(true);
    setLoadProgress(0);
    setError(null);
    setModelLoaded(false);
  };
  
  const handleLoadProgress = (progress: number) => {
    setLoadProgress(progress);
  };
  
  const handleLoadComplete = () => {
    setLoading(false);
    setModelLoaded(true);
  };
  
  const handleLoadError = (err: Error) => {
    console.error('Error loading 3D model:', err);
    setError(err);
    setLoading(false);
  };
  
  return (
    <div className={`relative w-full h-full ${className || ''}`} style={{ minHeight: '250px' }}>
      {/* Container for the Three.js canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-100 overflow-hidden rounded-md"
        style={{ minHeight: '250px' }}
      />
      
      {/* Model Loader component */}
      {modelUrl && threeInstance.scene && (
        <ModelLoader 
          modelUrl={modelUrl}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadComplete={handleLoadComplete}
          onLoadError={handleLoadError}
          center={true}
          scale={1.0}
        />
      )}
      
      {/* Controls for the model (orbit, zoom, etc.) */}
      {modelLoaded && <ModelControls autoRotate={autoRotate} />}
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 z-10">
          <Spinner size="lg" />
          <div className="mt-2 text-sm text-slate-600">
            Loading 3D Model... {loadProgress > 0 ? `${Math.round(loadProgress)}%` : ''}
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-10 p-4">
          <div className="text-red-500 mb-2">Failed to load 3D model</div>
          <div className="text-xs text-slate-600 text-center max-w-xs overflow-hidden">
            {error.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
