
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Utensils, 
  Coffee, 
  Wine
} from "lucide-react";
import StaffDashboardLayout from "@/components/layout/StaffDashboardLayout";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Type definitions
interface InventoryItem {
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

// Demo inventory data - We'll use this initially and then replace with Supabase data
const initialInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Chicken Breast",
    category: "Meat",
    stock_level: 75,
    unit: "kg",
    quantity: 25,
    price_per_unit: 8.99,
    supplier: "Premium Meats Inc.",
    last_ordered: "2023-05-15",
    status: "In Stock"
  },
  {
    id: 2,
    name: "Basmati Rice",
    category: "Grains",
    stock_level: 60,
    unit: "kg",
    quantity: 30,
    price_per_unit: 3.49,
    supplier: "Global Foods",
    last_ordered: "2023-05-10",
    status: "In Stock"
  },
  {
    id: 3,
    name: "Olive Oil",
    category: "Oils",
    stock_level: 25,
    unit: "liters",
    quantity: 5,
    price_per_unit: 12.99,
    supplier: "Mediterranean Imports",
    last_ordered: "2023-04-28",
    status: "Low Stock"
  },
  {
    id: 4,
    name: "Tomatoes",
    category: "Vegetables",
    stock_level: 40,
    unit: "kg",
    quantity: 10,
    price_per_unit: 2.99,
    supplier: "Local Farms Co-op",
    last_ordered: "2023-05-17",
    status: "In Stock"
  },
  {
    id: 5,
    name: "Heavy Cream",
    category: "Dairy",
    stock_level: 15,
    unit: "liters",
    quantity: 3,
    price_per_unit: 4.50,
    supplier: "Dairy Delights",
    last_ordered: "2023-05-12",
    status: "Low Stock"
  },
  {
    id: 6,
    name: "Salmon Fillet",
    category: "Seafood",
    stock_level: 50,
    unit: "kg",
    quantity: 15,
    price_per_unit: 22.99,
    supplier: "Ocean Harvest",
    last_ordered: "2023-05-14",
    status: "In Stock"
  },
  {
    id: 7,
    name: "Red Wine",
    category: "Beverages",
    stock_level: 80,
    unit: "bottles",
    quantity: 40,
    price_per_unit: 18.99,
    supplier: "Vineyard Selections",
    last_ordered: "2023-04-20",
    status: "In Stock"
  },
  {
    id: 8,
    name: "Garlic",
    category: "Vegetables",
    stock_level: 10,
    unit: "kg",
    quantity: 2,
    price_per_unit: 5.99,
    supplier: "Local Farms Co-op",
    last_ordered: "2023-05-05",
    status: "Low Stock"
  },
  {
    id: 9,
    name: "Chocolate",
    category: "Baking",
    stock_level: 65,
    unit: "kg",
    quantity: 10,
    price_per_unit: 9.99,
    supplier: "Sweet Supplies Inc.",
    last_ordered: "2023-04-25",
    status: "In Stock"
  },
  {
    id: 10,
    name: "Coffee Beans",
    category: "Beverages",
    stock_level: 30,
    unit: "kg",
    quantity: 5,
    price_per_unit: 15.99,
    supplier: "Global Roasters",
    last_ordered: "2023-05-08",
    status: "In Stock"
  }
];

// Categories with icons
interface Category {
  name: string;
  icon: React.ElementType;
  count?: number;
}

const categories: Category[] = [
  { name: "All", icon: Package },
  { name: "Meat", icon: Utensils },
  { name: "Vegetables", icon: Utensils },
  { name: "Beverages", icon: Coffee },
  { name: "Dairy", icon: Package },
  { name: "Seafood", icon: Utensils },
  { name: "Grains", icon: Package },
  { name: "Oils", icon: Wine },
  { name: "Baking", icon: Package }
];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // In a real app, we would fetch data from Supabase
  useEffect(() => {
    const fetchInventoryItems = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual Supabase query
        // const { data, error } = await supabase
        //   .from('inventory_items')
        //   .select('*');
        
        // if (error) throw error;
        // if (data) setInventoryItems(data);
        
        // For now, we'll use the demo data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setInventoryItems(initialInventoryItems);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inventory items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventoryItems();
  }, [toast]);
  
  // Filter items based on search query and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Count items in each category
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All") return inventoryItems.length;
    return inventoryItems.filter(item => item.category === categoryName).length;
  };
  
  // Count low stock items
  const lowStockCount = inventoryItems.filter(item => item.status === "Low Stock").length;
  
  const handleAddItem = (formData: any) => {
    // In a real app, this would send data to Supabase
    // For demo purposes, we'll just add it to the local state
    const newItem: InventoryItem = {
      id: inventoryItems.length + 1,
      name: formData.name,
      category: formData.category,
      stock_level: 100, // New items start at 100%
      unit: formData.unit,
      quantity: parseInt(formData.quantity),
      price_per_unit: parseFloat(formData.price),
      supplier: formData.supplier,
      last_ordered: new Date().toISOString().split('T')[0],
      status: "In Stock"
    };
    
    setInventoryItems([...inventoryItems, newItem]);
    setIsAddItemDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `${formData.name} has been added to inventory`,
    });
  };
  
  return (
    <StaffDashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage your restaurant's inventory items
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Items
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <p className="text-xs text-muted-foreground">
                across {categories.length - 1} categories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">
                items need to be restocked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Order
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">May 17</div>
              <p className="text-xs text-muted-foreground">
                3 days ago
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,580</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Categories Sidebar */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                    <Badge className="ml-auto" variant="secondary">
                      {getCategoryCount(category.name)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Table */}
          <Card className="md:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle>Inventory Items</CardTitle>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="pl-8 w-full sm:w-[200px] md:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsAddItemDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading inventory items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {searchQuery ? 
                      "No items match your search query." : 
                      selectedCategory !== "All" ? 
                        `No items in the ${selectedCategory} category.` : 
                        "Your inventory is empty. Add some items to get started."}
                  </p>
                  <Button onClick={() => setIsAddItemDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              ) : (
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
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={item.stock_level} 
                                  className="h-2 w-16 sm:w-24" 
                                  indicatorColor={
                                    item.stock_level <= 25 ? "bg-red-500" :
                                    item.stock_level <= 50 ? "bg-amber-500" : 
                                    "bg-green-500"
                                  }
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details of the new inventory item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddItem({
              name: formData.get('name'),
              category: formData.get('category'),
              quantity: formData.get('quantity'),
              unit: formData.get('unit'),
              price: formData.get('price'),
              supplier: formData.get('supplier')
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Item Name</label>
                <Input id="name" name="name" placeholder="Enter item name" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.name !== "All").map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                  <Input id="quantity" name="quantity" type="number" placeholder="0" min="1" required />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="unit" className="text-sm font-medium">Unit</label>
                  <Select name="unit" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="bottles">Bottles</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">Price per Unit ($)</label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" min="0.01" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                <Input id="supplier" name="supplier" placeholder="Enter supplier name" required />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
