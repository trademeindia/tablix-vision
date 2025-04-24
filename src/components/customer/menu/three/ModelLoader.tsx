
import { useEffect, useState, useCallback } from 'react';
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
  
  // Memory cleanup function
  const cleanupModel = useCallback(() => {
    if (model) {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      scene?.remove(model);
      setModel(null);
    }
  }, [model, scene]);
  
  useEffect(() => {
    if (!scene || !modelUrl) return;
    
    // console.log('Loading 3D model:', modelUrl);
    
    onLoadStart?.();
    cleanupModel();
    
    const loader = new GLTFLoader();
    const controller = new AbortController();
    
    loader.load(
      modelUrl,
      (gltf) => {
        try {
          const newModel = gltf.scene;
          
          // Apply transformations
          newModel.scale.setScalar(scale);
          newModel.position.set(...position);
          newModel.rotation.set(...rotation);
          
          // Center model if requested
          if (center) {
            const box = new THREE.Box3().setFromObject(newModel);
            const center = box.getCenter(new THREE.Vector3());
            newModel.position.sub(center);
          }
          
          // Enable shadows
          newModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          scene.add(newModel);
          setModel(newModel);
          
          // console.log('Model loaded successfully');
          onLoadComplete?.();
          
        } catch (err) {
          console.error('Error processing model:', err);
          const error = err instanceof Error ? err : new Error(String(err));
          onLoadError?.(error);
        }
      },
      (event) => {
        const progress = (event.loaded / event.total) * 100;
        onLoadProgress?.(progress);
      },
      (err) => {
        console.error('Error loading model:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        onLoadError?.(error);
      }
    );
    
    return () => {
      controller.abort();
      cleanupModel();
    };
  }, [
    modelUrl, 
    scene, 
    scale, 
    center, 
    position, 
    rotation, 
    onLoadStart, 
    onLoadProgress, 
    onLoadComplete, 
    onLoadError,
    cleanupModel
  ]);
  
  return null;
};

export default ModelLoader;
