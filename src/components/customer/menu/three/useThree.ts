
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export const useThree = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  
  useEffect(() => {
    // Create scene
    const newScene = new THREE.Scene();
    
    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    newCamera.position.z = 5;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    newScene.add(directionalLight);
    
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    
    // Handle window resize
    const handleResize = () => {
      if (newCamera && newRenderer) {
        newCamera.aspect = window.innerWidth / window.innerHeight;
        newCamera.updateProjectionMatrix();
        newRenderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      newRenderer.dispose();
    };
  }, []);
  
  return {
    scene,
    camera,
    renderer
  };
};
