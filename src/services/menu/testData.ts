
import { MenuCategory, MenuItem } from "@/types/menu";

// Helper function to generate test data if needed
export const generateTestMenuData = (restaurant_id: string): { categories: MenuCategory[], items: MenuItem[] } => {
  console.log("Generating test menu data for restaurant:", restaurant_id);
  
  const categories = [
    {
      id: "cat-1",
      name: "Starters",
      description: "Begin your meal with these delicious options",
      restaurant_id,
      display_order: 1
    },
    {
      id: "cat-2",
      name: "Main Courses",
      description: "Hearty and satisfying main dishes",
      restaurant_id,
      display_order: 2
    },
    {
      id: "cat-3",
      name: "Desserts",
      description: "Sweet treats to finish your meal",
      restaurant_id,
      display_order: 3
    }
  ];
  
  const items = [
    {
      id: "item-1",
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic butter",
      price: 5.99,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten"] }
    },
    {
      id: "item-2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing",
      price: 8.99,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { items: ["eggs", "dairy"] }
    },
    {
      id: "item-3",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce and mozzarella",
      price: 12.99,
      category_id: "cat-2",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy"] }
    },
    {
      id: "item-4",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with a molten center",
      price: 7.99,
      category_id: "cat-3",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy", "eggs"] }
    }
  ];
  
  return { categories, items };
};
