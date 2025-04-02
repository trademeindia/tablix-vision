
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, UserCheck, ChefHat, UserCog, Clock 
} from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Skeleton } from '@/components/ui/skeleton';

interface StaffOverviewProps {
  staffData: StaffMember[];
  isLoading: boolean;
}

const StaffOverview: React.FC<StaffOverviewProps> = ({ staffData, isLoading }) => {
  const stats = useMemo(() => {
    const totalStaff = staffData.length;
    const activeStaff = staffData.filter(staff => staff.status === 'active').length;
    
    // Count roles
    const roles = staffData.reduce((acc, staff) => {
      const role = staff.role.toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Simulate on-duty (in a real app, this would be based on shift data)
    const onDuty = Math.min(activeStaff, Math.floor(Math.random() * activeStaff) + 1);

    return {
      totalStaff,
      activeStaff,
      roles,
      onDuty
    };
  }, [staffData]);

  // Get count for each role, defaulting to 0 if not present
  const getCount = (role: string) => {
    return stats.roles[role.toLowerCase()] || 0;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total Staff"
        value={stats.totalStaff}
        icon={<Users className="h-5 w-5 text-blue-600" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Active Staff"
        value={stats.activeStaff}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="Staff by Role"
        value={`${getCount('Waiter')}W ${getCount('Chef')}C ${getCount('Manager')}M`}
        icon={<UserCog className="h-5 w-5 text-purple-600" />}
        isLoading={isLoading}
      />
      <StatCard 
        title="On Duty Now"
        value={stats.onDuty}
        icon={<Clock className="h-5 w-5 text-orange-600" />}
        isLoading={isLoading}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isLoading }) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffOverview;
