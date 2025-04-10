
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Set up renderer and scene once on mount
  useEffect(() => {
    try {
      // Create renderer
      const newRenderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      newRenderer.setClearColor(0xf1f5f9, 1); // Light gray background
      newRenderer.setPixelRatio(window.devicePixelRatio);
      newRenderer.shadowMap.enabled = true;
      
      // Set up camera
      camera.position.z = 5;
      
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
      
      setRenderer(newRenderer);
      
      // Animation loop
      const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
          // Animation logic can go here
        }
        
        previousTimeRef.current = time;
        if (newRenderer) {
          newRenderer.render(scene, camera);
        }
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
      
      // Clean up
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        
        // Clean up scene
        scene.clear();
        
        // Dispose of renderer
        if (newRenderer) {
          newRenderer.dispose();
          if (newRenderer.domElement && newRenderer.domElement.parentNode) {
            newRenderer.domElement.parentNode.removeChild(newRenderer.domElement);
          }
        }
      };
    } catch (err) {
      console.error("Error initializing Three.js:", err);
      return () => {};
    }
  }, [scene, camera]);
  
  return {
    scene,
    camera,
    renderer,
    domElement: renderer?.domElement
  };
}
