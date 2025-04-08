
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    sticky top-0 z-40 w-full transition-all duration-300
    ${isScrolled 
      ? 'bg-white/90 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/60' 
      : 'bg-transparent'
    }
  `;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={headerClasses}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <RouterLink to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Menu 360°</span>
          </RouterLink>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <RouterLink to="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Features
          </RouterLink>
          <RouterLink to="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            How It Works
          </RouterLink>
          <RouterLink to="/#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Pricing
          </RouterLink>
          <RouterLink to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Sign In
          </RouterLink>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <RouterLink to="/auth/signup">Get Started</RouterLink>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden lg:flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
            <a href="tel:+911234567890">
              <Phone className="h-3 w-3" />
              <span className="ml-1">+91 123-456-7890</span>
            </a>
          </Button>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top">
          <div className="container py-4 flex flex-col space-y-4">
            <RouterLink to="/#features" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Features
            </RouterLink>
            <RouterLink to="/#how-it-works" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </RouterLink>
            <RouterLink to="/#pricing" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </RouterLink>
            <RouterLink to="/auth/login" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </RouterLink>
            <div className="pt-2">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <RouterLink to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </RouterLink>
              </Button>
            </div>
            <div className="pt-1">
              <Button asChild variant="outline" className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10">
                <a href="tel:+911234567890" onClick={() => setMobileMenuOpen(false)}>
                  <Phone className="h-4 w-4" />
                  <span className="ml-1">+91 123-456-7890</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
