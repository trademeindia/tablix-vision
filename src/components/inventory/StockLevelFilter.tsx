
import React from 'react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  CircleCheck, 
  CircleMinus, 
  CircleX 
} from 'lucide-react';

export type StockLevel = 'all' | 'high' | 'medium' | 'low';

interface StockLevelFilterProps {
  selectedStockLevel: StockLevel;
  onSelectStockLevel: (level: StockLevel) => void;
  isLoading?: boolean;
}

const StockLevelFilter: React.FC<StockLevelFilterProps> = ({
  selectedStockLevel,
  onSelectStockLevel,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Filter by Stock Level:</label>
      <ToggleGroup 
        type="single" 
        variant="outline"
        value={selectedStockLevel}
        disabled={isLoading}
        onValueChange={(value: string) => {
          if (value) onSelectStockLevel(value as StockLevel);
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="all" aria-label="Show all stock levels">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="high" aria-label="Show high stock only">
          <CircleCheck className="mr-1 h-4 w-4 text-green-500" />
          High
        </ToggleGroupItem>
        <ToggleGroupItem value="medium" aria-label="Show medium stock only">
          <CircleMinus className="mr-1 h-4 w-4 text-amber-500" />
          Medium
        </ToggleGroupItem>
        <ToggleGroupItem value="low" aria-label="Show low stock only">
          <CircleX className="mr-1 h-4 w-4 text-red-500" />
          Low
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default StockLevelFilter;
