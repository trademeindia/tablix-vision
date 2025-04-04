
export type StockLevel = 'low' | 'medium' | 'high' | 'all';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock_level: number;
  unit: string;
  quantity: number;
  price_per_unit: number;
  supplier: string;
  last_ordered: string;
  status: string;
}
