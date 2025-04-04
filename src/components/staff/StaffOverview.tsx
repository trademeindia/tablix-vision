
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StaffMember } from '@/types/staff';
import { Users, UserCheck, UserX, UserCog } from 'lucide-react';

interface StaffOverviewProps {
  staffData: StaffMember[];
  isLoading: boolean;
}

const StaffOverview: React.FC<StaffOverviewProps> = ({ staffData, isLoading }) => {
  const stats = useMemo(() => {
    const totalStaff = staffData.length;
    const activeStaff = staffData.filter(staff => staff.status === 'active').length;
    const chefs = staffData.filter(staff => staff.role === 'Chef').length;
    const managers = staffData.filter(staff => staff.role === 'Manager').length;
    
    return {
      totalStaff,
      activeStaff,
      inactiveStaff: totalStaff - activeStaff,
      chefs,
      managers
    };
  }, [staffData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Staff" 
        value={stats.totalStaff} 
        icon={<Users className="h-8 w-8 text-primary" />}
        detail={`${stats.activeStaff} active, ${stats.inactiveStaff} inactive`}
      />
      
      <StatCard 
        title="Active Staff" 
        value={stats.activeStaff} 
        icon={<UserCheck className="h-8 w-8 text-green-500" />}
        detail={`${Math.round((stats.activeStaff / stats.totalStaff || 0) * 100)}% of total staff`}
      />
      
      <StatCard 
        title="Chefs & Kitchen" 
        value={stats.chefs} 
        icon={<UserX className="h-8 w-8 text-amber-500" />}
        detail={`${Math.round((stats.chefs / stats.totalStaff || 0) * 100)}% of total staff`}
      />
      
      <StatCard 
        title="Management" 
        value={stats.managers} 
        icon={<UserCog className="h-8 w-8 text-blue-500" />}
        detail={`${Math.round((stats.managers / stats.totalStaff || 0) * 100)}% of total staff`}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  detail: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, detail }) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-5 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <div className="mt-1 text-3xl font-bold">{value}</div>
                <p className="mt-1 text-xs text-slate-500">{detail}</p>
              </div>
              <div className="p-2 rounded-full bg-slate-50">{icon}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffOverview;
