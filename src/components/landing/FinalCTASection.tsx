
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const FinalCTASection: React.FC = () => {
  return (
    <section id="final-cta" className="bg-gradient-to-br from-primary to-primary-600 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
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
    </section>
  );
};

export default FinalCTASection;
