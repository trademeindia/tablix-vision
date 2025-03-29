
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TableGrid from '@/components/tables/TableGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Dummy data
const dummyTables = [
  { id: 'table1', number: 1, seats: 2, status: 'available' },
  { id: 'table2', number: 2, seats: 4, status: 'occupied', occupiedSince: '1 hour ago', orderId: '1234' },
  { id: 'table3', number: 3, seats: 6, status: 'reserved' },
  { id: 'table4', number: 4, seats: 2, status: 'available' },
  { id: 'table5', number: 5, seats: 4, status: 'occupied', occupiedSince: '30 minutes ago', orderId: '1235' },
  { id: 'table6', number: 6, seats: 8, status: 'available' },
  { id: 'table7', number: 7, seats: 2, status: 'occupied', occupiedSince: '2 hours ago', orderId: '1236' },
  { id: 'table8', number: 8, seats: 4, status: 'available' },
] as const;

const TablesPage = () => {
  const [tables, setTables] = useState(dummyTables);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isTableDetailOpen, setIsTableDetailOpen] = useState(false);
  
  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
    setIsTableDetailOpen(true);
  };
  
  const handleAddTable = () => {
    setIsAddDialogOpen(false);
    // Would implement actual table addition logic here
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Table Management</h1>
          <p className="text-slate-500">View and manage your restaurant tables</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>
      
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-green-600">4</p>
          <p className="text-sm text-slate-500">Available</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-slate-500">Occupied</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-yellow-600">1</p>
          <p className="text-sm text-slate-500">Reserved</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-slate-600">8</p>
          <p className="text-sm text-slate-500">Total Tables</p>
        </div>
      </div>
      
      <TableGrid 
        tables={tables}
        onTableClick={handleTableClick}
      />
      
      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>
              Create a new table for your restaurant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="table-number">Table Number</Label>
              <Input id="table-number" type="number" min="1" placeholder="Enter table number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Input id="seats" type="number" min="1" placeholder="Enter number of seats" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTable}>
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Table Detail Dialog - would be implemented in a real app */}
      <Dialog open={isTableDetailOpen} onOpenChange={setIsTableDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Table Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedTable && (
              <p>Showing details for table ID: {selectedTable}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsTableDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TablesPage;
