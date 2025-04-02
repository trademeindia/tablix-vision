import React, { useState, useEffect } from 'react';
import StaffDashboardLayout from "@/components/layout/StaffDashboardLayout";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Utensils, Coffee, Wine, LucideIcon } from 'lucide-react';
import { InventoryItem } from '@/components/inventory/InventoryItemsTable';
import InventoryPageLayout from '@/components/inventory/InventoryPageLayout';
import { StockLevel } from '@/components/inventory/StockLevelFilter';

// Interface for categories
interface Category {
  name: string;
  icon: LucideIcon;
}

// Demo inventory data - We'll use this initially and then replace with Supabase data
const initialInventoryItems: InventoryItem[] = [
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

// Categories with icons - Fixed to use LucideIcon
const categories: Category[] = [
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

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockLevel, setSelectedStockLevel] = useState<StockLevel>("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // In a real app, we would fetch data from Supabase
  useEffect(() => {
    const fetchInventoryItems = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual Supabase query
        // const { data, error } = await supabase
        //   .from('inventory_items')
        //   .select('*');
        
        // if (error) throw error;
        // if (data) setInventoryItems(data);
        
        // For now, we'll use the demo data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setInventoryItems(initialInventoryItems);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inventory items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventoryItems();
  }, [toast]);
  
  // Filter items based on search query, category, and stock level
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
    // Filter by stock level
    const matchesStockLevel = selectedStockLevel === "all" || 
                             (selectedStockLevel === "low" && item.stock_level <= 25) ||
                             (selectedStockLevel === "medium" && item.stock_level > 25 && item.stock_level <= 75) ||
                             (selectedStockLevel === "high" && item.stock_level > 75);
    
    return matchesSearch && matchesCategory && matchesStockLevel;
  });
  
  // Count items in each category
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All") return inventoryItems.length;
    return inventoryItems.filter(item => item.category === categoryName).length;
  };
  
  // Count low stock items
  const lowStockCount = inventoryItems.filter(item => item.status === "Low Stock").length;
  
  const handleAddItem = (formData: any) => {
    // In a real app, this would send data to Supabase
    // For demo purposes, we'll just add it to the local state
    const newItem: InventoryItem = {
      id: inventoryItems.length + 1,
      name: formData.name,
      category: formData.category,
      stock_level: 100, // New items start at 100%
      unit: formData.unit,
      quantity: parseInt(formData.quantity),
      price_per_unit: parseFloat(formData.price),
      supplier: formData.supplier,
      last_ordered: new Date().toISOString().split('T')[0],
      status: "In Stock"
    };
    
    setInventoryItems([...inventoryItems, newItem]);
    setIsAddItemDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `${formData.name} has been added to inventory`,
    });
  };

  // Prepare stats data
  const statsData = {
    totalItems: inventoryItems.length,
    categoryCount: categories.length - 1, // Subtract 'All' category
    lowStockCount,
    lastOrderDate: "May 17",
    inventoryValue: "$12,580",
    inventoryTrend: "+2.5% from last month"
  };
  
  return (
    <StaffDashboardLayout>
      <InventoryPageLayout
        inventoryItems={inventoryItems}
        filteredItems={filteredItems}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStockLevel={selectedStockLevel}
        setSelectedStockLevel={setSelectedStockLevel}
        categories={categories}
        getCategoryCount={getCategoryCount}
        isAddItemDialogOpen={isAddItemDialogOpen}
        setIsAddItemDialogOpen={setIsAddItemDialogOpen}
        handleAddItem={handleAddItem}
        statsData={statsData}
      />
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
