
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChefHat, UserCog, User, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceTab from './AttendanceTab';
import PayrollTab from './PayrollTab';
import ShiftsTab from './ShiftsTab';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  open,
  onOpenChange,
  staff
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'chef':
        return <ChefHat className="h-4 w-4 mr-1 text-amber-500" />;
      case 'manager':
        return <UserCog className="h-4 w-4 mr-1 text-blue-500" />;
      case 'waiter':
        return <User className="h-4 w-4 mr-1 text-green-500" />;
      default:
        return <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Profile</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold flex items-center">
                  {staff.name}
                  <Badge 
                    variant={staff.status === 'active' ? "default" : "secondary"}
                    className={`ml-2 ${staff.status === 'active' ? "bg-green-500" : "bg-slate-400"}`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </h3>
                <p className="text-sm text-slate-500 flex items-center">
                  {getRoleIcon(staff.role)} {staff.role}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact Information</p>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-500">Phone:</span> {staff.phone}</p>
                    <p><span className="text-slate-500">Email:</span> {staff.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">System Information</p>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-500">Last Login:</span> {formatDate(staff.last_login)}</p>
                    <p><span className="text-slate-500">Created:</span> {formatDate(staff.created_at)}</p>
                    <p><span className="text-slate-500">Updated:</span> {formatDate(staff.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <AttendanceTab staffId={staff.id} />
          </TabsContent>
          
          <TabsContent value="payroll">
            <PayrollTab staffId={staff.id} />
          </TabsContent>
          
          <TabsContent value="shifts">
            <ShiftsTab staffId={staff.id} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
