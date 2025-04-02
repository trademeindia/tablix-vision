
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Package, MoreVertical } from 'lucide-react';
import InventoryItemsTableSkeleton from './InventoryItemsTableSkeleton';
import { StockLevel } from './StockLevelFilter';

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
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface InventoryItemsTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedStockLevel?: StockLevel;
  onAddItem: () => void;
}

const InventoryItemsTable: React.FC<InventoryItemsTableProps> = ({
  items,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedStockLevel = "all",
  onAddItem,
}) => {
  if (isLoading) {
    return <InventoryItemsTableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No items found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          {searchQuery ? 
            "No items match your search query." : 
            selectedCategory !== "All" ? 
              `No items in the ${selectedCategory} category.` : 
              selectedStockLevel !== "all" ?
                `No items with ${selectedStockLevel} stock level.` :
                "Your inventory is empty. Add some items to get started."}
        </p>
        <Button onClick={onAddItem}>
          <span className="mr-2">+</span>
          Add Item
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="hidden sm:table-cell">Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={item.stock_level} 
                      className={`h-2 w-16 sm:w-24 ${
                        item.stock_level <= 25 ? "bg-red-200" :
                        item.stock_level <= 75 ? "bg-amber-200" : 
                        "bg-green-200"
                      }`}
                    />
                    <div 
                      className="absolute h-2 rounded-full" 
                      style={{
                        width: `${item.stock_level}%`,
                        maxWidth: "24rem",
                        backgroundColor: item.stock_level <= 25 ? "#ef4444" :
                                        item.stock_level <= 75 ? "#f59e0b" : 
                                        "#22c55e",
                      }}
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.stock_level}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell whitespace-nowrap">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell>${item.price_per_unit.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "In Stock" ? "default" : "destructive"}
                    className="whitespace-nowrap"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Item</DropdownMenuItem>
                      <DropdownMenuItem>Order More</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryItemsTable;
