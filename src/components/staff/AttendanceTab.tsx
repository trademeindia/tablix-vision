
import React, { useState, useEffect } from 'react';
import { StaffAttendanceRecord, StaffAttendanceStats } from '@/types/staff';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface AttendanceTabProps {
  staffId: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ staffId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<StaffAttendanceRecord[]>([]);
  const [stats, setStats] = useState<StaffAttendanceStats>({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    presentPercentage: 0
  });
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // In a real app, you would fetch from your database
        // For the demo, we'll simulate loading and generate fake data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate fake attendance records
        const today = new Date();
        const records: StaffAttendanceRecord[] = [];
        
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          // Generate a random status with weighted probability
          const statusRand = Math.random();
          let status: 'present' | 'absent' | 'late';
          
          if (statusRand < 0.7) status = 'present';
          else if (statusRand < 0.9) status = 'late';
          else status = 'absent';
          
          const record: StaffAttendanceRecord = {
            id: `att-${i}`,
            date: format(date, 'yyyy-MM-dd'),
            status,
            check_in: status !== 'absent' ? `09:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
            check_out: status !== 'absent' ? `17:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
          };
          
          records.push(record);
        }
        
        // Calculate stats
        const present = records.filter(r => r.status === 'present').length;
        const absent = records.filter(r => r.status === 'absent').length;
        const late = records.filter(r => r.status === 'late').length;
        const total = records.length;
        
        setAttendance(records);
        setStats({
          totalPresent: present,
          totalAbsent: absent,
          totalLate: late,
          presentPercentage: Math.round((present / total) * 100)
        });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [staffId]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AttendanceStatCard 
          title="Present" 
          value={stats.totalPresent} 
          percentage={stats.presentPercentage}
          color="bg-green-100 text-green-800"
        />
        <AttendanceStatCard 
          title="Absent" 
          value={stats.totalAbsent} 
          percentage={Math.round((stats.totalAbsent / attendance.length) * 100)}
          color="bg-red-100 text-red-800"
        />
        <AttendanceStatCard 
          title="Late" 
          value={stats.totalLate} 
          percentage={Math.round((stats.totalLate / attendance.length) * 100)}
          color="bg-amber-100 text-amber-800"
        />
        <AttendanceStatCard 
          title="Attendance Rate" 
          value={`${stats.presentPercentage}%`} 
          color="bg-blue-100 text-blue-800"
        />
      </div>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-slate-50 border-b">
          <div>Date</div>
          <div>Status</div>
          <div>Check In</div>
          <div>Check Out</div>
        </div>
        <div className="divide-y">
          {attendance.slice(0, 10).map((record) => (
            <div key={record.id} className="grid grid-cols-4 gap-4 p-4">
              <div>{format(new Date(record.date), 'MMM dd, yyyy')}</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === 'present' ? 'bg-green-100 text-green-800' : 
                  record.status === 'late' ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
              <div>{record.check_in || '-'}</div>
              <div>{record.check_out || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface AttendanceStatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  color: string;
}

const AttendanceStatCard: React.FC<AttendanceStatCardProps> = ({ 
  title, 
  value, 
  percentage, 
  color 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        {percentage !== undefined && (
          <p className="mt-1 text-xs">
            <span className={`inline-block px-2 py-0.5 rounded-full ${color}`}>
              {percentage}%
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTab;
