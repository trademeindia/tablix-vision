
import React from 'react';
import { Link } from 'react-router-dom';
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
