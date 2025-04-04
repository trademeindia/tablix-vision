
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ArrowDownUp, Table2 } from 'lucide-react';
import TableGrid from '@/components/tables/TableGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { generateDemoTables, DemoTable } from '@/utils/demo-data/table-data';
import AddTableDialog from '@/components/tables/AddTableDialog';
import { toast } from '@/hooks/use-toast';

const TablesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<DemoTable[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false);
  
  // Load demo tables
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo tables
      const demoTables = generateDemoTables(15);
      setTables(demoTables);
      setIsLoading(false);
    };
    
    fetchTables();
  }, []);
  
  // Update table status
  const handleStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { 
              ...table, 
              status: newStatus,
              // Add necessary details based on new status
              ...(newStatus === 'occupied' 
                ? { 
                    occupiedSince: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    orderId: `ORD-${1000 + Math.floor(Math.random() * 9000)}`
                  } 
                : {}),
              // Clear reservation info if changing from reserved to something else
              ...(newStatus !== 'reserved' && table.status === 'reserved'
                ? { reservationInfo: undefined }
                : {})
            } 
          : table
      )
    );
  };
  
  // Handle making a reservation
  const handleMakeReservation = (tableId: string, reservationInfo: any) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status: 'reserved', reservationInfo } 
          : table
      )
    );
  };
  
  // Handle adding a new table
  const handleAddTable = (tableData: { number: number, seats: number, section?: string }) => {
    const newTable: DemoTable = {
      id: `table-${Date.now()}`, // Generate a unique ID
      number: tableData.number,
      seats: tableData.seats,
      status: 'available',
      section: tableData.section || 'Main Dining', // Default section if not provided
    };
    
    // Check if table number already exists
    const tableNumberExists = tables.some(table => table.number === tableData.number);
    if (tableNumberExists) {
      toast({
        title: "Table number already exists",
        description: `A table with number ${tableData.number} already exists. Please choose a different number.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add the new table to the tables array
    setTables(prevTables => [...prevTables, newTable]);
    
    toast({
      title: "Table added",
      description: `Table ${tableData.number} has been added successfully.`,
    });
  };
  
  // Filter tables based on selected filter
  const filteredTables = filter === 'all' 
    ? tables 
    : tables.filter(table => table.status === filter);
  
  // Group tables by section
  const sections = tables.reduce((acc, table) => {
    if (table.section && !acc.includes(table.section)) {
      acc.push(table.section);
    }
    return acc;
  }, [] as string[]);
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tables Management</h1>
          <p className="text-slate-500">Manage restaurant tables and reservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            size="sm" 
            className="h-9"
            onClick={() => setIsAddTableDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Tables Overview</CardTitle>
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="occupied">Occupied</TabsTrigger>
                <TabsTrigger value="reserved">Reserved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Tables</div>
                    <div className="text-2xl font-bold">{tables.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Available</div>
                    <div className="text-2xl font-bold text-green-600">
                      {tables.filter(t => t.status === 'available').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Occupied</div>
                    <div className="text-2xl font-bold text-red-600">
                      {tables.filter(t => t.status === 'occupied').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Reserved</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {tables.filter(t => t.status === 'reserved').length}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {tables.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Table2 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tables added yet</h3>
                  <p className="text-slate-500 max-w-md mb-4">
                    Start by adding tables to your restaurant layout. You can organize them by sections and set their capacity.
                  </p>
                  <Button 
                    onClick={() => setIsAddTableDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Table
                  </Button>
                </div>
              ) : sections.length > 0 ? (
                <Tabs defaultValue={sections[0]}>
                  <TabsList className="mb-4">
                    {sections.map(section => (
                      <TabsTrigger key={section} value={section}>
                        {section}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {sections.map(section => (
                    <TabsContent key={section} value={section}>
                      <TableGrid 
                        tables={filteredTables.filter(table => table.section === section)} 
                        onStatusChange={handleStatusChange}
                        onMakeReservation={handleMakeReservation}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <TableGrid 
                  tables={filteredTables} 
                  onStatusChange={handleStatusChange}
                  onMakeReservation={handleMakeReservation}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AddTableDialog 
        isOpen={isAddTableDialogOpen}
        onOpenChange={setIsAddTableDialogOpen}
        onAddTable={handleAddTable}
        sections={sections}
      />
    </DashboardLayout>
  );
};

export default TablesPage;
