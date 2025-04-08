
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
        <title>Menu 360° - Complete Restaurant Management System | India's #1 QR Ordering Solution</title>
        <meta name="description" content="Streamline your restaurant operations with QR ordering, digital menu, automated payments, and powerful business insights. Trusted by 500+ restaurants across India." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Additional SEO meta tags for Indian market */}
        <meta name="keywords" content="restaurant management, QR code menu, digital menu India, restaurant QR ordering, restaurant technology India, contactless dining, UPI payment integration, restaurant software India, restaurant POS system, restaurant management app India" />
        <meta property="og:title" content="Menu 360° - Complete Restaurant Management System | India's #1 QR Ordering Solution" />
        <meta property="og:description" content="Streamline your restaurant operations with QR ordering, digital menu, automated payments, and powerful business insights. Trusted by 500+ restaurants across India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://menu360.in" />
        <meta property="og:image" content="https://menu360.in/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Menu 360° - Complete Restaurant Management System | India's #1 QR Ordering Solution" />
        <meta name="twitter:description" content="Streamline your restaurant operations with QR ordering, digital menu, automated payments, and powerful business insights. Trusted by 500+ restaurants across India." />
        <meta name="twitter:image" content="https://menu360.in/twitter-image.jpg" />
        
        {/* Regional and local business markup */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <link rel="alternate" href="https://menu360.in/hi" hrefLang="hi-in" />
        <link rel="canonical" href="https://menu360.in" />
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
