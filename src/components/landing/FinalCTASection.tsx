
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const FinalCTASection: React.FC = () => {
  return (
    <section id="final-cta" className="bg-gradient-to-br from-primary to-primary-600 text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Digital restaurant management" 
            className="w-full h-64 object-cover rounded-xl shadow-xl mb-10 opacity-75"
          />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Modernize Your Restaurant Operations?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Join hundreds of restaurants streamlining their business with Menu 360
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-white">
              <Link to="/request-demo">Request Your Free Demo Today</Link>
            </Button>
            <Button asChild size="lg" variant="link" className="text-white">
              <Link to="/contact" className="flex items-center">
                Still have questions? <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
