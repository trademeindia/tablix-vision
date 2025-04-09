
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
    },
    {
      id: "cat-6",
      name: "Showcase Items",
      description: "Special dishes with 3D models and animated previews",
      restaurant_id,
      display_order: 6
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
      image_url: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1626516011167-1a399097e6f4?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop",
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
      image_url: "https://images.unsplash.com/photo-1615832493239-de59be8d5e29?w=800&auto=format&fit=crop",
      allergens: { isVegetarian: true, items: ["dairy", "gluten"] }
    },
    // 3D Model items
    {
      id: "item-11",
      name: "3D Burger Deluxe",
      description: "Gourmet burger with all the fixings, showcased in interactive 3D",
      price: 280,
      category_id: "cat-6",
      restaurant_id,
      is_available: true,
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
      media_type: "3d",
      model_url: "https://models.readyplayer.me/64d3a8bc86c8c409fa3cf153.glb",
      allergens: { items: ["gluten", "dairy"] }
    },
    {
      id: "item-12",
      name: "3D Sushi Platter",
      description: "Assorted sushi pieces with interactive 3D viewing experience",
      price: 450,
      category_id: "cat-6",
      restaurant_id,
      is_available: true,
      image_url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      media_type: "3d",
      model_url: "https://models.readyplayer.me/645cb58986c38baa4fa87c76.glb",
      allergens: { items: ["fish", "shellfish"] }
    },
    // Animated GIF items
    {
      id: "item-13",
      name: "Flaming Crème Brûlée",
      description: "Watch the caramelization process in this animated dessert demo",
      price: 220,
      category_id: "cat-6",
      restaurant_id,
      is_available: true,
      image_url: "https://media.giphy.com/media/CKlafeh1NAxz35KTq4/giphy.gif",
      allergens: { isVegetarian: true, items: ["dairy", "eggs"] }
    },
    {
      id: "item-14",
      name: "Chocolate Fountain",
      description: "Mesmerizing chocolate fountain with fresh fruits for dipping",
      price: 350,
      category_id: "cat-6",
      restaurant_id,
      is_available: true,
      image_url: "https://media.giphy.com/media/THIuVYJKksLZYzu02I/giphy.gif",
      allergens: { isVegetarian: true, items: ["dairy"] }
    },
    {
      id: "item-15",
      name: "Sizzling Fajitas",
      description: "Hot sizzling fajitas brought to your table",
      price: 420,
      category_id: "cat-6",
      restaurant_id,
      is_available: true,
      image_url: "https://media.giphy.com/media/mJhRUoBJiSL1KybMk2/giphy.gif",
      allergens: { items: ["gluten"] }
    }
  ];
  
  return { categories, items };
};
