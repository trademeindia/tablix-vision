
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useThree = () => {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.PerspectiveCamera(
    75, // field of view
    1, // aspect ratio (placeholder value, will be updated)
    0.1, // near clipping plane
    1000 // far clipping plane
  ));
  
  const [renderer] = useState(() => new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  }));
  
  const [domElement, setDomElement] = useState<HTMLCanvasElement | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const autoRotate = useRef(true);
  const rotationSpeed = useRef(1);
  
  // Initialize the scene
  const initializeScene = () => {
    if (!domElement) {
      // Create the DOM element if it doesn't exist
      const canvas = renderer.domElement;
      
      // Set up renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xf8f9fa, 0); // Light gray background with transparency
      
      // Set up camera
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      // Add directional light
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);
      
      // Set the created canvas as the DOM element
      setDomElement(canvas);
      
      // Set up controls
      controls.current = new OrbitControls(camera, canvas);
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.2;
      controls.current.rotateSpeed = 0.5;
      controls.current.enableZoom = true;
      controls.current.autoRotate = autoRotate.current;
      controls.current.autoRotateSpeed = rotationSpeed.current;
      
      // Animate with proper cleanup
      const animate = () => {
        if (controls.current) {
          controls.current.update();
        }
        
        renderer.render(scene, camera);
        animationFrameId.current = requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    return renderer.domElement;
  };
  
  // Set auto-rotate
  const setAutoRotate = (value: boolean) => {
    autoRotate.current = value;
    if (controls.current) {
      controls.current.autoRotate = value;
    }
  };
  
  // Set rotation speed
  const setRotationSpeed = (value: number) => {
    rotationSpeed.current = value;
    if (controls.current) {
      controls.current.autoRotateSpeed = value;
    }
  };
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (domElement && domElement.parentElement) {
        const parent = domElement.parentElement;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Run initial resize once
    if (domElement && domElement.parentElement) {
      const parent = domElement.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Clean up animation frame
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [domElement, camera, renderer]);
  
  return {
    scene,
    camera,
    renderer,
    domElement,
    initializeScene,
    controls: controls.current,
    animationFrameId: animationFrameId.current,
    setAutoRotate,
    setRotationSpeed
  };
};

export default useThree;
