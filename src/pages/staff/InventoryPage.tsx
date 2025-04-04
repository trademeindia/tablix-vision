
import React from 'react';
import StaffDashboardLayout from "@/components/layout/StaffDashboardLayout";
import StaffInventoryLayout from "@/components/staff/inventory/StaffInventoryLayout";
import { useStaffInventoryData } from '@/hooks/staff/use-staff-inventory-data';

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
  } = useStaffInventoryData();
  
  return (
    <StaffDashboardLayout>
      <StaffInventoryLayout
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStockLevel={selectedStockLevel}
        setSelectedStockLevel={setSelectedStockLevel}
        isAddItemDialogOpen={isAddItemDialogOpen}
        setIsAddItemDialogOpen={setIsAddItemDialogOpen}
        inventoryItems={inventoryItems}
        filteredItems={filteredItems}
        isLoading={isLoading}
        getCategoryCount={getCategoryCount}
        handleAddItem={handleAddItem}
        statsData={statsData}
      />
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
