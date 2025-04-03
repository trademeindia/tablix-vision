
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
  
  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const getStaffImageUrl = (staff: StaffMember): string => {
    const imageUrl = staff.avatar_url || staff.avatar || staff.image || '';
    console.log(`Staff details image URL for ${staff.name}:`, imageUrl);
    return imageUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={getStaffImageUrl(staff)} 
                alt={staff.name} 
                onError={(e) => {
                  console.log(`Failed to load image in StaffDetailsDialog for staff: ${staff.name}, URL: ${getStaffImageUrl(staff)}`);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{staff.name}</DialogTitle>
              <p className="text-slate-500">{staff.role}</p>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Email</h3>
                    <p>{staff.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Phone</h3>
                    <p>{staff.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Department</h3>
                    <p>{staff.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Status</h3>
                    <p className={staff.status === 'active' ? 'text-green-600' : 'text-slate-500'}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Hire Date</h3>
                    <p>{staff.hire_date ? formatDate(staff.hire_date) : 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Salary</h3>
                    <p>{staff.salary ? `$${staff.salary.toLocaleString()}` : 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Emergency Contact</h3>
                    <p>{staff.emergency_contact || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                    <p>{staff.last_login ? formatDate(staff.last_login) : 'Never'}</p>
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
        
        <DialogFooter className="px-6 pb-6">
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
