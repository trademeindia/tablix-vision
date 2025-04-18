
import { useEffect, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useThree = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize the Three.js scene with container element and background color
  const initializeScene = useCallback((container: HTMLElement, backgroundColor: string = '#ffffff') => {
    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(backgroundColor);
    
    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      75, // Field of view
      container.offsetWidth / container.offsetHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    newCamera.position.z = 5;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    newRenderer.setSize(container.offsetWidth, container.offsetHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(newRenderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    newScene.add(directionalLight);
    
    // Create controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    
    // Set up render loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      newControls.update();
      newRenderer.render(newScene, newCamera);
    };
    
    // Start animation
    animate();
    
    // Set states
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    
    // Return cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      container.removeChild(newRenderer.domElement);
      newRenderer.dispose();
      
      // Dispose geometry and materials
      newScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, []);
  
  // Helper function to set auto-rotate
  const setAutoRotate = useCallback((autoRotate: boolean) => {
    if (controls) {
      controls.autoRotate = autoRotate;
    }
  }, [controls]);
  
  // Helper function to set rotation speed
  const setRotationSpeed = useCallback((speed: number) => {
    if (controls) {
      controls.autoRotateSpeed = speed;
    }
  }, [controls]);
  
  return {
    scene,
    camera,
    renderer,
    controls,
    initializeScene,
    setAutoRotate,
    setRotationSpeed
  };
};
