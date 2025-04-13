
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useThree } from './useThree';

interface ModelControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  autoRotate = true,
  autoRotateSpeed = 2.0,
  enableZoom = true,
  enablePan = false
}) => {
  const { camera, renderer } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  
  useEffect(() => {
    if (!camera || !renderer) return;
    
    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Configure controls
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Set up controls update
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
    };
    
    animate();
    
    // Save controls reference
    controlsRef.current = controls;
    
    // Cleanup
    return () => {
      controls.dispose();
    };
  }, [camera, renderer, autoRotate, autoRotateSpeed, enableZoom, enablePan]);
  
  // Update controls settings when props change
  useEffect(() => {
    if (!controlsRef.current) return;
    
    controlsRef.current.autoRotate = autoRotate;
    controlsRef.current.autoRotateSpeed = autoRotateSpeed;
    controlsRef.current.enableZoom = enableZoom;
    controlsRef.current.enablePan = enablePan;
  }, [autoRotate, autoRotateSpeed, enableZoom, enablePan]);
  
  return null; // This component doesn't render anything
};

export default ModelControls;
