
// Add this file to update the StaffOverview component
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StaffMember } from '@/types/staff';
import { Users, UserCheck, UserX, ChefHat, Clipboard, UserCog } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StaffOverviewProps {
  staffData: StaffMember[];
  isLoading: boolean;
}

const StaffOverview: React.FC<StaffOverviewProps> = ({ staffData, isLoading }) => {
  // Count active and inactive staff
  const activeStaff = staffData.filter(staff => staff.status === 'active').length;
  const inactiveStaff = staffData.filter(staff => staff.status === 'inactive').length;
  
  // Count staff by role
  const roleCount = {
    'Waiter': staffData.filter(staff => staff.role?.toLowerCase() === 'waiter').length,
    'Chef': staffData.filter(staff => staff.role?.toLowerCase() === 'chef').length,
    'Manager': staffData.filter(staff => staff.role?.toLowerCase() === 'manager').length,
    'Receptionist': staffData.filter(staff => staff.role?.toLowerCase() === 'receptionist').length,
  };
  
  const cards = [
    { title: 'Total Staff', value: staffData.length, icon: <Users className="h-5 w-5 text-blue-500" /> },
    { title: 'Active Staff', value: activeStaff, icon: <UserCheck className="h-5 w-5 text-green-500" /> },
    { title: 'Inactive Staff', value: inactiveStaff, icon: <UserX className="h-5 w-5 text-red-500" /> },
    { title: 'Waiters', value: roleCount['Waiter'], icon: <Clipboard className="h-5 w-5 text-indigo-500" /> },
    { title: 'Chefs', value: roleCount['Chef'], icon: <ChefHat className="h-5 w-5 text-amber-500" /> },
    { title: 'Managers', value: roleCount['Manager'], icon: <UserCog className="h-5 w-5 text-purple-500" /> },
  ];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <div className="flex items-center justify-center mb-2">
              {card.icon}
              <span className="ml-2 text-sm font-medium text-slate-600">{card.title}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffOverview;
