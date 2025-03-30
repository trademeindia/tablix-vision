import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add simple controls for rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { 
        x: e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0), 
        y: e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0) 
      };
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const currentPosition = { 
        x: e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0), 
        y: e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0) 
      };
      
      const deltaMove = {
        x: currentPosition.x - previousMousePosition.x,
        y: currentPosition.y - previousMousePosition.y
      };
      
      modelGroup.rotation.y += deltaMove.x * 0.01;
      modelGroup.rotation.x += deltaMove.y * 0.01;
      
      previousMousePosition = currentPosition;
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    // Touch and mouse event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    
    // Add loading indicator
    const loadingElem = document.createElement('div');
    loadingElem.style.position = 'absolute';
    loadingElem.style.top = '50%';
    loadingElem.style.left = '50%';
    loadingElem.style.transform = 'translate(-50%, -50%)';
    loadingElem.style.color = '#888';
    loadingElem.textContent = 'Loading...';
    container.appendChild(loadingElem);
    
    // Create a cube as a placeholder while loading
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    modelGroup.add(cube);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isDragging) {
        modelGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Remove event listeners
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      // Clean up THREE.js resources
      renderer.dispose();
      
      // Properly dispose of geometries and materials
      cube.geometry.dispose();
      cube.material.dispose();
    };
  }, [modelUrl]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }} // Prevent touch events from causing page scroll
    />
  );
};

export default ModelViewer;
