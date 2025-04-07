
import React from 'react';
import { ThemeProvider as ThemeContextProvider } from '@/hooks/use-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  restaurantId?: string;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, restaurantId = '' }) => {
  return (
    <ThemeContextProvider restaurantId={restaurantId}>
      {children}
    </ThemeContextProvider>
  );
};

export default ThemeProvider;
