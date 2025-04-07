
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeContextValue {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  setThreeObjects: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
  ) => void;
}

const ThreeContext = createContext<ThreeContextValue | null>(null);

export const ThreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  const setThreeObjects = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
  ) => {
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setControls(controls);
  };

  return (
    <ThreeContext.Provider
      value={{
        scene,
        camera,
        renderer,
        controls,
        setThreeObjects,
      }}
    >
      {children}
    </ThreeContext.Provider>
  );
};

export const useThree = () => {
  const context = useContext(ThreeContext);
  
  if (!context) {
    throw new Error("useThree must be used within a ThreeProvider");
  }
  
  return context;
};
