
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StockLevel } from './StockLevelFilter';
import InventoryPageHeader from './InventoryPageHeader';
import InventoryItemsTable, { InventoryItem } from './InventoryItemsTable';
import InventoryCategorySidebar from './InventoryCategorySidebar';
import InventoryPageFilters from './InventoryPageFilters';
import InventoryStatsCards from './InventoryStatsCards';
import InventoryStatsCardsSkeleton from './InventoryStatsCardsSkeleton';
import InventoryCategorySidebarSkeleton from './InventoryCategorySidebarSkeleton';
import AddItemDialog from './AddItemDialog';

interface InventoryPageLayoutProps {
  inventoryItems: InventoryItem[];
  filteredItems: InventoryItem[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStockLevel: StockLevel;
  setSelectedStockLevel: (level: StockLevel) => void;
  categories: Array<{ name: string; icon: React.ElementType }>;
  getCategoryCount: (categoryName: string) => number;
  isAddItemDialogOpen: boolean;
  setIsAddItemDialogOpen: (isOpen: boolean) => void;
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

const InventoryPageLayout: React.FC<InventoryPageLayoutProps> = ({
  inventoryItems,
  filteredItems,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStockLevel,
  setSelectedStockLevel,
  categories,
  getCategoryCount,
  isAddItemDialogOpen,
  setIsAddItemDialogOpen,
  handleAddItem,
  statsData
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <p className="text-muted-foreground">
          Track and manage your restaurant's inventory items
        </p>
      </div>
      
      {/* Stats Cards */}
      {isLoading ? (
        <InventoryStatsCardsSkeleton />
      ) : (
        <InventoryStatsCards
          totalItems={statsData.totalItems}
          categoryCount={statsData.categoryCount}
          lowStockCount={statsData.lowStockCount}
          lastOrderDate={statsData.lastOrderDate}
          inventoryValue={statsData.inventoryValue}
          inventoryTrend={statsData.inventoryTrend}
        />
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar - Categories & Filters */}
        <div className="flex flex-col space-y-6">
          {isLoading ? (
            <InventoryCategorySidebarSkeleton />
          ) : (
            <InventoryCategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              getCategoryCount={getCategoryCount}
            />
          )}
          
          {/* Filters */}
          <InventoryPageFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStockLevel={selectedStockLevel}
            setSelectedStockLevel={setSelectedStockLevel}
            isLoading={isLoading}
            onAddItemClick={() => setIsAddItemDialogOpen(true)}
          />
        </div>
        
        {/* Inventory Table */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-4">
            <InventoryPageHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoading}
              onAddItemClick={() => setIsAddItemDialogOpen(true)}
            />
          </CardHeader>
          <CardContent>
            <InventoryItemsTable
              items={filteredItems}
              isLoading={isLoading}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedStockLevel={selectedStockLevel}
              onAddItem={() => setIsAddItemDialogOpen(true)}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Add Item Dialog */}
      <AddItemDialog
        isOpen={isAddItemDialogOpen}
        onClose={() => setIsAddItemDialogOpen(false)}
        onAddItem={handleAddItem}
        categories={categories}
      />
    </div>
  );
};

export default InventoryPageLayout;
