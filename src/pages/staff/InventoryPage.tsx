
import React, { useState, useEffect } from 'react';
import StaffDashboardLayout from '@/components/layout/StaffDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Filter, AlertTriangle, TrendingDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const InventoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate demo inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo inventory data
      const categories = ['Produce', 'Meat', 'Dairy', 'Grains', 'Beverages', 'Spices', 'Sauces'];
      const units = ['kg', 'g', 'l', 'ml', 'pcs', 'bottles', 'bags'];
      const suppliers = ['FreshFarms Inc.', 'Quality Foods', 'OrganicWholesale', 'Metro Supplies', 'FoodCo'];
      
      const demoInventory = Array.from({ length: 25 }).map((_, index) => {
        const name = [
          'Tomatoes', 'Chicken Breast', 'Olive Oil', 'Rice', 'Flour', 'Milk',
          'Eggs', 'Bell Peppers', 'Onions', 'Beef', 'Pasta', 'Cheese',
          'Red Wine', 'Garlic', 'Basil', 'Salt', 'Black Pepper', 'Sugar',
          'Lemons', 'Potatoes', 'Carrots', 'Butter', 'Coffee', 'Tea', 'Chocolate'
        ][index];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const unit = units[Math.floor(Math.random() * units.length)];
        const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
        
        // Current quantity between 0 and max quantity
        const maxQuantity = 100 + Math.floor(Math.random() * 900);
        const currentQuantity = Math.floor(Math.random() * maxQuantity);
        const lowThreshold = maxQuantity * 0.15;
        
        // Status based on current quantity
        let status = 'normal';
        if (currentQuantity <= lowThreshold) status = 'low';
        if (currentQuantity === 0) status = 'out';
        
        // 40% chance of having an expiration date
        const hasExpiration = Math.random() < 0.4;
        const expirationDate = hasExpiration ? 
          new Date(Date.now() + (Math.floor(Math.random() * 90) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
          null;
        
        return {
          id: `inv-${index + 1}`,
          name,
          category,
          currentQuantity,
          maxQuantity,
          unit,
          supplier,
          status,
          expirationDate,
          lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      });
      
      setInventory(demoInventory);
      setIsLoading(false);
    };
    
    fetchInventory();
  }, []);
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Low Stock</Badge>;
      case 'out':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>;
      case 'normal':
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>;
    }
  };
  
  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate inventory stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out').length;
  const expiringSoonItems = inventory.filter(item => 
    item.expirationDate && new Date(item.expirationDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  return (
    <StaffDashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-slate-500">Track and manage inventory</p>
      </div>
      
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Total Items</p>
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{isLoading ? <Skeleton className="h-8 w-16" /> : totalItems}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <TrendingDown className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : lowStockItems}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : outOfStockItems}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {isLoading ? <Skeleton className="h-8 w-16" /> : expiringSoonItems}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Inventory Status</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search inventory..." 
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No inventory items found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{item.currentQuantity} {item.unit}</span>
                              <span className="text-muted-foreground">{item.maxQuantity} {item.unit}</span>
                            </div>
                            <Progress 
                              value={(item.currentQuantity / item.maxQuantity) * 100} 
                              className={
                                item.status === 'out' ? 'bg-red-100' :
                                item.status === 'low' ? 'bg-amber-100' : 'bg-slate-100'
                              }
                              indicatorClassName={
                                item.status === 'out' ? 'bg-red-500' :
                                item.status === 'low' ? 'bg-amber-500' : ''
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.lastRestocked}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Restock</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </StaffDashboardLayout>
  );
};

export default InventoryPage;
