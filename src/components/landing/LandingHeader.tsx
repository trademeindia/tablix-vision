
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">Menu360</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center space-x-6")}>
          <Link to="#features" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="#pricing" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="#demo" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
            Demo
          </Link>
          <Link to="/auth/login" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
            Login
          </Link>
          <Button asChild size="sm">
            <Link to="/request-demo">Request Free Demo</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="#features" 
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="#pricing" 
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="#demo" 
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link 
              to="/auth/login" 
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Button asChild className="w-full mt-4">
              <Link to="/request-demo" onClick={() => setIsMenuOpen(false)}>
                Request Free Demo
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
