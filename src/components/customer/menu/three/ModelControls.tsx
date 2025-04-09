
import React, { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useThree } from './useThree';

interface ModelControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  dampingFactor?: number;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  autoRotate = true,
  autoRotateSpeed = 1.0,
  enableZoom = true,
  enablePan = false,
  dampingFactor = 0.05
}) => {
  const { camera, renderer } = useThree();
  
  useEffect(() => {
    if (!camera || !renderer || !renderer.domElement) return;
    
    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Configure controls
    controls.enableDamping = true;
    controls.dampingFactor = dampingFactor;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    
    // Set reasonable limits for zoom
    controls.minDistance = 2;
    controls.maxDistance = 10;
    
    // Set up update loop for damping
    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
    };
  }, [camera, renderer, autoRotate, autoRotateSpeed, enableZoom, enablePan, dampingFactor]);
  
  return null; // This component doesn't render anything
};

export default ModelControls;
