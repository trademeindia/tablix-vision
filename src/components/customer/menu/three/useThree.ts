
import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Initialize scene and renderer
  const initializeScene = useCallback((container: HTMLElement, backgroundColor: string = '#f1f5f9') => {
    if (!container) return;
    
    try {
      // Create renderer if it doesn't exist
      if (!renderer) {
        const newRenderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true
        });
        newRenderer.setClearColor(backgroundColor, 1);
        newRenderer.setPixelRatio(window.devicePixelRatio);
        newRenderer.shadowMap.enabled = true;
        
        // Set size
        newRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(newRenderer.domElement);
        
        setRenderer(newRenderer);
      } else {
        // If renderer exists, just update its container and size
        renderer.setClearColor(backgroundColor, 1);
        if (renderer.domElement.parentElement !== container) {
          container.appendChild(renderer.domElement);
        }
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
      
      // Set up camera
      camera.position.z = 5;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      
      // Setup controls if they don't exist
      if (!controls && renderer) {
        const newControls = new OrbitControls(camera, renderer.domElement);
        newControls.enableDamping = true;
        newControls.dampingFactor = 0.05;
        newControls.minDistance = 2;
        newControls.maxDistance = 10;
        newControls.autoRotate = true;
        
        setControls(newControls);
      }
      
      // Setup lighting if scene is empty
      if (scene.children.length === 0) {
        // Add ambient light for basic illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Add directional light for shadows and better definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Add additional light from the opposite side
        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 5, -5);
        scene.add(secondaryLight);
      }
      
    } catch (err) {
      console.error("Error initializing Three.js scene:", err);
    }
  }, [scene, camera, renderer, controls]);
  
  // Control auto-rotation
  const setAutoRotate = useCallback((autoRotate: boolean) => {
    if (controls) {
      controls.autoRotate = autoRotate;
    }
  }, [controls]);
  
  // Control rotation speed
  const setRotationSpeed = useCallback((speed: number) => {
    if (controls) {
      controls.autoRotateSpeed = speed;
    }
  }, [controls]);
  
  // Animation loop
  useEffect(() => {
    if (!renderer || !scene || !camera || !controls) return;
    
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [renderer, scene, camera, controls]);
  
  // Clean up
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      
      if (controls) {
        controls.dispose();
      }
      
      // Clear scene
      scene.clear();
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
    animationFrameId: animationFrameId.current
  };
}
