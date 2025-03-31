
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeContextProps {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  modelGroup: THREE.Group | null;
  setThreeObjects: (
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera, 
    renderer: THREE.WebGLRenderer, 
    controls: OrbitControls
  ) => void;
}

const ThreeContext = createContext<ThreeContextProps>({
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  modelGroup: null,
  setThreeObjects: () => {},
});

export const ThreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeObjects, setThreeObjects] = useState<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    modelGroup: THREE.Group | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    modelGroup: null,
  });

  const handleSetThreeObjects = useCallback((
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera, 
    renderer: THREE.WebGLRenderer, 
    controls: OrbitControls
  ) => {
    console.log("Setting Three objects in context");
    
    // Create a model group and add it to the scene
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    setThreeObjects({
      scene,
      camera,
      renderer,
      controls,
      modelGroup,
    });
  }, []);

  return (
    <ThreeContext.Provider
      value={{
        ...threeObjects,
        setThreeObjects: handleSetThreeObjects,
      }}
    >
      {children}
    </ThreeContext.Provider>
  );
};

export const useThree = () => useContext(ThreeContext);
