
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, UserCheck, Filter } from 'lucide-react';

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real app, this would come from your database
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', visits: 12, lastVisit: '2023-09-15', status: 'active', loyaltyPoints: 240 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 987-6543', visits: 8, lastVisit: '2023-09-10', status: 'active', loyaltyPoints: 160 },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com', phone: '(555) 456-7890', visits: 5, lastVisit: '2023-08-22', status: 'inactive', loyaltyPoints: 100 },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '(555) 789-0123', visits: 15, lastVisit: '2023-09-18', status: 'active', loyaltyPoints: 300 },
    { id: 5, name: 'David Brown', email: 'david@example.com', phone: '(555) 234-5678', visits: 3, lastVisit: '2023-07-30', status: 'inactive', loyaltyPoints: 60 },
  ];
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <p className="text-slate-500">View and manage your restaurant customers</p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <div className="bg-white rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div>{customer.email}</div>
                      <div className="text-slate-500">{customer.phone}</div>
                    </TableCell>
                    <TableCell>{customer.visits}</TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {customer.status === 'active' ? (
                          <UserCheck className="mr-1 h-3 w-3" />
                        ) : null}
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>{customer.loyaltyPoints}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="m-0">
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Active customers view will be available soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="m-0">
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Inactive customers view will be available soon.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="loyalty" className="m-0">
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">Loyalty program customers view will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CustomersPage;
