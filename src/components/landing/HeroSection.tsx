
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ThreeScene from '@/components/customer/menu/three/ThreeScene';
import ModelLoader from '@/components/customer/menu/three/ModelLoader';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Glowing orbs effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Experience The Future <br/>
              of Restaurant Tech
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Revolutionize your dining experience with AI-powered ordering, 3D menu visualization, and seamless payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium">
                <Link to="/request-demo" className="flex items-center">
                  Start Your Free Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <Link to="#features" className="flex items-center">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3D Menu Preview */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
            <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-12">
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-700">
                <AspectRatio ratio={9/16} className="bg-transparent">
                  <ThreeScene backgroundColor="#00000000">
                    <ModelLoader 
                      modelUrl="/models/burger.glb"
                      scale={1.5}
                      position={[0, 0, 0]}
                      rotation={[0, Math.PI / 4, 0]}
                    />
                  </ThreeScene>
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Gourmet Burger</h3>
                      <p className="text-sm text-slate-300">Visualize your menu in 3D</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                      $12.99
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
