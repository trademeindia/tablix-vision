
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%221%22 fill=%22%23fff%22 opacity=%22.3%22/%3E%3C/svg%3E')] bg-[length:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-white px-4 py-1 rounded-full text-sm font-medium mb-2">
              Trusted by 500+ Restaurants in India
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/80">
              Revolutionize Your Restaurant with Menu 360°
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0">
              The complete mobile-first platform that increases revenue by 32%, reduces costs, and delights customers with QR ordering, dynamic menus, and seamless payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white border-none font-medium">
                <Link to="/request-demo">
                  Get Started Free • No Credit Card
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium group border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:text-white">
                <Link to="#features" className="flex items-center">
                  See Features in Action
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-green-400" />
                <span className="text-sm text-slate-300">14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-slate-300">4.9/5 Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur-sm opacity-75 animate-pulse"></div>
              <div className="relative bg-black rounded-xl shadow-2xl overflow-hidden border border-white/10">
                <AspectRatio ratio={9/16} className="bg-black">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                          <span className="font-bold text-white">SP</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">Spice Paradise</div>
                          <div className="text-xs text-slate-400">Table #12</div>
                        </div>
                      </div>
                      <div className="bg-primary/20 text-primary-foreground text-xs font-medium rounded-full px-2 py-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                        Menu
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
                      {[
                        { name: "Butter Chicken", price: "₹399", img: "bg-gradient-to-br from-orange-500 to-red-600" },
                        { name: "Paneer Tikka", price: "₹349", img: "bg-gradient-to-br from-amber-500 to-yellow-600" },
                        { name: "Veg Biryani", price: "₹299", img: "bg-gradient-to-br from-emerald-500 to-green-600" },
                        { name: "Masala Dosa", price: "₹199", img: "bg-gradient-to-br from-yellow-500 to-amber-600" }
                      ].map((item, i) => (
                        <div key={i} className="rounded-lg bg-white/5 backdrop-blur-sm p-2 flex flex-col border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                          <div className={`rounded ${item.img} w-full h-16 mb-2 flex items-center justify-center text-white text-xs font-medium`}>HD</div>
                          <div className="text-xs font-medium text-white">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-1">{item.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="bg-primary text-white text-center py-2 rounded-md text-sm font-medium shadow-lg shadow-primary/20">
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
