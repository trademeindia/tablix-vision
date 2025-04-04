
import { Package, Utensils, Coffee, Wine, LucideIcon } from 'lucide-react';

// Interface for categories
export interface Category {
  name: string;
  icon: LucideIcon;
}

// Categories with icons
export const inventoryCategories: Category[] = [
  { name: "All", icon: Package },
  { name: "Meat", icon: Utensils },
  { name: "Vegetables", icon: Utensils },
  { name: "Beverages", icon: Coffee },
  { name: "Dairy", icon: Package },
  { name: "Seafood", icon: Utensils },
  { name: "Grains", icon: Package },
  { name: "Oils", icon: Wine },
  { name: "Baking", icon: Package }
];
