
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-slate-900 to-primary-900 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-2">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-green-400"></span>
              <span>The Future of Restaurant Management</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Revolutionize Your Restaurant Experience
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto lg:mx-0">
              The all-in-one mobile platform for seamless menu management, QR ordering,
              customer engagement, and powerful analytics — designed to delight diners and boost revenue.
            </p>
            
            <div className="flex flex-wrap gap-3 py-3 justify-center lg:justify-start">
              <div className="flex items-center text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                <span>Easy Setup</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                <span>QR Ordering</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                <span>3D Menu Models</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="font-medium bg-white text-primary hover:bg-white/90">
                <Link to="/request-demo">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium border-white/30 text-white hover:bg-white/10 group">
                <Link to="#features" className="flex items-center">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-primary/20 rounded-xl"></div>
              <div className="relative bg-black/40 rounded-xl backdrop-blur-sm overflow-hidden border border-white/20 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-white/70">Menu 360 App</div>
                </div>
                
                <AspectRatio ratio={16 / 9} className="mt-10">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                          GP
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">Gourmet Palace</div>
                          <div className="text-xs text-slate-400">Table #08</div>
                        </div>
                      </div>
                      <div className="bg-primary/20 text-primary-200 text-xs font-medium rounded-full px-3 py-1 backdrop-blur-sm">
                        Digital Menu
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px] cursor-pointer group">
                          <div className="rounded bg-gradient-to-br from-slate-700 to-slate-900 w-full h-24 mb-3 overflow-hidden flex items-center justify-center">
                            <div className="text-xs text-white/30 group-hover:text-white/50 transition-colors">3D Preview</div>
                          </div>
                          <div className="text-sm font-medium text-white">Signature Dish {i}</div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-purple-200">₹ {180 + i * 40}</div>
                            <div className="flex-shrink-0 text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-300">
                              Popular
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-center py-2.5 rounded-md text-sm font-medium">
                        Place Order
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
