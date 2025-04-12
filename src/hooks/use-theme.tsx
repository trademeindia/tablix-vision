
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  restaurantId: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  restaurantId 
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
          .maybeSingle(); // Changed from single() to maybeSingle() to handle missing records

        if (error) {
          console.error("Error fetching theme:", error);
          setError(new Error(error.message));
          // Still use default theme when there's an error
          console.log("Using default theme due to error");
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
          console.log("No theme found or restaurant doesn't exist, using default");
          // Make it clear in the console that we're using the default theme
          console.info("Using default theme because either the restaurant doesn't exist or has no theme set");
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
        toast({
          title: "Error updating theme",
          description: "No restaurant ID provided",
          variant: "destructive",
        });
        return;
      }

      const updatedTheme = { ...theme, ...newTheme };
      setThemeState(updatedTheme);

      // Check if restaurant exists before updating
      const { data: existingRestaurant, error: checkError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('id', restaurantId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking restaurant:", checkError);
        throw new Error(checkError.message);
      }

      // If restaurant doesn't exist, log it and don't attempt update
      if (!existingRestaurant) {
        console.warn(`Restaurant with ID ${restaurantId} doesn't exist, cannot update theme`);
        toast({
          title: "Theme update skipped",
          description: "The restaurant record doesn't exist in the database",
          variant: "destructive",
        });
        return;
      }

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
      toast({
        title: "Theme updated",
        description: "The theme has been updated successfully",
      });
    } catch (err) {
      console.error("Error in updateTheme:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error updating theme",
        description: getErrorMessage(err),
        variant: "destructive",
      });
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

// Helper function to get error messages
const getErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  return 'An unexpected error occurred. Please try again.';
};
