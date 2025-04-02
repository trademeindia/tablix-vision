
import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  restaurantId?: string;
}

const ThemeApplier: React.FC<ThemeProviderProps> = ({ children, restaurantId }) => {
  const { theme, isLoading } = useTheme();

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (isLoading || !theme) return;
    
    // Get the document's root element
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    
    // Clean up function to reset variables when component unmounts
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-accent');
      root.style.removeProperty('--color-background');
      root.style.removeProperty('--color-text');
    };
  }, [theme, isLoading]);

  return <>{children}</>;
};

export default ThemeApplier;
