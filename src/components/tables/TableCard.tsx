
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DemoTable } from '@/utils/demo-data/table-data';

interface TableCardProps {
  table: DemoTable;
  onStatusChange: (tableId: string) => void;
  onOpenReservation: (tableId: string) => void;
}

const TableCard: React.FC<TableCardProps> = ({ 
  table, 
  onStatusChange, 
  onOpenReservation 
}) => {
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

  // Get the current status colors
  const colors = getStatusColors(table.status);
  
  // Format time duration if table is occupied
  const getOccupationDuration = () => {
    if (!table.occupiedSince) return '';
    
    const [hours, minutes] = table.occupiedSince.split(':').map(Number);
    const occupiedTime = new Date();
    occupiedTime.setHours(hours, minutes, 0);
    
    const now = new Date();
    const diffMs = now.getTime() - occupiedTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else {
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    }
  };
  
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
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Since {table.occupiedSince}</span>
              </div>
              {getOccupationDuration() && (
                <Badge variant="outline" className="text-xs font-normal">
                  {getOccupationDuration()}
                </Badge>
              )}
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
            {table.reservationInfo.specialInstructions && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {table.reservationInfo.specialInstructions}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(table.id);
            }}
          >
            Change Status
          </Button>
          
          <Button 
            variant={table.status === 'available' ? "default" : "secondary"}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onOpenReservation(table.id);
            }}
            disabled={table.status === 'occupied'}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Reserve
          </Button>
        </div>
        
        {table.nextReservation && (
          <div className="mt-3 text-xs bg-blue-50 text-blue-800 p-2 rounded-md flex items-center">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              Reserved at {table.nextReservation.time} for {table.nextReservation.customerName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableCard;
