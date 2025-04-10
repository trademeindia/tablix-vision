
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
    },
    {
      id: "cat-4",
      name: "Drinks",
      description: "Refreshing beverages to complement your meal",
      restaurant_id,
      display_order: 4
    },
    {
      id: "cat-5",
      name: "Indian Specials",
      description: "Popular Indian dishes with authentic flavors",
      restaurant_id,
      display_order: 5
    }
  ];
  
  const items = [
    {
      id: "item-1",
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic butter",
      price: 120,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten"] }
    },
    {
      id: "item-2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing",
      price: 180,
      category_id: "cat-1",
      restaurant_id,
      is_available: true,
      allergens: { items: ["eggs", "dairy"] }
    },
    {
      id: "item-3",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce and mozzarella",
      price: 350,
      category_id: "cat-2",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy"] }
    },
    {
      id: "item-4",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with a molten center",
      price: 220,
      category_id: "cat-3",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten", "dairy", "eggs"] }
    },
    {
      id: "item-5",
      name: "Butter Chicken",
      description: "Tender chicken in a rich tomato and butter gravy",
      price: 380,
      category_id: "cat-5",
      restaurant_id,
      is_available: true,
      allergens: { items: ["dairy"] }
    },
    {
      id: "item-6",
      name: "Paneer Tikka",
      description: "Marinated cottage cheese cubes grilled to perfection",
      price: 320,
      category_id: "cat-5",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["dairy"] }
    },
    {
      id: "item-7",
      name: "Masala Chai",
      description: "Traditional Indian spiced tea",
      price: 80,
      category_id: "cat-4",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["dairy"] }
    },
    {
      id: "item-8",
      name: "Mango Lassi",
      description: "Sweet yogurt drink with mango pulp",
      price: 130,
      category_id: "cat-4",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["dairy"] }
    },
    {
      id: "item-9",
      name: "Naan Bread",
      description: "Soft flatbread baked in the tandoor",
      price: 90,
      category_id: "cat-5",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["gluten"] }
    },
    {
      id: "item-10",
      name: "Gulab Jamun",
      description: "Deep-fried milk solids soaked in sugar syrup",
      price: 150,
      category_id: "cat-3",
      restaurant_id,
      is_available: true,
      allergens: { isVegetarian: true, items: ["dairy", "gluten"] }
    }
  ];
  
  return { categories, items };
};
