
import React from 'react';
import { StockLevel } from '@/types/inventory';
import { inventoryCategories } from '@/data/inventory-categories';
import InventoryPageLayout from '@/components/inventory/InventoryPageLayout';
import { InventoryItem } from '@/types/inventory';

interface StaffInventoryLayoutProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStockLevel: StockLevel;
  setSelectedStockLevel: (level: StockLevel) => void;
  isAddItemDialogOpen: boolean;
  setIsAddItemDialogOpen: (isOpen: boolean) => void;
  inventoryItems: InventoryItem[];
  filteredItems: InventoryItem[];
  isLoading: boolean;
  getCategoryCount: (categoryName: string) => number;
  handleAddItem: (formData: any) => void;
  statsData: {
    totalItems: number;
    categoryCount: number;
    lowStockCount: number;
    lastOrderDate: string;
    inventoryValue: string;
    inventoryTrend: string;
  };
}

const StaffInventoryLayout: React.FC<StaffInventoryLayoutProps> = ({
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
}) => {
  return (
    <div>
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
        categories={inventoryCategories}
        getCategoryCount={getCategoryCount}
        isAddItemDialogOpen={isAddItemDialogOpen}
        setIsAddItemDialogOpen={setIsAddItemDialogOpen}
        handleAddItem={handleAddItem}
        statsData={statsData}
      />
    </div>
  );
};

export default StaffInventoryLayout;
