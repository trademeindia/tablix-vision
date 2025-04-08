
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Handle anchor links
  useEffect(() => {
    // Check if there's a hash in the URL (anchor link)
    if (location.hash) {
      // Wait a moment for the DOM to be ready
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  React.useEffect(() => {
    const handleError = () => {
      console.error("Error encountered in landing page");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
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
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <LandingHeader />
        <PageTransition>
          <main className="flex-grow">
            <HeroSection />
            <ProblemSolutionSection />
            <FeaturesSection />
            <HowItWorksSection />
            <VisualShowcaseSection />
            <TestimonialsSection />
            <PricingSection />
            <FinalCTASection />
          </main>
        </PageTransition>
        <LandingFooter />
      </div>
    </>
  );
};

export default Menu360LandingPage;
