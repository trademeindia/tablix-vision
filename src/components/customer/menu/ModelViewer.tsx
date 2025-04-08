
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Spinner from '@/components/ui/spinner';

// The 3D model component
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Log when the component is mounted with the model URL
  React.useEffect(() => {
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
  
  if (!modelUrl) {
    return <div className="p-4 text-center">No model URL provided</div>;
  }
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={() => setIsLoading(false)}
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
    </div>
  );
};

export default ModelViewer;
