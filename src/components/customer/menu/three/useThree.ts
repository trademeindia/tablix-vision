
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const containerRef = useRef<HTMLElement | null>(null);
  
  // Initialize the scene
  const initializeScene = (container: HTMLElement, backgroundColor: string = '#ffffff') => {
    if (!container) return;
    
    containerRef.current = container;
    
    // Set up renderer if not already created
    if (!renderer) {
      const newRenderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      newRenderer.setClearColor(backgroundColor.startsWith('#') ? parseInt(backgroundColor.substring(1), 16) : 0xf1f5f9, 1);
      newRenderer.setPixelRatio(window.devicePixelRatio);
      newRenderer.shadowMap.enabled = true;
      
      // Set renderer size to match container
      newRenderer.setSize(container.offsetWidth, container.offsetHeight);
      
      // Add renderer to container
      container.appendChild(newRenderer.domElement);
      
      setRenderer(newRenderer);
      
      // Set up camera position
      camera.position.z = 5;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      
      // Set up orbit controls
      const newControls = new OrbitControls(camera, newRenderer.domElement);
      newControls.enableDamping = true;
      newControls.dampingFactor = 0.25;
      newControls.enableZoom = true;
      newControls.autoRotate = autoRotate;
      newControls.autoRotateSpeed = rotationSpeed * 30; // Convert to reasonable rotation speed
      setControls(newControls);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
      secondaryLight.position.set(-5, 5, -5);
      scene.add(secondaryLight);
      
      // Start animation loop
      startAnimationLoop();
    }
  };
  
  // Animation loop
  const startAnimationLoop = () => {
    const animate = (time: number) => {
      requestRef.current = requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      
      previousTimeRef.current = time;
    };
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Update controls when autoRotate changes
  useEffect(() => {
    if (controls) {
      controls.autoRotate = autoRotate;
    }
  }, [controls, autoRotate]);
  
  // Update controls when rotationSpeed changes
  useEffect(() => {
    if (controls) {
      controls.autoRotateSpeed = rotationSpeed * 30;
    }
  }, [controls, rotationSpeed]);
  
  // Clean up
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      scene.clear();
      
      if (renderer) {
        renderer.dispose();
        
        if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      
      if (controls) {
        controls.dispose();
      }
    };
  }, [scene, renderer, controls]);
  
  return {
    scene,
    camera,
    renderer,
    controls,
    domElement: renderer?.domElement,
    initializeScene,
    setAutoRotate,
    setRotationSpeed,
    animationFrameId: requestRef.current
  };
}
