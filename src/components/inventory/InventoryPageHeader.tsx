
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryItem } from '@/types/inventory';
import ExportButton from './ExportButton';

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
  inventoryItems,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-md flex-1">
        <Input
          placeholder="Search inventory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          className="bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <ExportButton inventoryItems={inventoryItems} disabled={isLoading} />
        <Button 
          onClick={onAddItemClick} 
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default InventoryPageHeader;
