
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Theme = {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
};

interface ThemeContextType {
  theme: Theme;
  loading: boolean;
  error: Error | null;
  updateTheme: (newTheme: Partial<Theme>) => Promise<void>;
}

// Default theme values
const defaultTheme: Theme = {
  primaryColor: '#0f766e', // Default primary color
  backgroundColor: '#ffffff',
  accentColor: '#06b6d4',
  textColor: '#0f172a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  restaurantId: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  restaurantId 
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        if (!restaurantId) {
          console.log("No restaurant ID provided, using default theme");
          setLoading(false);
          return;
        }

        console.log("Fetching theme for restaurant:", restaurantId);
        const { data, error } = await supabase
          .from('restaurants')
          .select('theme_color')
          .eq('id', restaurantId)
          .single();

        if (error) {
          console.error("Error fetching theme:", error);
          setError(new Error(error.message));
          setLoading(false);
          return;
        }

        if (data && data.theme_color) {
          console.log("Theme fetched successfully:", data.theme_color);
          setTheme({
            ...defaultTheme,
            primaryColor: data.theme_color,
            accentColor: data.theme_color,
          });
        } else {
          console.log("No theme found, using default");
        }
      } catch (err) {
        console.error("Unexpected error fetching theme:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [restaurantId]);

  const updateTheme = async (newTheme: Partial<Theme>) => {
    try {
      if (!restaurantId) {
        console.error("Cannot update theme: No restaurant ID provided");
        return;
      }

      const updatedTheme = { ...theme, ...newTheme };
      setTheme(updatedTheme);

      // Update in database - only update theme_color for now
      const { error } = await supabase
        .from('restaurants')
        .update({ 
          theme_color: updatedTheme.primaryColor 
        })
        .eq('id', restaurantId);

      if (error) {
        console.error("Error updating theme:", error);
        throw new Error(error.message);
      }

      console.log("Theme updated successfully");
    } catch (err) {
      console.error("Error in updateTheme:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const value = {
    theme,
    loading,
    error,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
