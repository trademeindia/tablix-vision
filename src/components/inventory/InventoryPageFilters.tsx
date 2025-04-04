
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { StockLevel } from '@/services/inventory';
import StockLevelFilter from './StockLevelFilter';

interface InventoryPageFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStockLevel: StockLevel;
  setSelectedStockLevel: (level: StockLevel) => void;
  isLoading: boolean;
  onAddItemClick: () => void;
}

const InventoryPageFilters: React.FC<InventoryPageFiltersProps> = ({
  selectedStockLevel,
  setSelectedStockLevel,
  isLoading,
  onAddItemClick
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Filters</h3>
          
          <div className="space-y-2">
            <label htmlFor="stockLevel" className="text-sm">Stock Level</label>
            <StockLevelFilter
              value={selectedStockLevel}
              onChange={setSelectedStockLevel}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={onAddItemClick}
            className="w-full"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryPageFilters;
