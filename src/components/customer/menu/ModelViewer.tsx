
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let modelGroup: THREE.Group;
    let cube: THREE.Mesh;
    
    // Setup renderer with lower pixel ratio for mobile performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    
    const init = () => {
      // Set up scene with optimized settings
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa);
      
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
      
      // Add lights (simplified for performance)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add simple controls for rotation
      modelGroup = new THREE.Group();
      scene.add(modelGroup);
      
      // Create a cube as a placeholder while loading
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      modelGroup.add(cube);
    };
    
    // Touch and rotation handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      previousMousePosition = { x: clientX, y: clientY };
    };
    
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y
      };
      
      modelGroup.rotation.y += deltaMove.x * 0.01;
      modelGroup.rotation.x += deltaMove.y * 0.01;
      
      previousMousePosition = { x: clientX, y: clientY };
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    // Animation loop with optimizations
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Only rotate when not being dragged and not too resource-intensive
      if (!isDragging && !isLoading) {
        modelGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    // Initialize the scene
    init();
    
    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    animate();
    
    // Loading indicator
    const loadingElem = document.createElement('div');
    loadingElem.style.position = 'absolute';
    loadingElem.style.top = '50%';
    loadingElem.style.left = '50%';
    loadingElem.style.transform = 'translate(-50%, -50%)';
    loadingElem.style.color = '#888';
    loadingElem.textContent = 'Loading...';
    container.appendChild(loadingElem);
    
    // Simulate model loading completed
    setTimeout(() => {
      setIsLoading(false);
      if (container.contains(loadingElem)) {
        container.removeChild(loadingElem);
      }
    }, 1000);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (container.contains(loadingElem)) {
        container.removeChild(loadingElem);
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
      cube.geometry.dispose();
      cube.material.dispose();
    };
  }, [modelUrl, isLoading]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }} // Prevent touch events from causing page scroll
    />
  );
};

export default ModelViewer;
