
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const FinalCTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-purple-600 text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      <div className="absolute -top-40 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Ready to Transform Your Restaurant Operations?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join hundreds of restaurants streamlining their business and delighting customers with Menu 360
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-300 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">Increase efficiency with digital ordering and management</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-300 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">Enhance customer experience with QR codes and 3D models</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-300 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">Improve decision-making with real-time analytics</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-300 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">Reduce costs and errors with automated billing</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-medium text-base">
              <Link to="/auth/signup">Start Your Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 font-medium text-base group">
              <Link to="/request-demo" className="flex items-center">
                Book a Demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-white/70">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
