
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import * as THREE from 'three';

// Custom hook for the 3D revolving food effect
const useRevolvingFood = (containerRef, imageUrl, rotationSpeed = 0.01) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0xf1f5f9, 1); // Match slate-100 background
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Create rotating food item using a textured plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const food = new THREE.Mesh(geometry, material);
    scene.add(food);
    camera.position.z = 3;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      food.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, imageUrl, rotationSpeed]);
};

const FoodCard = ({ index }) => {
  const containerRef = useRef(null);
  
  // Different food images for each card
  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // Pizza
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', // Pasta
    'https://images.unsplash.com/photo-1551024739-78e9d60c45ca?w=800', // Burger
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800'   // Dessert
  ];
  
  useRevolvingFood(containerRef, foodImages[index % foodImages.length]);
  
  return (
    <div className="rounded-lg bg-slate-100 p-2 flex flex-col">
      <div ref={containerRef} className="w-full h-16 mb-2"></div>
      <div className="text-xs font-medium">Menu Item {index}</div>
      <div className="text-xs text-slate-500 mt-1">₹ {120 + index*10}</div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Streamline, Delight, & Grow Your Restaurant with Menu 360
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto lg:mx-0">
              The complete mobile-first platform for seamless QR ordering, automated payments, dynamic menu management, and powerful business insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="font-medium">
                <Link to="/request-demo">
                  Request Your Free Demo
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium group">
                <Link to="#features" className="flex items-center">
                  See Features in Action
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-xl"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                <AspectRatio ratio={9/16} className="bg-white">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary"></div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">Pasta Palace</div>
                          <div className="text-xs text-slate-500">Table #12</div>
                        </div>
                      </div>
                      <div className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1">
                        Menu
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <FoodCard key={i} index={i} />
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="bg-primary text-white text-center py-2 rounded-md text-sm">
                        Place Order
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
