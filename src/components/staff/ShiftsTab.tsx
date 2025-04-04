
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addDays } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShiftRecord {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  position: string;
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
}

interface ShiftsTabProps {
  staffId: string;
}

const ShiftsTab: React.FC<ShiftsTabProps> = ({ staffId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // In a real app, you would fetch from your database
        // For the demo, we'll simulate loading and generate fake data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate fake shift records
        const records: ShiftRecord[] = [];
        const today = new Date();
        const positions = ['Kitchen', 'Front Desk', 'Service', 'Bar'];
        const statuses: ('scheduled' | 'completed' | 'missed')[] = ['scheduled', 'completed', 'missed'];
        
        // Generate 15 shifts (some past, some future)
        for (let i = -7; i < 8; i++) {
          const shiftDate = addDays(today, i);
          const isPast = i < 0;
          
          // Randomize position and status
          const position = positions[Math.floor(Math.random() * positions.length)];
          const status = isPast 
            ? (Math.random() > 0.2 ? 'completed' : 'missed') 
            : 'scheduled';
          
          records.push({
            id: `shift-${i+7}`,
            date: format(shiftDate, 'yyyy-MM-dd'),
            start_time: '09:00',
            end_time: '17:00',
            position,
            status,
            notes: status === 'missed' ? 'Staff called in sick' : undefined
          });
        }
        
        setShifts(records);
      } catch (error) {
        console.error("Error fetching shift data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShifts();
  }, [staffId]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  // Group shifts by past, today, upcoming
  const today = format(new Date(), 'yyyy-MM-dd');
  const pastShifts = shifts.filter(shift => shift.date < today);
  const todayShifts = shifts.filter(shift => shift.date === today);
  const upcomingShifts = shifts.filter(shift => shift.date > today);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ShiftSummaryCard 
          title="Today's Shift" 
          count={todayShifts.length}
          text={todayShifts.length > 0 
            ? `${todayShifts[0].start_time} - ${todayShifts[0].end_time}`
            : 'No shifts scheduled'}
          color="bg-blue-100 text-blue-800"
        />
        <ShiftSummaryCard 
          title="Upcoming Shifts" 
          count={upcomingShifts.length}
          text={`Next ${upcomingShifts.length} days`}
          color="bg-green-100 text-green-800"
        />
        <ShiftSummaryCard 
          title="Completed Shifts" 
          count={pastShifts.filter(s => s.status === 'completed').length}
          text={`Out of ${pastShifts.length} scheduled`}
          color="bg-purple-100 text-purple-800"
        />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Shift Schedule</h3>
          <div className="space-y-6">
            {upcomingShifts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Upcoming Shifts</h4>
                <div className="space-y-3">
                  {upcomingShifts.map(shift => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))}
                </div>
              </div>
            )}
            
            {todayShifts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Today</h4>
                <div className="space-y-3">
                  {todayShifts.map(shift => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))}
                </div>
              </div>
            )}
            
            {pastShifts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Past Shifts</h4>
                <div className="space-y-3">
                  {pastShifts.slice(0, 5).map(shift => (
                    <ShiftCard key={shift.id} shift={shift} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ShiftSummaryCardProps {
  title: string;
  count: number;
  text: string;
  color: string;
}

const ShiftSummaryCard: React.FC<ShiftSummaryCardProps> = ({ 
  title, 
  count, 
  text,
  color
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-slate-100">
            <CalendarRange className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <div className="mt-1 text-2xl font-bold">{count}</div>
            <p className="mt-1 text-xs">
              <span className={`inline-block px-2 py-0.5 rounded-full ${color}`}>
                {text}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ShiftCardProps {
  shift: ShiftRecord;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-sm font-medium">
              {format(new Date(shift.date), 'EEE')}
            </div>
            <div className="text-2xl font-bold">
              {format(new Date(shift.date), 'dd')}
            </div>
            <div className="text-xs text-slate-500">
              {format(new Date(shift.date), 'MMM')}
            </div>
          </div>
          
          <div className="ml-2">
            <h4 className="font-medium">{shift.position}</h4>
            <p className="text-sm text-slate-500">{shift.start_time} - {shift.end_time}</p>
            {shift.notes && (
              <p className="text-xs mt-1 text-slate-600">{shift.notes}</p>
            )}
          </div>
        </div>
        
        <Badge 
          className={`mt-3 md:mt-0 ${getStatusColor(shift.status)}`}
          variant="outline"
        >
          {shift.status}
        </Badge>
      </div>
    </div>
  );
};

export default ShiftsTab;
