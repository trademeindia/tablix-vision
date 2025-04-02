
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DemoTable } from '@/utils/demo-data/table-data';
import TableCard from './TableCard';
import ReservationDialog from './ReservationDialog';

interface TableGridProps {
  tables: DemoTable[];
  onStatusChange: (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => void;
  onMakeReservation?: (tableId: string, reservationInfo: DemoTable['reservationInfo']) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ 
  tables, 
  onStatusChange, 
  onMakeReservation 
}) => {
  const [reservationData, setReservationData] = useState<{
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
  
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <TooltipProvider>
          {tables.map((table) => (
            <Tooltip key={table.id}>
              <TooltipTrigger asChild>
                <div>
                  <TableCard
                    table={table}
                    onStatusChange={handleTableClick}
                    onOpenReservation={openReservationDialog}
                  />
                </div>
              </TooltipTrigger>
              {table.status === 'occupied' && (
                <TooltipContent>
                  <p>Table must be available to make a reservation</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <ReservationDialog
        isOpen={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
        reservationData={reservationData}
        setReservationData={setReservationData}
        onSubmit={handleReservationSubmit}
      />
    </>
  );
};

export default TableGrid;
