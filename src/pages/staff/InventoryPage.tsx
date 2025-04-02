import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle, 
  Package, 
  Utensils, 
  Coffee, 
  Wine, 
  ShoppingCart 
} from "lucide-react";
import StaffDashboardLayout from "@/components/layout/StaffDashboardLayout";

// Demo inventory data
const inventoryItems = [
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
const categories = [
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
  
  // Filter items based on search query and category
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Count low stock items
  const lowStockCount = inventoryItems.filter(item => item.status === "Low Stock").length;
  
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
          {/* Categories Sidebar */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                    {category.name === "All" ? (
                      <Badge className="ml-auto">{inventoryItems.length}</Badge>
                    ) : (
                      <Badge className="ml-auto">
                        {inventoryItems.filter(item => item.category === category.name).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Table */}
          <Card className="md:col-span-5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Items</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="w-[200px] pl-8 md:w-[300px]"
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={item.stock_level} 
                              className="h-2" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.stock_level}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>${item.price_per_unit}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "In Stock" ? "default" : "destructive"}
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Item Name</label>
              <Input id="name" placeholder="Enter item name" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <Select>
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
                <label htmlFor="quantity">Quantity</label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="unit">Unit</label>
                <Select>
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
              <label htmlFor="price">Price per Unit ($)</label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="supplier">Supplier</label>
              <Input id="supplier" placeholder="Enter supplier name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddItemDialogOpen(false)}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
