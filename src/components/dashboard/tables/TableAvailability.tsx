
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TableAvailabilityProps {
  tables: Array<{
    id: number;
    occupied: boolean;
    number: string;
  }>;
}

const TableAvailability: React.FC<TableAvailabilityProps> = ({ tables }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium">Table Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {tables.map(table => (
            <div 
              key={table.id} 
              className={cn(
                "flex items-center justify-center h-14 rounded-lg border transition-colors",
                table.occupied 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
              )}
            >
              <span className="text-sm font-medium">{table.number}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableAvailability;
