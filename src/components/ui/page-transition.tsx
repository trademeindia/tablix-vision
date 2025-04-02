
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay rendering to next frame for smoother animation
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div
      className={cn(
        'transition-opacity duration-300 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
