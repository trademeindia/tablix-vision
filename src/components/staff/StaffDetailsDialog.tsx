import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffMember } from '@/types/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import AttendanceTab from './AttendanceTab';
import PayrollTab from './PayrollTab';
import ShiftsTab from './ShiftsTab';
import RoleIcon from './RoleIcon';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  open,
  onOpenChange,
  staff,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const getStaffImageUrl = (staff: StaffMember): string => {
    if (!staff.avatar_url && !staff.avatar && !staff.image) {
      return '';
    }
    
    return staff.avatar_url || staff.avatar || staff.image || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-md">
              {getStaffImageUrl(staff) && (
                <AvatarImage 
                  src={getStaffImageUrl(staff)} 
                  alt={staff.name}
                  className="object-cover" 
                  onError={(e) => {
                    console.log(`Failed to load image in StaffDetailsDialog for staff: ${staff.name}`);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {getInitials(staff.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl">{staff.name}</DialogTitle>
              <p className="text-slate-500 capitalize flex items-center justify-center sm:justify-start gap-1">
                <RoleIcon role={staff.role} className="h-4 w-4" />
                {staff.role}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Email</h3>
                    <p className="font-medium">{staff.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Phone</h3>
                    <p className="font-medium">{staff.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Department</h3>
                    <p className="font-medium">{staff.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Status</h3>
                    <p className={`font-medium ${staff.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Hire Date</h3>
                    <p className="font-medium">{staff.hire_date ? formatDate(staff.hire_date) : 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Salary</h3>
                    <p className="font-medium">{staff.salary ? `$${staff.salary.toLocaleString()}` : 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Emergency Contact</h3>
                    <p className="font-medium">{staff.emergency_contact || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                    <p className="font-medium">{staff.last_login ? formatDate(staff.last_login) : 'Never'}</p>
                  </div>
                </div>
              </Card>
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
        
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button 
            type="button" 
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
