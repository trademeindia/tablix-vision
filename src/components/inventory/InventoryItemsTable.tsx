
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InventoryItemsTableSkeleton from './InventoryItemsTableSkeleton';
import { StockLevel, InventoryItem } from '@/types/inventory';
import { formatCurrency } from '@/utils/format';

interface InventoryItemsTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedStockLevel: StockLevel;
  onAddItem: () => void;
}

const InventoryItemsTable: React.FC<InventoryItemsTableProps> = ({
  items,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedStockLevel,
  onAddItem
}) => {
  if (isLoading) {
    return <InventoryItemsTableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">No inventory items found</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery || selectedCategory !== "All" || selectedStockLevel !== "all"
            ? "Try adjusting your filters"
            : "Get started by adding your first inventory item"}
        </p>
        <Button onClick={onAddItem}>
          Add New Item
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-16 rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${
                        item.stock_level <= 25
                          ? "bg-red-500"
                          : item.stock_level <= 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${item.stock_level}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.stock_level}%</span>
                </div>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{formatCurrency(item.price_per_unit)}</TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryItemsTable;
