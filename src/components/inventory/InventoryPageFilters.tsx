
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockLevelFilter, { StockLevel } from './StockLevelFilter';

interface InventoryPageFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStockLevel: StockLevel;
  setSelectedStockLevel: (level: StockLevel) => void;
  isLoading: boolean;
  onAddItemClick: () => void;
}

const InventoryPageFilters: React.FC<InventoryPageFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStockLevel,
  setSelectedStockLevel,
  isLoading,
  onAddItemClick
}) => {
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

        {/* Add Item Button (Mobile) */}
        <div className="mt-6 block md:hidden">
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
