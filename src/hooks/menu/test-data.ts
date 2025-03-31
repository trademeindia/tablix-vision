
import { MenuCategory, MenuItem } from '@/types/menu';

// Fallback test data for when the database connection fails
export const TEST_CATEGORIES: MenuCategory[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Appetizers",
    description: "Start your meal right",
    display_order: 1
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Main Course",
    description: "Delicious entrees",
    display_order: 2
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Desserts",
    description: "Sweet treats",
    display_order: 3
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Beverages",
    description: "Refreshing drinks",
    display_order: 4
  }
];

export const TEST_MENU_ITEMS: MenuItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    name: "Crispy Spring Rolls",
    description: "Vegetable filled crispy rolls served with sweet chili sauce",
    price: 8.99,
    category_id: "00000000-0000-0000-0000-000000000001",
    image_url: "https://images.unsplash.com/photo-1677366767031-01c8255cb812?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      items: ["Wheat"]
    }
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet grilled to perfection, served with seasonal vegetables",
    price: 22.99,
    category_id: "00000000-0000-0000-0000-000000000002",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      items: ["Fish"]
    }
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.99,
    category_id: "00000000-0000-0000-0000-000000000003",
    image_url: "https://images.unsplash.com/photo-1617305855058-336d9ce3aae8?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      items: ["Dairy", "Eggs", "Wheat"]
    }
  },
  {
    id: "00000000-0000-0000-0000-000000000104",
    name: "Sparkling Water",
    description: "Refreshing sparkling water with a hint of lemon",
    price: 3.99,
    category_id: "00000000-0000-0000-0000-000000000004",
    image_url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop",
    is_available: true,
    allergens: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      items: []
    }
  }
];
