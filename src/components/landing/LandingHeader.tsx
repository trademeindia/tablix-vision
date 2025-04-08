
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <RouterLink to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Menu 360</span>
          </RouterLink>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <RouterLink to="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </RouterLink>
          <RouterLink to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </RouterLink>
          <RouterLink to="/#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </RouterLink>
          <RouterLink to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </RouterLink>
          <Button asChild size="sm">
            <RouterLink to="/auth/signup">Get Started</RouterLink>
          </Button>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-4">
            <RouterLink 
              to="/#features" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Features
            </RouterLink>
            <RouterLink 
              to="/#how-it-works" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              How It Works
            </RouterLink>
            <RouterLink 
              to="/#pricing" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Pricing
            </RouterLink>
            <RouterLink 
              to="/auth/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Sign In
            </RouterLink>
            <Button asChild size="sm" className="w-full" onClick={closeMobileMenu}>
              <RouterLink to="/auth/signup">Get Started</RouterLink>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
