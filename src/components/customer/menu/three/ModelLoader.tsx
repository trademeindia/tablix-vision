
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
    if (!scene || !modelUrl) return;
    
    // Create a temporary loading cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.scale.set(0.5, 0.5, 0.5);
    scene.add(cube);
    
    // Notify loading started
    onLoadStart?.();
    
    // Create GLTF loader
    const loader = new GLTFLoader();
    
    // Load the model
    loader.load(
      modelUrl,
      (gltf) => {
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
      },
      // Progress callback
      (xhr) => {
        if (xhr.total === 0) return; // Avoid division by zero
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        setLoadingProgress(percentComplete);
        onLoadProgress?.(percentComplete);
      },
      // Error callback
      (error) => {
        console.error('Error loading model:', error);
        scene.remove(cube);
        onLoadError?.(new Error('Failed to load 3D model'));
      }
    );
    
    // Cleanup function
    return () => {
      scene.remove(cube);
    };
  }, [modelUrl, scene, camera, onLoadStart, onLoadProgress, onLoadComplete, onLoadError]);
  
  return (
    <div className="sr-only">
      {/* This is a headless component - it doesn't render anything visible */}
      Loading progress: {loadingProgress.toFixed(0)}%
    </div>
  );
};

export default ModelLoader;
