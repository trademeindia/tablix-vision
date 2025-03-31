
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;
    
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
      
      // Create a loading indicator
      const loadingElem = document.createElement('div');
      loadingElem.id = 'model-loading-indicator';
      loadingElem.style.position = 'absolute';
      loadingElem.style.top = '50%';
      loadingElem.style.left = '50%';
      loadingElem.style.transform = 'translate(-50%, -50%)';
      loadingElem.style.color = '#888';
      loadingElem.textContent = 'Loading 3D model...';
      container.appendChild(loadingElem);
      
      // Load the model
      loadModel();
    };
    
    const loadModel = () => {
      // Create a temporary loading cube
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.scale.set(0.5, 0.5, 0.5);
      modelGroup.add(cube);
      
      // Create GLTF loader
      const loader = new GLTFLoader();
      
      // Load the model
      loader.load(
        modelUrl,
        (gltf) => {
          // Success - remove loading cube and add model
          modelGroup.remove(cube);
          
          // Process the loaded model
          const model = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Scale the model to reasonable size
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2 / maxDim;
            model.scale.multiplyScalar(scale);
          }
          
          // Add model to the scene
          modelGroup.add(model);
          
          // Remove loading indicator
          const loadingElem = document.getElementById('model-loading-indicator');
          if (loadingElem && container.contains(loadingElem)) {
            container.removeChild(loadingElem);
          }
          
          // Setup animations if present
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            
            // Update mixer in animation loop
            const clock = new THREE.Clock();
            
            const originalAnimate = animate;
            animate = () => {
              mixer.update(clock.getDelta());
              originalAnimate();
            };
          }
          
          setIsLoading(false);
        },
        // Progress callback
        (xhr) => {
          const loadingElem = document.getElementById('model-loading-indicator');
          if (loadingElem) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            loadingElem.textContent = `Loading: ${Math.round(percentComplete)}%`;
          }
        },
        // Error callback
        (error) => {
          console.error('Error loading model:', error);
          setError('Failed to load 3D model');
          setIsLoading(false);
          
          const loadingElem = document.getElementById('model-loading-indicator');
          if (loadingElem) {
            loadingElem.textContent = 'Error loading model';
            loadingElem.style.color = '#e53935';
          }
        }
      );
    };
    
    // Animation loop with optimizations
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Only rotate when not interacting and not in error state
      if (!controls.enabled && !isLoading && !error) {
        modelGroup.rotation.y += 0.005;
      }
      
      // Update orbit controls
      controls.update();
      
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
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      const loadingElem = document.getElementById('model-loading-indicator');
      if (loadingElem && container.contains(loadingElem)) {
        container.removeChild(loadingElem);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Clean up THREE.js resources
      renderer.dispose();
      
      // Clean up controls
      controls.dispose();
      
      // Clean up all scene objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [modelUrl, isLoading, error]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }} // Prevent touch events from causing page scroll
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 bg-opacity-80">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
