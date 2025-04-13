
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(45, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [domElement, setDomElement] = useState<HTMLCanvasElement | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Initialize the scene with container and background color
  const initializeScene = (container: HTMLElement, backgroundColor: string = '#ffffff') => {
    if (!container) return;
    
    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    
    newRenderer.setClearColor(new THREE.Color(backgroundColor), 1);
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    newRenderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Set renderer size to match container
    newRenderer.setSize(container.clientWidth, container.clientHeight);
    
    // Set initial camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    // Set up scene lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add controls
    const newControls = new OrbitControls(camera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.autoRotate = true;
    newControls.autoRotateSpeed = 1.0;
    
    setControls(newControls);
    
    // Append canvas to container
    container.appendChild(newRenderer.domElement);
    
    // Set the renderer and DOM element
    setRenderer(newRenderer);
    setDomElement(newRenderer.domElement);
    
    // Set up animation loop
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
    
    // Return cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (newControls) {
        newControls.dispose();
      }
      
      if (newRenderer && newRenderer.domElement) {
        if (container.contains(newRenderer.domElement)) {
          container.removeChild(newRenderer.domElement);
        }
        newRenderer.dispose();
      }
      
      scene.clear();
    };
  };
  
  // Methods to control auto-rotation
  const setAutoRotate = (autoRotate: boolean) => {
    if (controls) {
      controls.autoRotate = autoRotate;
    }
  };
  
  const setRotationSpeed = (speed: number) => {
    if (controls) {
      controls.autoRotateSpeed = speed;
    }
  };
  
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
      
      scene.clear();
    };
  }, [controls, renderer, scene]);
  
  return { 
    scene, 
    camera, 
    renderer, 
    domElement,
    controls,
    animationFrameId: animationFrameId.current,
    initializeScene,
    setAutoRotate,
    setRotationSpeed
  };
}
