
import React from 'react';
import { StockLevel } from '@/types/inventory';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface StockLevelFilterProps {
  value: StockLevel;
  onChange: (value: StockLevel) => void;
  disabled?: boolean;
}

const StockLevelFilter: React.FC<StockLevelFilterProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val: StockLevel) => onChange(val)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by stock level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Levels</SelectItem>
        <SelectItem value="low">Low Stock (≤25%)</SelectItem>
        <SelectItem value="medium">Medium Stock (26-75%)</SelectItem>
        <SelectItem value="high">High Stock (&gt;75%)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StockLevelFilter;
