
import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(45, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [domElement, setDomElement] = useState<HTMLCanvasElement | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const autoRotateRef = useRef(true);
  const rotationSpeedRef = useRef(1.0);
  
  // Initialize the scene with container and background color
  const initializeScene = useCallback((container: HTMLElement, backgroundColor: string = '#ffffff') => {
    if (!container) return;
    
    // Clean up any existing animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Setup renderer with optimized settings
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    newRenderer.setSize(width, height);
    newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    newRenderer.outputEncoding = THREE.sRGBEncoding;
    
    // Set initial camera position
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    // Clear existing scene
    while(scene.children.length > 0) { 
      scene.remove(scene.children[0]); 
    }
    
    // Set scene background
    scene.background = new THREE.Color(backgroundColor);
    
    // Setup enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);
    
    // Setup optimized controls
    const newControls = new OrbitControls(camera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.minDistance = 2;
    newControls.maxDistance = 10;
    newControls.maxPolarAngle = Math.PI / 1.5;
    newControls.autoRotate = autoRotateRef.current;
    newControls.autoRotateSpeed = rotationSpeedRef.current * 10;
    
    setControls(newControls);
    setRenderer(newRenderer);
    setDomElement(newRenderer.domElement);
    
    // Append canvas to container
    container.appendChild(newRenderer.domElement);
    
    // Setup animation loop with performance optimization
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (newControls) {
        newControls.update();
      }
      
      if (newRenderer) {
        newRenderer.render(scene, camera);
      }
    };
    
    animate();
    
    // Handle window resizing
    const handleResize = () => {
      if (container && newRenderer) {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        newRenderer.setSize(newWidth, newHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (newControls) {
        newControls.dispose();
      }
      
      if (newRenderer) {
        if (container.contains(newRenderer.domElement)) {
          container.removeChild(newRenderer.domElement);
        }
        newRenderer.dispose();
      }
      
      // Clear scene
      while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
      }
    };
  }, [camera, scene]);
  
  // Methods to control auto-rotation
  const setAutoRotate = useCallback((autoRotate: boolean) => {
    if (controls) {
      autoRotateRef.current = autoRotate;
      controls.autoRotate = autoRotate;
    }
  }, [controls]);
  
  const setRotationSpeed = useCallback((speed: number) => {
    if (controls) {
      rotationSpeedRef.current = speed;
      controls.autoRotateSpeed = speed * 10;
    }
  }, [controls]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (controls) {
        controls.dispose();
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      // Clear scene
      while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
      }
    };
  }, [controls, renderer, scene]);
  
  return { 
    scene, 
    camera, 
    renderer, 
    domElement,
    controls,
    initializeScene,
    setAutoRotate,
    setRotationSpeed
  };
}
