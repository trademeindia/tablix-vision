
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useThree } from './useThree';

interface ThreeSceneProps {
  children?: React.ReactNode;
  onSceneReady: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls) => void;
  autoRotate?: boolean;
  backgroundColor?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  children, 
  onSceneReady, 
  autoRotate = true,
  backgroundColor = '#f8f9fa'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setThreeObjects } = useThree();
  const sceneSetupRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controls: OrbitControls;
    let modelGroup: THREE.Group;
    
    // Setup renderer with lower pixel ratio for mobile performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    
    const init = () => {
      console.log("Initializing Three.js scene");
      
      // Set up scene with optimized settings
      scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);
      
      // Set up camera
      camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      // Set up renderer with performance optimizations
      renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable antialiasing for performance
        powerPreference: 'high-performance'
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(pixelRatio);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      
      // Add orbit controls for touch interaction
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 10;
      controls.minDistance = 2;
      
      // Add lights (simplified for performance)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Create model group to hold loaded model
      modelGroup = new THREE.Group();
      scene.add(modelGroup);
      
      // Set up in context
      setThreeObjects(scene, camera, renderer, controls);
      
      // Call the callback with created objects
      onSceneReady(scene, camera, renderer, controls);
      sceneSetupRef.current = true;
      
      console.log("Scene initialized successfully");
    };
    
    // Animation loop with optimizations
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Only update when necessary
      if (controls) {
        controls.update();
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    // Initialize the scene
    init();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    animate();
    
    // Cleanup function
    return () => {
      console.log("Cleaning up Three.js resources");
      
      cancelAnimationFrame(animationFrameId);
      
      if (controls) {
        controls.dispose();
      }
      
      if (containerRef.current && renderer && containerRef.current.contains(renderer.domElement)) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.error("Error removing renderer from DOM", e);
        }
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Clean up THREE.js resources
      if (renderer) {
        renderer.dispose();
      }
      
      // Clean up all scene objects
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [onSceneReady, autoRotate, backgroundColor, setThreeObjects]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }} // Prevent touch events from causing page scroll
    >
      {children}
    </div>
  );
};

export default ThreeScene;
