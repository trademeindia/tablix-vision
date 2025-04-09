
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const LandingHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <RouterLink to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
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
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] py-10">
              <div className="flex flex-col gap-6 px-2">
                <RouterLink 
                  to="/#features" 
                  className="flex items-center py-3 text-base font-medium text-gray-600 hover:text-gray-900 border-b border-gray-100"
                  onClick={closeSheet}
                >
                  Features
                </RouterLink>
                <RouterLink 
                  to="/#how-it-works" 
                  className="flex items-center py-3 text-base font-medium text-gray-600 hover:text-gray-900 border-b border-gray-100"
                  onClick={closeSheet}
                >
                  How It Works
                </RouterLink>
                <RouterLink 
                  to="/#pricing" 
                  className="flex items-center py-3 text-base font-medium text-gray-600 hover:text-gray-900 border-b border-gray-100"
                  onClick={closeSheet}
                >
                  Pricing
                </RouterLink>
                <RouterLink 
                  to="/auth/login" 
                  className="flex items-center py-3 text-base font-medium text-gray-600 hover:text-gray-900 border-b border-gray-100"
                  onClick={closeSheet}
                >
                  Sign In
                </RouterLink>
                <Button asChild className="mt-4">
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
