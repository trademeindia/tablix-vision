
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from './useThree';

interface ModelLoaderProps {
  modelUrl: string;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
  scale?: number;
  center?: boolean;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  modelUrl,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onLoadError,
  scale = 1.0,
  center = true
}) => {
  const { scene } = useThree();
  
  useEffect(() => {
    if (!modelUrl || !scene) return;
    
    // Clear any existing models
    scene.children
      .filter(child => child instanceof THREE.Group || child instanceof THREE.Mesh)
      .forEach(child => scene.remove(child));
    
    // Notify load start
    if (onLoadStart) onLoadStart();
    
    // Create loader
    const loader = new GLTFLoader();
    
    // Load the model
    loader.load(
      modelUrl,
      (gltf) => {
        // Scale the model
        gltf.scene.scale.set(scale, scale, scale);
        
        // Center the model if requested
        if (center) {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          
          gltf.scene.position.x = -center.x;
          gltf.scene.position.y = -center.y;
          gltf.scene.position.z = -center.z;
        }
        
        // Add to scene
        scene.add(gltf.scene);
        
        // Notify load complete
        if (onLoadComplete) onLoadComplete();
      },
      (progress) => {
        // Calculate progress percentage
        const percentage = (progress.loaded / progress.total) * 100;
        if (onLoadProgress) onLoadProgress(percentage);
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        // Convert ErrorEvent to an Error object with required properties
        if (onLoadError) {
          const errorObj = new Error(error instanceof ErrorEvent ? error.message : String(error));
          onLoadError(errorObj);
        }
      }
    );
    
    return () => {
      // Cleanup when component unmounts or modelUrl changes
    };
  }, [modelUrl, scene, scale, center, onLoadStart, onLoadProgress, onLoadComplete, onLoadError]);
  
  return null; // This component doesn't render anything
};

export default ModelLoader;
