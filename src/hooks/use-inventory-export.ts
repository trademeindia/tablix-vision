
import { InventoryItem } from '@/components/inventory/InventoryItemsTable';
import { exportToCSV } from '@/utils/export';

// Define CSV headers structure for export
interface ExportHeader {
  key: string;
  label: string;
}

// Default headers for inventory items export
const defaultInventoryHeaders: ExportHeader[] = [
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

export function useInventoryExport() {
  // Export inventory data to CSV
  const exportInventory = (
    data: InventoryItem[], 
    headers: ExportHeader[] = defaultInventoryHeaders,
    fileName: string = 'inventory-data.csv'
  ) => {
    exportToCSV(data, headers, fileName);
  };
  
  return {
    exportInventory,
    defaultHeaders: defaultInventoryHeaders
  };
}
