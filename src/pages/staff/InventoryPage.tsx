
import React from 'react';
import StaffDashboardLayout from "@/components/layout/StaffDashboardLayout";
import { inventoryCategories } from '@/data/inventory-categories';
import InventoryPageLayout from '@/components/inventory/InventoryPageLayout';
import { useInventoryData } from '@/hooks/use-inventory-data';

const InventoryPage = () => {
  const {
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
  } = useInventoryData();
  
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
        categories={inventoryCategories}
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
