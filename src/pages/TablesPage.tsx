
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TableGrid from '@/components/tables/TableGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useOrderStatus } from '@/hooks/use-order-status'; // We'll create this hook

// Define Table type
interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  occupiedSince?: string;
  orderId?: string;
  reservationInfo?: {
    customerName: string;
    contactNumber: string;
    date: string;
    time: string;
    guestCount: number;
    specialInstructions?: string;
  };
  nextReservation?: {
    time: string;
    customerName: string;
  };
}

interface Reservation {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  contactNumber: string;
  date: string;
  time: string;
  guestCount: number;
  specialInstructions?: string;
  status: 'upcoming' | 'seated' | 'cancelled' | 'completed';
}

const TablesPage: React.FC = () => {
  // Sample data - converted to be mutable
  const initialTables: Table[] = [
    {
      id: "table1",
      number: 1,
      seats: 2,
      status: "available"
    },
    {
      id: "table2",
      number: 2,
      seats: 4,
      status: "occupied",
      occupiedSince: "1 hour ago",
      orderId: "1234"
    },
    {
      id: "table3",
      number: 3,
      seats: 2,
      status: "reserved",
      reservationInfo: {
        customerName: "John Smith",
        contactNumber: "555-123-4567",
        date: "2023-07-12",
        time: "19:30",
        guestCount: 2,
        specialInstructions: "Window seat preferred"
      }
    },
    {
      id: "table4",
      number: 4,
      seats: 6,
      status: "available"
    },
    {
      id: "table5",
      number: 5,
      seats: 4,
      status: "occupied",
      occupiedSince: "30 minutes ago",
      orderId: "1235"
    },
    {
      id: "table6",
      number: 6,
      seats: 2,
      status: "available"
    },
    {
      id: "table7",
      number: 7,
      seats: 8,
      status: "occupied",
      occupiedSince: "2 hours ago",
      orderId: "1236"
    },
    {
      id: "table8",
      number: 8,
      seats: 4,
      status: "available"
    }
  ];

  // Sample reservation data
  const initialReservations: Reservation[] = [
    {
      id: "res1",
      tableId: "table3",
      tableNumber: 3,
      customerName: "John Smith",
      contactNumber: "555-123-4567",
      date: "2023-07-12",
      time: "19:30",
      guestCount: 2,
      specialInstructions: "Window seat preferred",
      status: 'upcoming'
    },
    {
      id: "res2",
      tableId: "table6",
      tableNumber: 6,
      customerName: "Jane Doe",
      contactNumber: "555-987-6543",
      date: "2023-07-12",
      time: "20:00",
      guestCount: 2,
      status: 'upcoming'
    }
  ];

  const [tables, setTables] = useState<Table[]>(initialTables);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({
    number: tables.length + 1,
    seats: 4
  });

  // This is the key hook that will listen for order status changes
  const { completedOrders } = useOrderStatus();

  // Auto-update table status when orders are completed
  useEffect(() => {
    if (completedOrders.length > 0) {
      // For each completed order that has a tableId, update the table status
      completedOrders.forEach(orderId => {
        const tableWithOrder = tables.find(table => table.orderId === orderId);
        if (tableWithOrder) {
          setTables(prev =>
            prev.map(table =>
              table.id === tableWithOrder.id
                ? { ...table, status: 'available', orderId: undefined, occupiedSince: undefined }
                : table
            )
          );
          toast.success(`Table ${tableWithOrder.number} is now available`, {
            description: "Order has been completed and the table has been freed."
          });
        }
      });
    }
  }, [completedOrders, tables]);

  const handleStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => {
    setTables(prevTables => 
      prevTables.map(table => {
        if (table.id === tableId) {
          // If the table becomes available, clear any order info
          if (newStatus === 'available') {
            return { 
              ...table, 
              status: newStatus,
              orderId: undefined,
              occupiedSince: undefined
            };
          }
          // If the table becomes occupied, add placeholder order info if none exists
          else if (newStatus === 'occupied' && !table.orderId) {
            return {
              ...table,
              status: newStatus,
              occupiedSince: 'Just now',
              orderId: `temp-${Date.now()}`
            };
          }
          // For other status changes, just update the status
          return { ...table, status: newStatus };
        }
        return table;
      })
    );

    toast.success(`Table status updated`, {
      description: `Table has been marked as ${newStatus}`
    });
  };

  const handleMakeReservation = (tableId: string, reservationInfo: Table['reservationInfo']) => {
    // 1. Create a new reservation
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      tableId,
      tableNumber: tables.find(t => t.id === tableId)?.number || 0,
      customerName: reservationInfo.customerName,
      contactNumber: reservationInfo.contactNumber,
      date: reservationInfo.date,
      time: reservationInfo.time,
      guestCount: reservationInfo.guestCount,
      specialInstructions: reservationInfo.specialInstructions,
      status: 'upcoming'
    };
    
    setReservations([...reservations, newReservation]);
    
    // 2. Update the table with the reservation info
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status: 'reserved', reservationInfo } 
          : table
      )
    );

    toast.success(`Reservation created`, {
      description: `Table ${tables.find(t => t.id === tableId)?.number} has been reserved for ${reservationInfo.customerName}`
    });
  };

  const handleAddTable = () => {
    const newTableId = `table${Date.now()}`;
    
    setTables([
      ...tables,
      {
        id: newTableId,
        number: newTable.number,
        seats: newTable.seats,
        status: 'available'
      }
    ]);
    
    setIsAddTableDialogOpen(false);
    setNewTable({
      number: tables.length + 2,
      seats: 4
    });

    toast.success(`Table added`, {
      description: `Table ${newTable.number} with ${newTable.seats} seats has been added`
    });
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Table Management</h1>
          <p className="text-slate-500">Manage your restaurant tables and their status</p>
        </div>
        
        <Button onClick={() => setIsAddTableDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>
      
      <Tabs defaultValue="floor-plan" className="mb-6">
        <TabsList>
          <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="floor-plan" className="mt-4">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Restaurant Floor Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">Available</Badge>
                  <div className="text-sm text-slate-600">{tables.filter(t => t.status === 'available').length} Tables</div>
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-800 border-red-200 mb-2">Occupied</Badge>
                  <div className="text-sm text-slate-600">{tables.filter(t => t.status === 'occupied').length} Tables</div>
                </div>
                <div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-2">Reserved</Badge>
                  <div className="text-sm text-slate-600">{tables.filter(t => t.status === 'reserved').length} Tables</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TableGrid 
            tables={tables} 
            onStatusChange={handleStatusChange} 
            onMakeReservation={handleMakeReservation}
          />
        </TabsContent>
        
        <TabsContent value="reservations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No reservations yet</p>
                  <p className="text-sm">Reservations will appear here when customers make them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map(reservation => (
                    <div 
                      key={reservation.id} 
                      className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{reservation.customerName}</h3>
                        <Badge 
                          className={
                            reservation.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : reservation.status === 'seated' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-slate-400" />
                          {formatDate(reservation.date)} at {reservation.time}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-slate-400" />
                          {reservation.guestCount} guests
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <span className="text-slate-500 mr-1">Table:</span>
                        <span className="font-medium">#{reservation.tableNumber}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span className="text-slate-500 mr-1">Contact:</span>
                        <span>{reservation.contactNumber}</span>
                      </div>
                      
                      {reservation.specialInstructions && (
                        <>
                          <Separator className="my-3" />
                          <div className="text-sm">
                            <span className="text-slate-500">Notes:</span>
                            <p className="mt-1">{reservation.specialInstructions}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddTableDialogOpen} onOpenChange={setIsAddTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>
              Add a new table to your restaurant layout
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="tableNumber" className="text-sm font-medium">Table Number</label>
              <input
                id="tableNumber"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newTable.number}
                onChange={(e) => setNewTable({...newTable, number: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="seats" className="text-sm font-medium">Number of Seats</label>
              <input
                id="seats"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newTable.seats}
                onChange={(e) => setNewTable({...newTable, seats: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleAddTable}>Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TablesPage;
