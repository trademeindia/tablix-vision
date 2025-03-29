
import { Json } from "@/integrations/supabase/types";

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id?: string;
  display_order?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItemAllergens {
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  items?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  model_url?: string;
  media_type?: string;       // New field for 3D or image
  media_reference?: string;  // New field for Google Drive File ID
  is_available?: boolean;
  is_featured?: boolean;
  ingredients?: any;
  allergens?: MenuItemAllergens;
  nutritional_info?: any;
  preparation_time?: number;
  restaurant_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper functions for type conversion
export function parseAllergens(allergens: Json | null): MenuItemAllergens | undefined {
  if (!allergens) return undefined;
  
  // Handle when allergens is a string (shouldn't happen, but just in case)
  if (typeof allergens === 'string') {
    try {
      return JSON.parse(allergens) as MenuItemAllergens;
    } catch {
      return undefined;
    }
  }
  
  // Handle when allergens is already an object
  if (typeof allergens === 'object') {
    return allergens as unknown as MenuItemAllergens;
  }
  
  return undefined;
}

export function stringifyAllergens(allergens?: MenuItemAllergens): Json {
  if (!allergens) return null;
  return allergens as unknown as Json;
}
