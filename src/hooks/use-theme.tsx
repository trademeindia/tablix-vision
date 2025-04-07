
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ThemeColors = {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
};

interface ThemeContextType {
  theme: ThemeColors;
  loading: boolean;
  error: Error | null;
  updateTheme: (newTheme: Partial<ThemeColors>) => Promise<void>;
  setTheme: (newTheme: ThemeColors) => Promise<void>;
  isLoading: boolean;
  resetToDefault: () => Promise<void>;
}

// Default theme values
const defaultTheme: ThemeColors = {
  primaryColor: '#0f766e', // Default primary color
  backgroundColor: '#ffffff',
  accentColor: '#06b6d4',
  textColor: '#0f172a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  restaurantId?: string; // Made optional with '?'
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  restaurantId = '' // Default empty string
}) => {
  const [theme, setThemeState] = useState<ThemeColors>(defaultTheme);
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
          setThemeState({
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

  const updateTheme = async (newTheme: Partial<ThemeColors>) => {
    try {
      if (!restaurantId) {
        console.error("Cannot update theme: No restaurant ID provided");
        return;
      }

      const updatedTheme = { ...theme, ...newTheme };
      setThemeState(updatedTheme);

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

  const setTheme = async (newTheme: ThemeColors) => {
    try {
      setThemeState(newTheme);
      await updateTheme(newTheme);
    } catch (err) {
      console.error("Error in setTheme:", err);
      throw err;
    }
  };

  const resetToDefault = async () => {
    try {
      setThemeState(defaultTheme);
      await updateTheme(defaultTheme);
    } catch (err) {
      console.error("Error in resetToDefault:", err);
      throw err;
    }
  };

  const value = {
    theme,
    loading,
    error,
    updateTheme,
    setTheme,
    isLoading: loading,
    resetToDefault,
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
