
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { InventoryItem } from './InventoryItemsTable';
import { exportToCSV } from '@/utils/export';

interface ExportButtonProps {
  inventoryItems: InventoryItem[];
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ inventoryItems, disabled }) => {
  const handleExport = () => {
    const formattedData = inventoryItems.map(item => ({
      'Item Name': item.name,
      'Category': item.category,
      'Stock Level': `${item.stock_level}%`,
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Price Per Unit': `$${item.price_per_unit.toFixed(2)}`,
      'Total Value': `$${(item.quantity * item.price_per_unit).toFixed(2)}`,
      'Supplier': item.supplier,
      'Last Ordered': item.last_ordered,
      'Status': item.status
    }));

    // Fix: Add the third parameter for the exportToCSV function (file extension)
    exportToCSV(formattedData, 'inventory-report', 'csv');
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || inventoryItems.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
};

export default ExportButton;
