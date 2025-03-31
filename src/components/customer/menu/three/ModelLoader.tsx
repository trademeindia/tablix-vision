
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from './useThree';

interface ModelLoaderProps {
  modelUrl: string;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadComplete?: (model: THREE.Group) => void;
  onLoadError?: (error: Error) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  modelUrl,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onLoadError
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { scene, camera } = useThree();
  
  useEffect(() => {
    if (!scene || !modelUrl) {
      console.error("Scene or modelUrl not available:", { sceneAvailable: !!scene, modelUrlAvailable: !!modelUrl });
      return;
    }
    
    console.log("Starting to load model:", modelUrl);
    
    // Create a temporary loading cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.scale.set(0.5, 0.5, 0.5);
    
    // Add the cube to the scene
    try {
      scene.add(cube);
      cube.position.set(0, 0, 0);
    } catch (e) {
      console.error("Error adding loading cube to scene:", e);
    }
    
    // Notify loading started
    onLoadStart?.();
    
    // Create GLTF loader
    const loader = new GLTFLoader();
    
    // Load the model
    loader.load(
      modelUrl,
      (gltf) => {
        try {
          console.log("Model loaded successfully", gltf);
          
          // Success - remove loading cube
          scene.remove(cube);
          
          // Process the loaded model
          const model = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Scale the model to reasonable size
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2 / maxDim;
            model.scale.multiplyScalar(scale);
          }
          
          // Add model to the scene
          scene.add(model);
          
          // Setup animations if present
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
          }
          
          // Notify loading complete
          onLoadComplete?.(model);
          setLoadingProgress(100);
        } catch (e) {
          console.error("Error processing loaded model:", e);
          // Fix: Cast unknown error to Error or use a string fallback
          const errorMessage = e instanceof Error ? e.message : 'Unknown error processing model';
          onLoadError?.(new Error(errorMessage));
        }
      },
      // Progress callback
      (xhr) => {
        if (xhr.total === 0) return; // Avoid division by zero
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Model loading progress: ${percentComplete.toFixed(2)}%`);
        setLoadingProgress(percentComplete);
        onLoadProgress?.(percentComplete);
      },
      // Error callback
      (error) => {
        console.error('Error loading model:', error);
        try {
          scene.remove(cube);
        } catch (e) {
          console.error("Error removing loading cube:", e);
        }
        // Fix: Cast unknown error to Error or use a string fallback
        const errorMessage = error instanceof Error ? error.message : 'Failed to load 3D model';
        onLoadError?.(new Error(errorMessage));
      }
    );
    
    // Cleanup function
    return () => {
      try {
        scene.remove(cube);
      } catch (e) {
        console.error("Error cleaning up loading cube:", e);
      }
    };
  }, [modelUrl, scene, camera, onLoadStart, onLoadProgress, onLoadComplete, onLoadError]);
  
  return (
    <div className="sr-only" aria-live="polite">
      Loading 3D model: {loadingProgress.toFixed(0)}%
    </div>
  );
};

export default ModelLoader;
