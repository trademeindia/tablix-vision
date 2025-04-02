
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className,
  duration = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDomReady, setIsDomReady] = useState(false);
  
  useEffect(() => {
    // First, mark that DOM content is ready
    setIsDomReady(true);
    
    // Wait a frame to ensure the DOM is fully rendered
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 20); // Small delay to ensure CSS transitions work properly
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div
      className={cn(
        'transition-all',
        isDomReady ? `duration-${duration} ease-in-out` : '',
        isDomReady ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2') : 'opacity-0',
        className
      )}
      style={{
        willChange: 'opacity, transform',
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        minHeight: '100vh' // Ensure consistent height during transitions
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
