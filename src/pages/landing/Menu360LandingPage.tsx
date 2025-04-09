
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSolutionSection from '@/components/landing/ProblemSolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import VisualShowcaseSection from '@/components/landing/VisualShowcaseSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import PageTransition from '@/components/ui/page-transition';
import { Helmet } from 'react-helmet-async';

const Menu360LandingPage: React.FC = () => {
  // Add error boundary to catch rendering issues
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => {
      console.error("Error encountered in landing page");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    
    // Set up scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Handle hash navigation on page load
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };
    
    handleInitialScroll();
    
    // Add class to body to style background for the landing page specifically
    document.body.classList.add('landing-page-body');
    
    return () => {
      window.removeEventListener('error', handleError);
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
      document.body.classList.remove('landing-page-body');
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-white">
        <h1 className="text-2xl font-bold mb-4">We're experiencing some technical difficulties</h1>
        <p className="mb-6">We're working to fix this issue. Please try again later.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Menu 360 - The Complete Restaurant Management Platform</title>
        <meta name="description" content="Streamline your restaurant operations with QR ordering, automated payments, dynamic menu management, and powerful business insights." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          {`
            .landing-page-body {
              background-color: rgb(15, 23, 42); /* slate-900 */
              color: white;
            }
            
            .bg-grid-white {
              background-size: 30px 30px;
              background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            }
          `}
        </style>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <LandingHeader />
        <PageTransition>
          <main className="flex-grow">
            <HeroSection />
            <ProblemSolutionSection />
            <div id="features">
              <FeaturesSection />
            </div>
            <div id="how-it-works">
              <HowItWorksSection />
            </div>
            <VisualShowcaseSection />
            <TestimonialsSection />
            <div id="pricing">
              <PricingSection />
            </div>
            <FinalCTASection />
          </main>
        </PageTransition>
        <LandingFooter />
      </div>
    </>
  );
};

export default Menu360LandingPage;
