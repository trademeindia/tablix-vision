
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockLevelFilter, { StockLevel } from './StockLevelFilter';
import ExportButton from './ExportButton';
import { InventoryItem } from './InventoryItemsTable';

interface InventoryPageFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStockLevel: StockLevel;
  setSelectedStockLevel: (level: StockLevel) => void;
  isLoading: boolean;
  onAddItemClick: () => void;
  inventoryItems?: InventoryItem[];
}

const InventoryPageFilters: React.FC<InventoryPageFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStockLevel,
  setSelectedStockLevel,
  isLoading,
  onAddItemClick,
  inventoryItems = []
}) => {
  // Define CSV headers for export
  const csvHeaders = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'stock_level', label: 'Stock Level (%)' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    { key: 'price_per_unit', label: 'Price Per Unit' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'last_ordered', label: 'Last Ordered' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <Card className="md:col-span-1 h-fit">
      <CardHeader className="pb-3">
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {/* Stock Level Filter */}
        <StockLevelFilter 
          selectedStockLevel={selectedStockLevel}
          onSelectStockLevel={setSelectedStockLevel}
          isLoading={isLoading}
        />

        {/* Mobile Actions */}
        <div className="mt-6 space-y-2 block md:hidden">
          <ExportButton 
            data={inventoryItems}
            headers={csvHeaders}
            fileName="inventory-data.csv"
            variant="outline"
            className="w-full"
            disabled={isLoading || inventoryItems.length === 0}
          >
            Export CSV
          </ExportButton>
          <Button 
            className="w-full" 
            onClick={onAddItemClick} 
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryPageFilters;
