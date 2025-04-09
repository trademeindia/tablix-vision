
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  return <section id="hero" className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Automate, Analyse, & Grow <br/>
              Your Restaurant with <br/>
              Menu 360
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto lg:mx-0">The complete mobile-first platform powered by AI for seamless QR ordering, automated payments, dynamic menu management, and powerful business insights.</p>
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
                <AspectRatio ratio={9 / 16} className="bg-white">
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
                      {[1, 2, 3, 4].map(i => <div key={i} className="rounded-lg bg-slate-100 p-2 flex flex-col">
                          <div className="rounded bg-slate-200 w-full h-16 mb-2"></div>
                          <div className="text-xs font-medium">Menu Item {i}</div>
                          <div className="text-xs text-slate-500 mt-1">₹ {120 + i * 10}</div>
                        </div>)}
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
    </section>;
};

export default HeroSection;
