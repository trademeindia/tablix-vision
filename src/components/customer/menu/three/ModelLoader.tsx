
import React, { useEffect } from 'react';
import { useThree } from './useThree';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelUrl: string;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadComplete?: (model: any) => void;
  onLoadError?: (error: Error) => void;
  center?: boolean;
  scale?: number;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  modelUrl,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onLoadError,
  center = true,
  scale = 1.0
}) => {
  const { scene, camera } = useThree();
  
  useEffect(() => {
    if (!scene || !camera || !modelUrl) return;
    
    console.log(`Loading 3D model from URL: ${modelUrl}`);
    onLoadStart?.();
    
    // Clean up previous models
    scene.children.forEach(child => {
      if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
        // Fixed: Don't compare Group/Mesh with Scene directly
        // Instead check if it's not a light or camera
        if (!(child instanceof THREE.Light) && !(child instanceof THREE.Camera)) {
          scene.remove(child);
        }
      }
    });
    
    const loader = new GLTFLoader();
    
    // Load the model
    loader.load(
      modelUrl,
      (gltf) => {
        try {
          console.log('3D model loaded successfully', gltf);
          
          const loadedModel = gltf.scene;
          
          // Center the model if requested
          if (center) {
            const box = new THREE.Box3().setFromObject(loadedModel);
            const center = box.getCenter(new THREE.Vector3());
            loadedModel.position.x -= center.x;
            loadedModel.position.y -= center.y;
            loadedModel.position.z -= center.z;
            
            // Auto-scale to fit view
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 2; // Desired size in the scene
            const scaleFactor = targetSize / maxDim * scale;
            loadedModel.scale.multiplyScalar(scaleFactor);
          }
          
          // Add the model to the scene
          scene.add(loadedModel);
          
          // Position camera to see the model
          camera.position.set(0, 0, 5);
          camera.lookAt(0, 0, 0);
          
          onLoadComplete?.(loadedModel);
        } catch (err) {
          console.error('Error processing loaded model:', err);
          const error = err instanceof Error ? err : new Error(String(err));
          onLoadError?.(error);
        }
      },
      (progressEvent) => {
        // Calculate loading progress percentage
        if (progressEvent.lengthComputable) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onLoadProgress?.(progress);
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        // Ensure error is properly converted to Error type
        const errorObj = error instanceof Error ? error : new Error(String(error));
        onLoadError?.(errorObj);
      }
    );
    
    // Cleanup function
    return () => {
      scene.children.forEach(child => {
        // Fixed: Don't compare Group directly with Scene
        // Instead check if it's not a light or camera
        if (child instanceof THREE.Group) {
          if (!(child instanceof THREE.Light) && !(child instanceof THREE.Camera)) {
            scene.remove(child);
          }
        }
      });
    };
  }, [scene, camera, modelUrl, onLoadStart, onLoadComplete, onLoadError, onLoadProgress, center, scale]);
  
  return null; // This component doesn't render anything
};

export default ModelLoader;
