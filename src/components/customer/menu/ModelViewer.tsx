
import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Spinner from '@/components/ui/spinner';

// The 3D model component
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cleanup GLTF cache on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Attempt to clear the cache for this specific model
      try {
        useGLTF.preload(modelUrl);
        useGLTF.clear(modelUrl);
      } catch (e) {
        console.log("Cache cleanup failed, but that's okay");
      }
    };
  }, [modelUrl]);
  
  // Log when the component is mounted with the model URL
  useEffect(() => {
    console.log("ModelViewer mounted with URL:", modelUrl);
    
    // Return cleanup function
    return () => {
      console.log("ModelViewer unmounting");
    };
  }, [modelUrl]);
  
  const handleError = (e: ErrorEvent) => {
    console.error("Error loading model:", e);
    setError("Failed to load 3D model");
    setIsLoading(false);
  };
  
  const handleModelLoad = () => {
    console.log("3D model loaded successfully");
    setIsLoading(false);
  };
  
  if (!modelUrl) {
    return <div className="p-4 text-center">No model URL provided</div>;
  }
  
  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={() => console.log("Canvas created")}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[1, 1, 1]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <OrbitControls 
            autoRotate
            autoRotateSpeed={2}
            enableZoom={true}
            enablePan={true}
            minDistance={2}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Spinner size="lg" />
          <span className="ml-2 text-sm text-slate-600">Loading 3D model...</span>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-red-500 text-center">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Load status for debugging */}
      <div className="hidden">
        <img 
          src={modelUrl} 
          alt="Preload" 
          onLoad={handleModelLoad} 
          onError={(e) => handleError(e.nativeEvent as unknown as ErrorEvent)} 
          style={{display: 'none'}}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
