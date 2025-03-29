
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
