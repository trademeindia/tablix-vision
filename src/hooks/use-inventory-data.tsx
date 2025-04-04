
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/components/inventory/InventoryItemsTable';
import { StockLevel } from '@/services/inventory';
import { initialInventoryItems } from '@/data/mock-inventory';

export const useInventoryData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockLevel, setSelectedStockLevel] = useState<StockLevel>("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryItems = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual Supabase query in production
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
    categoryCount: 8, // Number of actual categories (excluding 'All')
    lowStockCount,
    lastOrderDate: "May 17",
    inventoryValue: "$12,580",
    inventoryTrend: "+2.5% from last month"
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStockLevel,
    setSelectedStockLevel,
    isAddItemDialogOpen,
    setIsAddItemDialogOpen,
    inventoryItems,
    filteredItems,
    isLoading,
    getCategoryCount,
    handleAddItem,
    statsData
  };
};
