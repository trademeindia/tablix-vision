
import React, { useEffect, useRef } from 'react';
import { useThree } from './useThree';

interface ThreeSceneProps {
  children?: React.ReactNode;
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  children, 
  className,
  autoRotate = true,
  rotationSpeed = 1.0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeInstance = useThree();
  
  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    const domElement = threeInstance.initializeScene();
    
    if (domElement && containerRef.current) {
      // Clear any existing children first
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      
      containerRef.current.appendChild(domElement);
      
      // Apply auto-rotate setting
      threeInstance.setAutoRotate(autoRotate);
      threeInstance.setRotationSpeed(rotationSpeed);
      
      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        threeInstance.camera.aspect = width / height;
        threeInstance.camera.updateProjectionMatrix();
        
        threeInstance.renderer.setSize(width, height);
      };
      
      // Initial sizing
      handleResize();
    }
    
    return () => {
      // Cleanup
      if (threeInstance.animationFrameId !== null) {
        cancelAnimationFrame(threeInstance.animationFrameId);
      }
      
      // Remove the canvas from the DOM to prevent memory leaks
      if (containerRef.current && containerRef.current.contains(domElement)) {
        containerRef.current.removeChild(domElement);
      }
    };
  }, [threeInstance, autoRotate, rotationSpeed]);
  
  return (
    <div 
      ref={containerRef} 
      className={`three-scene w-full h-full ${className || ''}`}
      style={{ minHeight: '250px' }}
    >
      {children}
    </div>
  );
};

export default ThreeScene;
