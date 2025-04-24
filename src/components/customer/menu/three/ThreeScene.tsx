
import React, { useEffect, useRef, useState } from 'react';
import { useThree } from './useThree';

interface ThreeSceneProps {
  children: React.ReactNode;
  onSceneReady?: (scene: any, camera: any, renderer: any, controls: any) => void;
  backgroundColor?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  children, 
  onSceneReady,
  backgroundColor = '#ffffff',
  autoRotate = true,
  rotationSpeed = 0.01
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { 
    scene, 
    camera, 
    renderer, 
    controls,
    initializeScene,
    setAutoRotate,
    setRotationSpeed
  } = useThree();

  // Initialize scene when the container is available
  useEffect(() => {
    if (!containerRef.current) return;
    
    const { offsetWidth, offsetHeight } = containerRef.current;
    setDimensions({ width: offsetWidth, height: offsetHeight });
    
    // console.log('Initializing Three.js scene with dimensions:', offsetWidth, offsetHeight);
    const cleanup = initializeScene(containerRef.current, backgroundColor);
    
    const handleResize = () => {
      if (containerRef.current && renderer) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
        
        renderer.setSize(offsetWidth, offsetHeight);
        if (camera) {
          camera.aspect = offsetWidth / offsetHeight;
          camera.updateProjectionMatrix();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cleanup) cleanup();
    };
  }, [containerRef, initializeScene, backgroundColor, renderer, camera]);

  // Apply auto-rotation settings
  useEffect(() => {
    if (controls) {
      // console.log('Setting auto-rotate:', autoRotate);
      setAutoRotate(autoRotate);
    }
  }, [controls, autoRotate, setAutoRotate]);
  
  // Apply rotation speed
  useEffect(() => {
    if (controls) {
      // console.log('Setting rotation speed:', rotationSpeed);
      setRotationSpeed(rotationSpeed);
    }
  }, [controls, rotationSpeed, setRotationSpeed]);

  // Call onSceneReady callback when scene is ready
  useEffect(() => {
    if (scene && camera && renderer && controls && onSceneReady) {
      // console.log('Scene is ready, calling onSceneReady callback');
      onSceneReady(scene, camera, renderer, controls);
    }
  }, [scene, camera, renderer, controls, onSceneReady]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden" 
      style={{ backgroundColor }}
    >
      {scene && camera && renderer ? children : null}
    </div>
  );
};

export default ThreeScene;
