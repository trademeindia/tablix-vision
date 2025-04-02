
import React, { useState } from 'react';
import { useShiftData } from '@/hooks/use-shift-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isToday, isThisWeek, isFuture } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface ShiftsTabProps {
  staffId: string;
}

const ShiftsTab: React.FC<ShiftsTabProps> = ({ staffId }) => {
  const { upcomingShifts, pastShifts, isLoading } = useShiftData(staffId);
  const [view, setView] = useState<string>('upcoming');
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  // Helper function to format and display shifts in a table
  const renderShiftsTable = (shifts: any[]) => {
    if (shifts.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          No shifts found for this period.
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift) => {
            const shiftDate = parseISO(shift.date);
            
            // Determine badge color based on date
            let badgeClass = '';
            if (isToday(shiftDate)) {
              badgeClass = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            } else if (isThisWeek(shiftDate) && isFuture(shiftDate)) {
              badgeClass = 'bg-green-100 text-green-800 hover:bg-green-100';
            }
            
            return (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-slate-500" />
                    {format(shiftDate, 'EEE, MMM d, yyyy')}
                    {isToday(shiftDate) && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Today</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-slate-500" />
                    {shift.start_time} - {shift.end_time}
                  </div>
                </TableCell>
                <TableCell>{shift.position}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      shift.status === 'completed' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : badgeClass || 'bg-slate-100 text-slate-800 hover:bg-slate-100'
                    }
                  >
                    {shift.status === 'completed' ? 'Completed' : 'Scheduled'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {shift.notes || '—'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Shifts</TabsTrigger>
          <TabsTrigger value="past">Past Shifts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {renderShiftsTable(upcomingShifts)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {renderShiftsTable(pastShifts)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border rounded-md p-4 text-center">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-xs font-medium text-slate-500">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index + 1;
                    const hasShift = upcomingShifts.some(shift => 
                      parseInt(format(parseISO(shift.date), 'd')) === (day % 31)
                    );
                    
                    return (
                      <div 
                        key={index} 
                        className={`aspect-square flex items-center justify-center rounded-md text-sm ${
                          hasShift 
                            ? 'bg-primary text-white font-medium' 
                            : 'border hover:bg-slate-100'
                        } ${day === 15 ? 'ring-2 ring-offset-2 ring-blue-300' : ''}`}
                      >
                        {day % 31 || 31}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-sm text-slate-500">
                  Full calendar view with shift scheduling will be implemented in a future update.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftsTab;
