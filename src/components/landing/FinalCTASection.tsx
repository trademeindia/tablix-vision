
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, PhoneCall } from 'lucide-react';

const FinalCTASection: React.FC = () => {
  return (
    <section id="final-cta" className="relative overflow-hidden py-20 md:py-28">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900"></div>
      
      {/* Animated background dots */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%221%22 fill=%22%23fff%22 opacity=%22.3%22/%3E%3C/svg%3E')] bg-[length:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
          <span className="inline-block bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
            Limited Time Offer
          </span>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Get 25% Off Your First 3 Months
          </h2>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Join over 500+ restaurants across India modernizing their business with Menu 360
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium group">
              <Link to="/request-demo" className="flex items-center">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 font-medium">
              <Link to="/contact" className="flex items-center">
                <PhoneCall className="mr-2 h-4 w-4" />
                Schedule a Demo Call
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white/80 text-sm">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white mb-1">500+</div>
              <div>Restaurants</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white mb-1">32%</div>
              <div>Revenue Increase</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white mb-1">15min</div>
              <div>Setup Time</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white mb-1">24/7</div>
              <div>Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
