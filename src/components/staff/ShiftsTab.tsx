
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useShiftData } from '@/hooks/use-shift-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { ShiftSchedule } from '@/types/shift';

interface ShiftsTabProps {
  staffId?: string;
}

const ShiftsTab: React.FC<ShiftsTabProps> = ({ staffId }) => {
  const { shiftData, isLoading } = useShiftData(staffId);
  const [selectedView, setSelectedView] = useState<string>('table');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'swapped':
        return <Badge className="bg-yellow-500">Swapped</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  // Get shifts for the selected date in calendar view
  const shiftsForSelectedDate = shiftData.filter(shift => {
    const shiftDate = new Date(shift.shift_date);
    return (
      shiftDate.getDate() === selectedDate.getDate() &&
      shiftDate.getMonth() === selectedDate.getMonth() &&
      shiftDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Find dates that have shifts for calendar highlighting
  const datesWithShifts = shiftData.map(shift => new Date(shift.shift_date));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="table" onValueChange={setSelectedView}>
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No shifts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shiftData.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{formatDate(shift.shift_date)}</TableCell>
                          <TableCell>{formatTime(shift.start_time)}</TableCell>
                          <TableCell>{formatTime(shift.end_time)}</TableCell>
                          <TableCell>
                            {calculateDuration(shift.start_time, shift.end_time)}
                          </TableCell>
                          <TableCell>{getStatusBadge(shift.status)}</TableCell>
                          <TableCell>{shift.notes || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  className="rounded-md border"
                  modifiers={{
                    hasShift: datesWithShifts,
                  }}
                  modifiersStyles={{
                    hasShift: { fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shifts for {format(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                {shiftsForSelectedDate.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No shifts scheduled for this date.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {shiftsForSelectedDate.map((shift) => (
                      <div key={shift.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Duration: {calculateDuration(shift.start_time, shift.end_time)}
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(shift.status)}
                          </div>
                        </div>
                        {shift.notes && (
                          <p className="mt-2 text-sm border-t pt-2">
                            <span className="font-medium">Notes:</span> {shift.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to calculate shift duration
const calculateDuration = (startTime: string, endTime: string): string => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let hoursDiff = endHours - startHours;
  let minutesDiff = endMinutes - startMinutes;
  
  if (minutesDiff < 0) {
    hoursDiff--;
    minutesDiff += 60;
  }
  
  return `${hoursDiff} hrs ${minutesDiff > 0 ? `${minutesDiff} mins` : ''}`;
};

export default ShiftsTab;
