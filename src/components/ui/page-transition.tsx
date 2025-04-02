
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
  
  useEffect(() => {
    // Using requestAnimationFrame to ensure the DOM has fully rendered
    // before applying transitions for smoother performance
    const timeoutId = requestAnimationFrame(() => {
      // Adding a small delay to ensure CSS transitions have time to initialize
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    });
    
    return () => {
      cancelAnimationFrame(timeoutId);
    };
  }, []);
  
  return (
    <div
      className={cn(
        'transition-opacity transition-transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
