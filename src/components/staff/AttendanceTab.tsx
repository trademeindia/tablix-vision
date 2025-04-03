
import React from 'react';
import { useAttendanceData } from '@/hooks/use-attendance-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Clock, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface AttendanceTabProps {
  staffId: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ staffId }) => {
  const { attendanceRecords, attendanceStats, isLoading } = useAttendanceData(staffId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceStats.totalPresent} days</div>
            <p className="text-xs text-muted-foreground">
              {attendanceStats.presentPercentage}% of working days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{attendanceStats.totalLate} days</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((attendanceStats.totalLate / attendanceRecords.length) * 100)}% of working days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{attendanceStats.totalAbsent} days</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((attendanceStats.totalAbsent / attendanceRecords.length) * 100)}% of working days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Record (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.slice(0, 10).map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(record.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {record.status === 'present' && <div className="flex items-center text-green-600"><Check className="w-4 h-4 mr-1" /> Present</div>}
                    {record.status === 'late' && <div className="flex items-center text-amber-600"><Clock className="w-4 h-4 mr-1" /> Late</div>}
                    {record.status === 'absent' && <div className="flex items-center text-red-600"><X className="w-4 h-4 mr-1" /> Absent</div>}
                  </TableCell>
                  <TableCell>{record.check_in || '—'}</TableCell>
                  <TableCell>{record.check_out || '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{record.notes || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTab;
