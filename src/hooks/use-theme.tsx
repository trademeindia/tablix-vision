
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

// Default theme colors
const defaultTheme: ThemeColors = {
  primary: '#FF7A00',    // Orange - main brand color
  secondary: '#2A4365',  // Dark blue - secondary color
  accent: '#38B2AC',     // Teal - accent color
  background: '#F7FAFC', // Light gray - background color
  text: '#1A202C',       // Dark gray - text color
};

interface ThemeContextType {
  theme: ThemeColors;
  setTheme: (theme: ThemeColors) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetToDefault: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: async () => {},
  isLoading: false,
  error: null,
  resetToDefault: async () => {},
});

export const ThemeProvider = ({ children, restaurantId }: { children: React.ReactNode, restaurantId?: string }) => {
  const [theme, setThemeState] = useState<ThemeColors>(defaultTheme);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch theme from Supabase on component mount
  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    const fetchTheme = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('restaurants')
          .select('theme_settings')
          .eq('id', restaurantId)
          .single();
        
        if (error) throw error;
        
        if (data && data.theme_settings) {
          setThemeState(data.theme_settings as ThemeColors);
        }
      } catch (err) {
        console.error('Error fetching theme:', err);
        setError('Failed to load theme settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, [restaurantId]);

  // Save theme to Supabase
  const setTheme = async (newTheme: ThemeColors) => {
    if (!restaurantId) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('restaurants')
        .update({ theme_settings: newTheme })
        .eq('id', restaurantId);

      if (error) throw error;
      setThemeState(newTheme);
    } catch (err) {
      console.error('Error saving theme:', err);
      setError('Failed to save theme settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default theme
  const resetToDefault = async () => {
    await setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading, error, resetToDefault }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
