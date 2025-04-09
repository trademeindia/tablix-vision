
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const LandingHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const closeSheet = () => {
    setOpen(false);
  };

  // Smooth scroll function for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    closeSheet();
    
    // Only attempt to scroll if we're on the landing page
    if (location.pathname === '/' || location.pathname === '/menu360') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update URL without page reload
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <RouterLink to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Menu 360</span>
          </RouterLink>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="#features" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, 'features')}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, 'pricing')}
          >
            Pricing
          </a>
          <RouterLink to="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </RouterLink>
          <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
            <RouterLink to="/auth/signup">Get Started</RouterLink>
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] py-10 bg-slate-900 border-slate-700 text-white">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-white">Menu 360</span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeSheet} className="text-white hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-6 px-2">
                <a 
                  href="#features" 
                  className="flex items-center py-3 text-base font-medium text-slate-300 hover:text-white border-b border-slate-700"
                  onClick={(e) => scrollToSection(e, 'features')}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="flex items-center py-3 text-base font-medium text-slate-300 hover:text-white border-b border-slate-700"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                >
                  How It Works
                </a>
                <a 
                  href="#pricing" 
                  className="flex items-center py-3 text-base font-medium text-slate-300 hover:text-white border-b border-slate-700"
                  onClick={(e) => scrollToSection(e, 'pricing')}
                >
                  Pricing
                </a>
                <RouterLink 
                  to="/auth/login" 
                  className="flex items-center py-3 text-base font-medium text-slate-300 hover:text-white border-b border-slate-700"
                  onClick={closeSheet}
                >
                  Sign In
                </RouterLink>
                <Button asChild className="mt-4 bg-gradient-to-r from-primary to-purple-600">
                  <RouterLink to="/auth/signup" onClick={closeSheet}>
                    Get Started
                  </RouterLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
