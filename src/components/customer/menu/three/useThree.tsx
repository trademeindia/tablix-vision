
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeContextType {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  initializeScene: (container: HTMLElement, backgroundColor?: string) => void;
  animationFrameId: number | null;
  setAutoRotate: (autoRotate: boolean) => void;
  setRotationSpeed: (speed: number) => void;
}

const ThreeContext = createContext<ThreeContextType>({
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  initializeScene: () => {},
  animationFrameId: null,
  setAutoRotate: () => {},
  setRotationSpeed: () => {}
});

export const ThreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Auto-rotation settings
  const autoRotateRef = useRef<boolean>(true);
  const rotationSpeedRef = useRef<number>(0.01);
  
  // Set auto-rotation
  const setAutoRotate = useCallback((autoRotate: boolean) => {
    autoRotateRef.current = autoRotate;
    if (controls) {
      controls.autoRotate = autoRotate;
    }
  }, [controls]);
  
  // Set rotation speed
  const setRotationSpeed = useCallback((speed: number) => {
    rotationSpeedRef.current = speed;
    if (controls) {
      controls.autoRotateSpeed = speed * 10; // Convert to OrbitControls speed scale
    }
  }, [controls]);

  const initializeScene = useCallback((container: HTMLElement, backgroundColor = '#ffffff') => {
    if (!container) return;
    
    // Clean up any previous scene
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(backgroundColor);
    
    // Create camera
    const newCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    newCamera.position.z = 5;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    newRenderer.setSize(width, height);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(newRenderer.domElement);
    
    // Add orbit controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.minDistance = 2;
    newControls.maxDistance = 10;
    
    // Apply auto-rotation settings
    newControls.autoRotate = autoRotateRef.current;
    newControls.autoRotateSpeed = rotationSpeedRef.current * 10;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    newScene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      newControls.update();
      newRenderer.render(newScene, newCamera);
    };
    
    animate();
    
    // Set state
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    
    console.log('Three.js scene initialized');
    
    // Cleanup function
    return () => {
      console.log('Cleaning up Three.js scene');
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      container.removeChild(newRenderer.domElement);
      
      // Dispose of resources
      newScene.clear();
      newRenderer.dispose();
      newControls.dispose();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      
      if (scene) {
        scene.clear();
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      if (controls) {
        controls.dispose();
      }
    };
  }, [scene, renderer, controls]);

  return (
    <ThreeContext.Provider 
      value={{ 
        scene, 
        camera, 
        renderer, 
        controls, 
        initializeScene,
        animationFrameId: animationFrameId.current,
        setAutoRotate,
        setRotationSpeed
      }}
    >
      {children}
    </ThreeContext.Provider>
  );
};

export const useThree = () => useContext(ThreeContext);
