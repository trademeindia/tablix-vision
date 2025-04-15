
import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import ModelLoadingIndicator from './three/ModelLoadingIndicator';

interface ModelViewerProps {
  modelUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    
    // Simulate progress for better UX
    const interval = setInterval(() => {
      if (isMounted.current) {
        setProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress > 95 ? 95 : newProgress;
        });
      }
    }, 200);
    
    // Preload the model to track loading progress
    const loadModel = async () => {
      try {
        if (!modelUrl) {
          throw new Error('No model URL provided');
        }
        
        // Handle case where model might already be in GLTF cache
        const { scene } = await useGLTF.preload(modelUrl);
        
        if (isMounted.current) {
          setProgress(100);
          setTimeout(() => {
            if (isMounted.current) {
              setIsLoading(false);
            }
          }, 500);
        }
      } catch (err: any) {
        console.error('Error loading 3D model:', err);
        if (isMounted.current) {
          setError(err.message || 'Failed to load 3D model');
          setIsLoading(false);
        }
      }
    };
    
    loadModel();
    
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [modelUrl]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-red-500 p-4 text-center">
        <div>
          <p className="font-bold">Error loading model</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          {!isLoading && modelUrl && <Model url={modelUrl} />}
        </PresentationControls>
        
        <OrbitControls enableZoom={true} enablePan={true} />
        <Environment preset="sunset" />
      </Canvas>
      
      {isLoading && <ModelLoadingIndicator progress={progress} />}
    </div>
  );
};

export default ModelViewer;
