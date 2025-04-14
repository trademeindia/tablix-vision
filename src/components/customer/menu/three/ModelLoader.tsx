
import { useEffect, useState } from 'react';
import { useThree } from './useThree';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelLoaderProps {
  modelUrl: string;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
  scale?: number;
  center?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ 
  modelUrl,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onLoadError,
  scale = 1,
  center = true,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
  const { scene } = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!scene || !modelUrl) return;
    
    // Notify load start
    if (onLoadStart) onLoadStart();
    
    // Clear previous model if it exists
    if (model) {
      scene.remove(model);
      setModel(null);
    }
    
    // Reset error state
    setError(null);
    
    console.log('Loading 3D model from:', modelUrl);
    
    // Create loader
    const loader = new GLTFLoader();
    
    // Load model
    loader.load(
      modelUrl,
      (gltf) => {
        try {
          const newModel = gltf.scene;
          
          // Apply scale
          newModel.scale.set(scale, scale, scale);
          
          // Apply position
          newModel.position.set(position[0], position[1], position[2]);
          
          // Apply rotation
          newModel.rotation.set(rotation[0], rotation[1], rotation[2]);
          
          // Center model if requested
          if (center) {
            const box = new THREE.Box3().setFromObject(newModel);
            const center = box.getCenter(new THREE.Vector3());
            
            newModel.position.x -= center.x;
            newModel.position.y -= center.y;
            newModel.position.z -= center.z;
          }
          
          // Add to scene
          scene.add(newModel);
          setModel(newModel);
          
          console.log('Model loaded successfully:', gltf);
          
          // Notify load complete
          if (onLoadComplete) onLoadComplete();
        } catch (err) {
          console.error('Error processing loaded model:', err);
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          if (onLoadError) onLoadError(error);
        }
      },
      (progressEvent) => {
        // Calculate progress percentage
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        if (onLoadProgress) onLoadProgress(progress);
      },
      (err) => {
        console.error('Error loading 3D model:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (onLoadError) onLoadError(error);
      }
    );
    
    // Cleanup
    return () => {
      if (model && scene) {
        scene.remove(model);
      }
    };
  }, [modelUrl, scene, scale, center, position, rotation, onLoadStart, onLoadProgress, onLoadComplete, onLoadError]);
  
  // Return null since we're not rendering anything directly
  return null;
};

export default ModelLoader;
