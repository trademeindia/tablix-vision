
import { useState, useEffect } from 'react';
import * as THREE from 'three';

export function useThree() {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(45, 1, 0.1, 1000));
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [domElement, setDomElement] = useState<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    // Create renderer on client-side only
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    
    newRenderer.setClearColor(0xf8f9fa, 1);
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    newRenderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Set initial camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    
    // Set up scene lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Set the renderer and DOM element
    setRenderer(newRenderer);
    setDomElement(newRenderer.domElement);
    
    // Set up animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (newRenderer) {
        newRenderer.render(scene, camera);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      newRenderer.dispose();
      scene.clear();
    };
  }, [scene, camera]);
  
  return { scene, camera, renderer, domElement };
}
