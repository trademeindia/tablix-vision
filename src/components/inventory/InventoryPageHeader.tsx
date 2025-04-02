
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExportButton from './ExportButton';
import { InventoryItem } from './InventoryItemsTable';

interface InventoryPageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  onAddItemClick: () => void;
  inventoryItems: InventoryItem[];
}

const InventoryPageHeader: React.FC<InventoryPageHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  onAddItemClick,
  inventoryItems
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
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <h2 className="text-xl font-bold tracking-tight">Inventory Items</h2>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <div className="relative md:hidden">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8 w-full sm:w-[200px] md:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <ExportButton 
          data={inventoryItems}
          headers={csvHeaders}
          fileName="inventory-data.csv"
          variant="outline"
          className="hidden md:flex"
          disabled={isLoading || inventoryItems.length === 0}
        >
          Export CSV
        </ExportButton>
        <Button onClick={onAddItemClick} disabled={isLoading} className="hidden md:flex">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default InventoryPageHeader;
