
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
        <div className="grid grid-cols-5 gap-3">
          {tables.map(table => (
            <div 
              key={table.id} 
              className={`flex items-center justify-center h-14 rounded-lg border ${
                table.occupied 
                  ? 'bg-blue-600 text-white border-blue-700' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
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
