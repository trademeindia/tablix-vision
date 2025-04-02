
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Utensils, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

interface TableGridProps {
  tables: Table[];
  onStatusChange: (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => void;
  onMakeReservation?: (tableId: string, reservationInfo: Table['reservationInfo']) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onStatusChange, onMakeReservation }) => {
  const [reservationData, setReservationData] = React.useState<{
    tableId: string;
    customerName: string;
    contactNumber: string;
    date: string;
    time: string;
    guestCount: number;
    specialInstructions: string;
  }>({
    tableId: '',
    customerName: '',
    contactNumber: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guestCount: 2,
    specialInstructions: '',
  });
  
  const [isReservationDialogOpen, setIsReservationDialogOpen] = React.useState(false);

  const handleTableClick = (tableId: string) => {
    // Get the current table
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    // Cycle through statuses: available -> occupied -> reserved -> available
    let newStatus: 'available' | 'occupied' | 'reserved';
    
    switch (table.status) {
      case 'available':
        newStatus = 'occupied';
        break;
      case 'occupied':
        newStatus = 'reserved';
        break;
      case 'reserved':
        newStatus = 'available';
        break;
      default:
        newStatus = 'available';
    }
    
    onStatusChange(tableId, newStatus);
  };
  
  const openReservationDialog = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    setReservationData({
      ...reservationData,
      tableId,
      guestCount: Math.min(table.seats, reservationData.guestCount)
    });
    
    setIsReservationDialogOpen(true);
  };
  
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onMakeReservation) {
      onMakeReservation(reservationData.tableId, {
        customerName: reservationData.customerName,
        contactNumber: reservationData.contactNumber,
        date: reservationData.date,
        time: reservationData.time,
        guestCount: reservationData.guestCount,
        specialInstructions: reservationData.specialInstructions
      });
    }
    
    // Also change the status to reserved
    onStatusChange(reservationData.tableId, 'reserved');
    
    // Close the dialog
    setIsReservationDialogOpen(false);
  };

  const getStatusColors = (status: 'available' | 'occupied' | 'reserved') => {
    switch (status) {
      case 'available':
        return {
          border: "border-green-200",
          badge: "bg-green-100 text-green-800",
          icon: "text-green-500"
        };
      case 'occupied':
        return {
          border: "border-red-200",
          badge: "bg-red-100 text-red-800",
          icon: "text-red-500"
        };
      case 'reserved':
        return {
          border: "border-orange-200",
          badge: "bg-orange-100 text-orange-800",
          icon: "text-orange-500"
        };
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const colors = getStatusColors(table.status);
          
          return (
            <Card 
              key={table.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                colors.border
              )}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Table {table.number}</h3>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-slate-400 mr-1" />
                      <span className="text-sm text-slate-500">{table.seats} seats</span>
                    </div>
                  </div>
                  
                  <Badge
                    className={cn(
                      "capitalize",
                      colors.badge
                    )}
                  >
                    {table.status}
                  </Badge>
                </div>
                
                {table.status === 'occupied' && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{table.occupiedSince}</span>
                    </div>
                    {table.orderId && (
                      <p className="text-sm font-medium mt-1">Order #{table.orderId}</p>
                    )}
                  </div>
                )}
                
                {table.status === 'reserved' && table.reservationInfo && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{table.reservationInfo.date} at {table.reservationInfo.time}</span>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <span>{table.reservationInfo.customerName}</span>
                      <span className="mx-1">•</span>
                      <span>{table.reservationInfo.guestCount} guests</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleTableClick(table.id)}
                  >
                    Change Status
                  </Button>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={table.status === 'available' ? "default" : "secondary"}
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReservationDialog(table.id);
                        }}
                        disabled={table.status === 'occupied'}
                      >
                        <Calendar className="mr-1 h-4 w-4" />
                        Reserve
                      </Button>
                    </TooltipTrigger>
                    {table.status === 'occupied' && (
                      <TooltipContent>
                        <p>Table must be available to make a reservation</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
                
                {table.nextReservation && (
                  <div className="mt-3 text-xs bg-blue-50 text-blue-800 p-2 rounded-md flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Reserved at {table.nextReservation.time} for {table.nextReservation.customerName}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make a Reservation</DialogTitle>
            <DialogDescription>
              Fill in the details to reserve this table.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleReservationSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="customerName" className="text-sm font-medium">Customer Name</label>
              <input
                id="customerName"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.customerName}
                onChange={(e) => setReservationData({ ...reservationData, customerName: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
              <input
                id="contactNumber"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.contactNumber}
                onChange={(e) => setReservationData({ ...reservationData, contactNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <input
                  id="date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={reservationData.date}
                  onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="time" className="text-sm font-medium">Time</label>
                <input
                  id="time"
                  type="time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={reservationData.time}
                  onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="guestCount" className="text-sm font-medium">Number of Guests</label>
              <input
                id="guestCount"
                type="number"
                min="1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.guestCount}
                onChange={(e) => setReservationData({ ...reservationData, guestCount: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="specialInstructions" className="text-sm font-medium">Special Instructions</label>
              <textarea
                id="specialInstructions"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.specialInstructions}
                onChange={(e) => setReservationData({ ...reservationData, specialInstructions: e.target.value })}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Create Reservation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableGrid;
