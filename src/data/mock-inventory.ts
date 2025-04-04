
import { InventoryItem } from '@/types/inventory';

// Demo inventory data
export const initialInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Chicken Breast",
    category: "Meat",
    stock_level: 75,
    unit: "kg",
    quantity: 25,
    price_per_unit: 8.99,
    supplier: "Premium Meats Inc.",
    last_ordered: "2023-05-15",
    status: "In Stock"
  },
  {
    id: 2,
    name: "Basmati Rice",
    category: "Grains",
    stock_level: 60,
    unit: "kg",
    quantity: 30,
    price_per_unit: 3.49,
    supplier: "Global Foods",
    last_ordered: "2023-05-10",
    status: "In Stock"
  },
  {
    id: 3,
    name: "Olive Oil",
    category: "Oils",
    stock_level: 25,
    unit: "liters",
    quantity: 5,
    price_per_unit: 12.99,
    supplier: "Mediterranean Imports",
    last_ordered: "2023-04-28",
    status: "Low Stock"
  },
  {
    id: 4,
    name: "Tomatoes",
    category: "Vegetables",
    stock_level: 40,
    unit: "kg",
    quantity: 10,
    price_per_unit: 2.99,
    supplier: "Local Farms Co-op",
    last_ordered: "2023-05-17",
    status: "In Stock"
  },
  {
    id: 5,
    name: "Heavy Cream",
    category: "Dairy",
    stock_level: 15,
    unit: "liters",
    quantity: 3,
    price_per_unit: 4.50,
    supplier: "Dairy Delights",
    last_ordered: "2023-05-12",
    status: "Low Stock"
  },
  {
    id: 6,
    name: "Salmon Fillet",
    category: "Seafood",
    stock_level: 50,
    unit: "kg",
    quantity: 15,
    price_per_unit: 22.99,
    supplier: "Ocean Harvest",
    last_ordered: "2023-05-14",
    status: "In Stock"
  },
  {
    id: 7,
    name: "Red Wine",
    category: "Beverages",
    stock_level: 80,
    unit: "bottles",
    quantity: 40,
    price_per_unit: 18.99,
    supplier: "Vineyard Selections",
    last_ordered: "2023-04-20",
    status: "In Stock"
  },
  {
    id: 8,
    name: "Garlic",
    category: "Vegetables",
    stock_level: 10,
    unit: "kg",
    quantity: 2,
    price_per_unit: 5.99,
    supplier: "Local Farms Co-op",
    last_ordered: "2023-05-05",
    status: "Low Stock"
  },
  {
    id: 9,
    name: "Chocolate",
    category: "Baking",
    stock_level: 65,
    unit: "kg",
    quantity: 10,
    price_per_unit: 9.99,
    supplier: "Sweet Supplies Inc.",
    last_ordered: "2023-04-25",
    status: "In Stock"
  },
  {
    id: 10,
    name: "Coffee Beans",
    category: "Beverages",
    stock_level: 30,
    unit: "kg",
    quantity: 5,
    price_per_unit: 15.99,
    supplier: "Global Roasters",
    last_ordered: "2023-05-08",
    status: "In Stock"
  }
];
