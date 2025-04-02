
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StaffMember } from '@/types/staff';
import { UserCheck, UserX, ChefHat, User, UserCog } from 'lucide-react';

interface StaffOverviewProps {
  staffData: StaffMember[];
  isLoading: boolean;
}

const StaffOverview: React.FC<StaffOverviewProps> = ({ staffData, isLoading }) => {
  // Calculate staff metrics
  const totalStaff = staffData.length;
  const activeStaff = staffData.filter(staff => staff.status === 'active').length;
  const inactiveStaff = totalStaff - activeStaff;
  
  // Calculate role distribution
  const roleDistribution = staffData.reduce((acc, staff) => {
    const role = staff.role.toLowerCase();
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <div className="p-1 bg-primary/10 rounded-full">
            <User className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaff}</div>
          <p className="text-xs text-muted-foreground">
            {totalStaff > 0 ? `${activeStaff} active, ${inactiveStaff} inactive` : 'No staff members'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          <div className="p-1 bg-green-100 rounded-full">
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStaff}</div>
          <p className="text-xs text-muted-foreground">
            {totalStaff > 0 
              ? `${Math.round((activeStaff / totalStaff) * 100)}% of total staff` 
              : 'No staff members'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Chefs & Kitchen</CardTitle>
          <div className="p-1 bg-amber-100 rounded-full">
            <ChefHat className="w-4 h-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{roleDistribution['chef'] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {totalStaff > 0 
              ? `${Math.round(((roleDistribution['chef'] || 0) / totalStaff) * 100)}% of total staff` 
              : 'No kitchen staff'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Management</CardTitle>
          <div className="p-1 bg-blue-100 rounded-full">
            <UserCog className="w-4 h-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{roleDistribution['manager'] || 0}</div>
          <p className="text-xs text-muted-foreground">
            {totalStaff > 0 
              ? `${Math.round(((roleDistribution['manager'] || 0) / totalStaff) * 100)}% of total staff` 
              : 'No management staff'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffOverview;
