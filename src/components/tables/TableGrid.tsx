
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  occupiedSince?: string;
  orderId?: string;
}

interface TableGridProps {
  tables: Table[];
  onTableClick: (tableId: string) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <Card 
          key={table.id}
          className={cn(
            "cursor-pointer hover:shadow-md transition-shadow",
            table.status === 'available' && "border-green-200",
            table.status === 'occupied' && "border-red-200",
            table.status === 'reserved' && "border-yellow-200"
          )}
          onClick={() => onTableClick(table.id)}
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
                  table.status === 'available' && "bg-green-100 text-green-800",
                  table.status === 'occupied' && "bg-red-100 text-red-800",
                  table.status === 'reserved' && "bg-yellow-100 text-yellow-800"
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TableGrid;
