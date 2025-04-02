
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryPageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  onAddItemClick: () => void;
}

const InventoryPageHeader: React.FC<InventoryPageHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  onAddItemClick
}) => {
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
        <Button onClick={onAddItemClick} disabled={isLoading} className="hidden md:flex">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default InventoryPageHeader;
