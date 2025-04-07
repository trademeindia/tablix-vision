
import React from 'react';
import { useTheme } from '@/hooks/use-theme';

interface ThemeApplierProps {
  children: React.ReactNode;
  restaurantId?: string; // Made optional with '?'
}

const ThemeApplier: React.FC<ThemeApplierProps> = ({ children, restaurantId = '' }) => {
  const { theme, loading, error } = useTheme();

  // Apply the theme to CSS variables
  React.useEffect(() => {
    if (loading) return;
    
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--color-background', theme.backgroundColor);
      document.documentElement.style.setProperty('--color-accent', theme.accentColor);
      document.documentElement.style.setProperty('--color-text', theme.textColor);
    }
  }, [theme, loading]);

  // Always render children, even with errors or during loading
  return <>{children}</>;
};

export default ThemeApplier;
